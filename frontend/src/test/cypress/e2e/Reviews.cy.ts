import { aliasQuery } from "../utils/graphql-test-utils";

describe("Reviews", () => {

    const changeUsername = (prevUsername: string, newUsername: string) => {
        cy.contains('button', prevUsername).click();
        cy.contains('Change username').click();
        cy.get("#new-username").type(newUsername);
        cy.contains("button", 'Change username').click();
        cy.contains("Username changed successfully").should("be.visible");
    };

    const submitReview = (rating: number, comment: string) => {
        cy.get('[role="input"]').eq(rating-1).click();
        cy.get("#review-comment").type(comment);
        cy.contains('button', 'Submit Review').click()
        cy.contains("Review added successfully").should("be.visible");
        cy.get("#review-comment").should("be.empty");
        cy.contains(comment).should("be.visible");
    };

    const deleteFirstReview = (comment: string) => {
        cy.contains("Delete").click();
        cy.contains("Are you sure you want to delete this review?").should("be.visible");
        cy.contains("button", "Continue").click();
        cy.contains("Review has been deleted").should("be.visible");
        cy.contains(comment).should("not.exist");
    };

    it("adds review properly", () => {
        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Go to movie
        cy.get('a[href*="movie"]').first().click();
        cy.url().should('include', '/movie/')
        cy.contains("Submit review").should("be.visible");

        // Submit review
        submitReview(3, "This is a great movie!");

        // Go out of movie and then back in, to check cache was updated
        cy.contains("MovieDB").click();
        cy.url().should('not.include', '/movie/')
        cy.get('a[href*="movie"]').first().click();
        cy.get("#review-comment").should("be.empty");
        cy.contains("This is a great movie!").should("be.visible");
    });

    it("removes delete option when changing username or signing out", () => {
        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Go to movie
        cy.get('a[href*="movie"]').first().click();
        cy.contains("This is a great movie!").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Change username
        changeUsername("testuser", "testuser2");
        cy.contains("Delete").should("not.exist");

        // Sign out
        cy.contains('button', "testuser2").click();
        cy.contains('Sign out').click();
        cy.contains("Delete").should("not.exist");
    });

    it("deletes review properly", () => {
        cy.visit("/");

        // Go to movie
        cy.get('a[href*="movie"]').first().click();
        cy.contains("This is a great movie!").should("be.visible");
        cy.contains("Delete").should("not.exist"); // Guest users can't delete

        // Sign in
        changeUsername("Guest", "testuser");
        cy.contains("Delete").should("be.visible");

        // Click delete movie, but cancel
        cy.contains("Delete").click();
        cy.contains("Are you sure you want to delete this review?").should("be.visible");
        cy.contains("button", "Cancel").click();
        cy.contains("This is a great movie!").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete movie
        deleteFirstReview("This is a great movie!");

        // Go out of movie and then back in, to check cache was updated
        cy.contains("MovieDB").click();
        cy.get('a[href*="movie"]').first().click();
        cy.contains("This is a great movie!").should("not.exist");
    });

    it("updates ActivityPage and MyReviewsPage when submitting a review", () => {
        cy.intercept('POST', 'http://localhost:3001/', (req) => {
            aliasQuery(req, 'GetLatestReviews')
            aliasQuery(req, 'GetUserReviews')
        });

        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Visit pages so we have data in cache (wait to avoid race conditions)
        cy.contains("Activity").click()
        cy.wait("@gqlGetLatestReviewsQuery");
        cy.contains("My Reviews").click()
        cy.wait("@gqlGetUserReviewsQuery");
        cy.contains("MovieDB").click()

        // Go to movie
        cy.get('a[href*="movie"]').first().click();

        // Submit review
        submitReview(3, "This is a great movie!");

        // Go to Activity page to see that it's updated
        cy.contains("Activity").click();
        cy.url().should('include', 'activity')
        cy.contains("Latest Activity").should("be.visible");
        cy.contains("This is a great movie!").should("be.visible");

        // Go to My Reviews page to see that it's updated
        cy.contains("My Reviews").click();
        cy.url().should('include', 'myReviews')
        cy.contains("This is a great movie!").should("be.visible");
    });

    it("updates ActivityPage and MyReviewsPage when deleting a review", () => {
        cy.intercept('POST', 'http://localhost:3001/', (req) => {
            aliasQuery(req, 'GetLatestReviews')
            aliasQuery(req, 'GetUserReviews')
        });
        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Visit pages so we have data in cache (wait to avoid race conditions)
        cy.contains("Activity").click()
        cy.wait("@gqlGetLatestReviewsQuery");
        cy.contains("My Reviews").click()
        cy.wait("@gqlGetUserReviewsQuery");
        cy.contains("MovieDB").click()

        // Go to movie
        cy.get('a[href*="movie"]').first().click();

        // Delete review
        deleteFirstReview("This is a great movie!");

        // Go to Activity page to see that it's updated
        cy.contains("Activity").click();
        cy.url().should('include', 'activity')
        cy.contains("This is a great movie!").should("not.exist");

        // Go to My Reviews pate to see that it's updated
        cy.contains("My Reviews").click();
        cy.url().should('include', 'myReviews')
        cy.contains("This is a great movie!").should("not.exist");

        // Return to home page via link
        cy.contains("You have not added any reviews yet").should("be.visible");
        cy.contains("Return to home page").click();
        cy.url().should('not.include', 'myReviews');
        cy.contains("Total Hits").should("be.visible");
    });

    it("handles username changes in MyReviewsPage", () => {
        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Go to movie
        cy.get('a[href*="movie"]').first().click();

        // Submit review
        submitReview(3, "This is a great movie!");

        // Go to My Reviews page
        cy.contains("My Reviews").click();
        cy.url().should('include', 'myReviews')
        cy.contains("This is a great movie!").should("be.visible");

        // Change username (reviews should be updated)
        changeUsername("testuser", "testuser2");
        cy.contains("This is a great movie!").should("not.exist");
        cy.contains("You have not added any reviews yet").should("be.visible");

        // Sign out (should be sent back to homepage)
        cy.contains('button', "testuser2").click();
        cy.contains('Sign out').click();
        cy.url().should('not.include', 'myReviews');
        cy.contains("Total Hits").should("be.visible");
    });

    it("handles deletion in Activity page", () => {
        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Visit Movie page and My Reviews so that we have data in cache
        cy.get('a[href*="movie"]').first().click();
        cy.contains("This is a great movie!").should("be.visible");
        cy.contains("My Reviews").click()
        cy.contains("This is a great movie!").should("be.visible");

        // Go to Activity page
        cy.contains("Activity").click();
        cy.contains("Latest Activity").should("be.visible");
        cy.contains("This is a great movie!").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete review
        deleteFirstReview("This is a great movie!");

        // Go back to My Reviews page (should be updated)
        cy.contains("My Reviews").click();
        cy.contains("This is a great movie!").should("not.exist");

        // Go back to MovieDetaildPage (should be updated)
        cy.contains("MovieDB").click();
        cy.get('a[href*="movie"]').first().click();
        cy.contains("This is a great movie!").should("not.exist");

        // Go back to Activity page (should still be deleted)
        cy.contains("Activity").click();
        cy.contains("This is a great movie!").should("not.exist");
    });

    it("handles deletion in My Reviews page", () => {
        cy.visit("/");

        changeUsername("Guest", "testuser");

        // Go to movie
        cy.get('a[href*="movie"]').first().click();
        cy.url().should('include', '/movie/')

        // Submit review
        submitReview(3, "This is a great movie!");

        // Visit Activity page so that we have data in cache
        cy.contains("Activity").click()
        cy.contains("This is a great movie!").should("be.visible");

        // Go to My Reviews page
        cy.contains("My Reviews").click();
        cy.url().should('include', 'myReviews')
        cy.contains("This is a great movie!").should("be.visible");
        cy.contains("Delete").should("be.visible");

        // Delete review
        deleteFirstReview("This is a great movie!");

        // Visit Activity page (should be updated)
        cy.contains("Activity").click()
        cy.contains("This is a great movie!").should("not.exist");

        // Go back to MovieDetaildPage (should be updated)
        cy.contains("MovieDB").click();
        cy.get('a[href*="movie"]').first().click();
        cy.contains("This is a great movie!").should("not.exist");

        // Go back to My Reviews page (should still be deleted)
        cy.contains("My Reviews").click();
        cy.contains("This is a great movie!").should("not.exist");
    });
});
