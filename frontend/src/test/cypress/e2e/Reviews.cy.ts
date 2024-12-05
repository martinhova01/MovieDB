import { Review } from "../../../types/__generated__/types";
import { aliasMutation, aliasQuery } from "../utils/graphql-test-utils";
import { expect } from "chai";

describe("Reviews", () => {
    beforeEach(() => {
        cy.seedDatabase();
        cy.intercept("POST", "http://localhost:3001/", (req) => {
            aliasMutation(req, "AddReview");
            aliasMutation(req, "DeleteReview");
        });
        cy.visit("/");
    });

    it("adds review properly", () => {
        cy.changeUsername("Guest", "testuser");

        // Go to movie
        cy.get('a[href*="movie/565770"]').click();
        cy.url().should("include", "/movie/");
        cy.contains("Submit review").should("be.visible");

        // Submit review
        cy.submitReview(565770, "testuser", 3, "This is a great movie!");

        // Go out of movie and then back in, to check cache was updated
        cy.contains("MovieDB").click();
        cy.url().should("not.include", "/movie/");
        cy.get('a[href*="movie/565770"]').click();
        cy.get("#review-comment").should("be.empty");
        cy.contains("This is a great movie!").should("be.visible");
    });

    it("removes delete option when changing username or signing out", () => {
        cy.changeUsername("Guest", "testuser2");

        // Go to movie
        cy.get('a[href*="movie/565770"]').click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Change username
        cy.changeUsername("testuser2", "nottestuser2");
        cy.contains("Delete").should("not.exist");

        // Sign out
        cy.contains("button", "nottestuser2").click();
        cy.contains("Sign out").click();
        cy.contains("Delete").should("not.exist");
    });

    it("deletes review properly", () => {
        // Go to movie
        cy.get('a[href*="movie/565770"]').click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Delete").should("not.exist"); // Guest users can't delete

        // Sign in
        cy.changeUsername("Guest", "testuser2");
        cy.contains("Delete").should("be.visible");

        // Click delete movie, but cancel
        cy.contains("Delete").click();
        cy.contains("Are you sure you want to delete this review?").should(
            "be.visible"
        );
        cy.contains("button", "Cancel").click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete movie
        cy.deleteFirstReview("It's quite good", "6736255c9c33bb841a3fee9a");

        // Go out of movie and then back in, to check cache was updated
        cy.contains("MovieDB").click();
        cy.get('a[href*="movie/565770"]').click();
        cy.contains("It's quite good").should("not.exist");
    });

    it("updates ActivityPage and MyReviewsPage when submitting a review", () => {
        cy.intercept("POST", "http://localhost:3001/", (req) => {
            aliasQuery(req, "GetLatestReviews");
            aliasQuery(req, "GetUserReviews");
        });
        cy.changeUsername("Guest", "testuser1");

        // Visit pages so we have data in cache
        cy.contains("Activity").click();
        cy.wait("@gqlGetLatestReviewsQuery").then(({ request, response }) => {
            expect(request.body.variables).to.deep.equal({
                skip: 0,
                limit: 20,
            });
            cy.checkReviewCards(
                (response?.body.data.latestReviews ?? []) as Review[],
                20
            );
        });
        cy.contains("This is a great movie!").should("not.exist");

        cy.contains("My Reviews").click();
        cy.wait("@gqlGetUserReviewsQuery").then(({ request, response }) => {
            expect(request.body.variables).to.deep.equal({
                skip: 0,
                limit: 20,
                username: "testuser1",
            });
            cy.checkReviewCards(
                (response?.body.data.userReviews ?? []) as Review[],
                3
            );
        });
        cy.contains("This is a great movie!").should("not.exist");

        cy.contains("MovieDB").click();

        // Go to movie
        cy.get('a[href*="movie/565770"]').click();

        // Submit review
        cy.submitReview(565770, "testuser1", 3, "This is a great movie!");

        // Go to Activity page to see that it's updated
        cy.contains("Activity").click();
        cy.url().should("include", "activity");
        cy.contains("Latest Activity").should("be.visible");
        cy.contains("This is a great movie!").should("be.visible");

        // Go to My Reviews page to see that it's updated
        cy.contains("My Reviews").click();
        cy.url().should("include", "myReviews");
        cy.contains("This is a great movie!").should("be.visible");
    });

    it("updates ActivityPage and MyReviewsPage when deleting a review", () => {
        cy.changeUsername("Guest", "testuser2");

        // Visit pages so we have data in cache
        cy.contains("Activity").click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("My Reviews").click();
        cy.contains("It's quite good").should("be.visible");

        cy.contains("MovieDB").click();

        // Go to movie
        cy.get('a[href*="movie/565770"]').click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete review
        cy.deleteFirstReview("It's quite good", "6736255c9c33bb841a3fee9a");

        // Go to Activity page to see that it's updated
        cy.contains("Activity").click();
        cy.url().should("include", "activity");
        cy.contains("It's quite good").should("not.exist");

        // Go to My Reviews page to see that it's updated
        cy.contains("My Reviews").click();
        cy.url().should("include", "myReviews");
        cy.contains("It's quite good").should("not.exist");

        // Return to home page via link
        cy.contains("You have not added any reviews yet").should("be.visible");
        cy.contains("Return to home page").click();
        cy.url().should("not.include", "myReviews");
        cy.contains("Total Hits").should("be.visible");
    });

    it("handles username changes in MyReviewsPage", () => {
        cy.changeUsername("Guest", "testuser1");

        // Go to My Reviews page
        cy.contains("My Reviews").click();
        cy.url().should("include", "myReviews");
        cy.contains("Best movie ever made!").should("be.visible");
        cy.contains(
            "Great movie, but I can't talk about it. You know the rule."
        ).should("be.visible");
        cy.contains("This is going to be quite good.").should("be.visible");

        // Change username (reviews should be updated)
        cy.changeUsername("testuser1", "testuser2");
        cy.contains("Best movie ever made!").should("not.exist");
        cy.contains(
            "Great movie, but I can't talk about it. You know the rule."
        ).should("not.exist");
        cy.contains("This is going to be quite good.").should("not.exist");
        cy.contains("It's quite good").should("be.visible");

        // Sign out (should be sent back to homepage)
        cy.contains("button", "testuser2").click();
        cy.contains("Sign out").click();
        cy.url().should("not.include", "myReviews");
        cy.contains("Total Hits").should("be.visible");
        cy.contains("My Reviews").should("not.exist");
    });

    it("handles deletion in Activity page", () => {
        cy.changeUsername("Guest", "testuser2");

        // Visit Movie page and My Reviews so that we have data in cache
        cy.get('a[href*="movie"]').first().click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("My Reviews").click();
        cy.contains("It's quite good").should("be.visible");

        // Go to Activity page
        cy.contains("Activity").click();
        cy.contains("Latest Activity").should("be.visible");
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete review
        cy.deleteFirstReview("It's quite good", "6736255c9c33bb841a3fee9a");

        // Go back to My Reviews page (should be updated)
        cy.contains("My Reviews").click();
        cy.contains("It's quite good").should("not.exist");

        // Go back to Movie page (should be updated)
        cy.contains("MovieDB").click();
        cy.get('a[href*="movie"]').first().click();
        cy.contains("It's quite good").should("not.exist");

        // Go back to Activity page (should still be deleted)
        cy.contains("Activity").click();
        cy.contains("It's quite good").should("not.exist");
    });

    it("handles deletion in My Reviews page", () => {
        cy.changeUsername("Guest", "testuser2");

        // Visit Movie page and Activity page so that we have data in cache
        cy.get('a[href*="movie/565770"]').click();
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Activity").click();
        cy.contains("It's quite good").should("be.visible");

        // Go to My Reviews page
        cy.contains("My Reviews").click();
        cy.url().should("include", "myReviews");
        cy.contains("It's quite good").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete review
        cy.deleteFirstReview("It's quite good", "6736255c9c33bb841a3fee9a");

        // Visit Activity page (should be updated)
        cy.contains("Activity").click();
        cy.contains("It's quite good").should("not.exist");

        // Go back to Movie page (should be updated)
        cy.contains("MovieDB").click();
        cy.get('a[href*="movie/565770"]').click();
        cy.contains("It's quite good").should("not.exist");

        // Go back to My Reviews page (should still be deleted)
        cy.contains("My Reviews").click();
        cy.contains("It's quite good").should("not.exist");
    });

    it("handles loading more in Activity page and My Reviews page", () => {
        cy.intercept("POST", "http://localhost:3001/", (req) => {
            aliasQuery(req, "GetLatestReviews");
            aliasQuery(req, "GetUserReviews");
        });
        cy.changeUsername("Guest", "testuser3");

        // Go to My Activity page
        cy.contains("Activity").click();
        cy.url().should("include", "activity");
        cy.wait("@gqlGetLatestReviewsQuery");
        cy.get('a[href*="movie"]').should("have.length", 20);

        cy.window().scrollTo("bottom");
        cy.wait("@gqlGetLatestReviewsQuery").then(({ request, response }) => {
            expect(request.body.variables).to.deep.equal({
                skip: 20,
                limit: 20,
            });
            cy.checkReviewCards(
                (response?.body.data.latestReviews ?? []) as Review[],
                25,
                20
            );
        });

        // Go to My Reviews page
        cy.contains("My Reviews").click();
        cy.url().should("include", "myReviews");
        cy.wait("@gqlGetUserReviewsQuery");
        cy.get('a[href*="movie"]').should("have.length", 20);

        cy.window().scrollTo("bottom");
        cy.wait("@gqlGetUserReviewsQuery").then(({ request, response }) => {
            expect(request.body.variables).to.deep.equal({
                skip: 20,
                limit: 20,
                username: "testuser3",
            });
            cy.checkReviewCards(
                (response?.body.data.userReviews ?? []) as Review[],
                21,
                20
            );
        });

        // Change to another username
        cy.changeUsername("testuser3", "testuser1");
        cy.get('a[href*="movie"]').should("have.length", 3);

        // Delete review
        cy.deleteFirstReview(
            "This is going to be quite good.",
            "673627c79c33bb841a3fef74"
        );
        cy.get('a[href*="movie"]').should("have.length", 2);

        // Go back to Activity page (should be updated)
        cy.contains("Activity").click();
        cy.url().should("include", "activity");
        cy.get('a[href*="movie"]').should("have.length", 24);
    });
});
