/// <reference types="./commands.d.ts" />

import { Movie, Review } from "../../../types/__generated__/types";
import { MoviePoster } from "../../../types/movieTypes";
import { ObjectId } from "mongodb";
import { expect } from "chai";

// Interface to handle MongoDB-specific fixture format
interface MongoFixtureMovie {
    _id: number;
    title: string;
    release_date: { $date: string };
    reviews: { $oid: string }[];
}

interface MongoFixtureReview {
    _id: { $oid: string };
    movie: Movie;
    username: string;
    rating: number;
    comment: string;
    date: { $date: string };
}

Cypress.Commands.add("seedDatabase", () => {
    cy.deleteMany({}, { collection: "movies" });
    cy.deleteMany({}, { collection: "reviews" });

    cy.fixture("mock_db_movies").then((seed_movies: MongoFixtureMovie[]) => {
        const movie_data = seed_movies.map((movie) => ({
            ...movie,
            release_date: new Date(movie.release_date["$date"]),
            reviews: movie.reviews.map(
                (review) => new ObjectId(review["$oid"] as string)
            ),
        }));
        cy.insertMany(movie_data, { collection: "movies" });
    });

    cy.fixture("mock_db_reviews").then((seed_reviews: MongoFixtureReview[]) => {
        const review_data = seed_reviews.map((review) => ({
            ...review,
            date: new Date(review.date["$date"]),
            _id: new ObjectId(review._id["$oid"] as string),
        }));
        cy.insertMany(review_data, { collection: "reviews" });
    });
});

Cypress.Commands.add(
    "checkMoviePosters",
    (responseMovies: MoviePoster[], length = 20, slice = 0) => {
        cy.get('a[href*="movie"] img')
            .should("have.length", length)
            .then(($posters) => {
                const movieTitles = Cypress._.map($posters, "title");
                expect(movieTitles.slice(slice)).to.deep.equal(
                    responseMovies.map((movie) => movie.title)
                );
            });
    }
);

Cypress.Commands.add(
    "changeUsername",
    (prevUsername: string, newUsername: string) => {
        cy.contains("button", prevUsername).click();
        cy.contains("Change username").click();
        cy.get("#new-username").type(newUsername);
        cy.contains("button", "Change username").click();
        cy.contains("Username changed successfully").should("be.visible");
    }
);

Cypress.Commands.add(
    "submitReview",
    (movieId: number, username: string, rating: number, comment: string) => {
        cy.get(`[aria-label="${rating} star"]`).click();
        cy.get("#review-comment").type(comment);
        cy.contains("button", "Submit Review").click();
        cy.wait("@gqlAddReviewMutation").then(({ request, response }) => {
            expect(request.body.variables).to.deep.equal({
                movieId: movieId,
                username: username,
                rating: rating,
                comment: comment,
            });
            cy.wrap(response?.body.data.addReview).should("exist");
        });
        cy.contains("Review added successfully").should("be.visible");
        cy.get("#review-comment").should("be.empty");
        cy.contains(comment).should("be.visible");
    }
);

Cypress.Commands.add(
    "deleteFirstReview",
    (comment: string, reviewId: string) => {
        cy.contains("Delete").click();
        cy.contains("Are you sure you want to delete this review?").should(
            "be.visible"
        );
        cy.contains("button", "Continue").click();
        cy.wait("@gqlDeleteReviewMutation").then(({ request, response }) => {
            expect(request.body.variables).to.deep.equal({
                id: reviewId,
            });
            cy.wrap(response?.body.data.deleteReview).should("exist");
        });
        cy.contains("Review has been deleted").should("be.visible");
        cy.contains(comment).should("not.exist");
    }
);

Cypress.Commands.add(
    "checkReviewCards",
    (responseMovies: Review[], length = 20, slice = 0) => {
        cy.get('a[href*="movie"] img')
            .should("have.length", length)
            .then(($reviewCard) => {
                const movieTitles = Cypress._.map($reviewCard, "title");
                expect(movieTitles.slice(slice)).to.deep.equal(
                    responseMovies.map((review) => review.movie.title)
                );
            });
    }
);

export {};
