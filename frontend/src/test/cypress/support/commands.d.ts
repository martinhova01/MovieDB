/// <reference types="cypress" />

type Review = import("../../../types/__generated__/types").Review;
type MoviePoster = import("../../../types/movieTypes").MoviePoster;

declare namespace Cypress {
    interface Chainable {
        seedDatabase(): Chainable<void>;

        /**
         * Checks whether rendered posters correspond to recieved data (ordering etc.)
         *
         * As the API tests checks for correct filtering/sorting/searching, we don't
         * need to check this again here
         *
         * @param responseMovies movies from query response
         */
        checkMoviePosters(
            responseMovies: MoviePoster[],
            length?: number,
            slice?: number
        ): Chainable<void>;

        changeUsername(
            prevUsername: string,
            newUsername: string
        ): Chainable<void>;

        submitReview(
            movieId: number,
            username: string,
            rating: number,
            comment: string
        ): Chainable<void>;

        deleteFirstReview(comment: string, reviewId: string): Chainable<void>;

        checkReviewCards(
            responseMovies: Review[],
            length?: number,
            slice?: number
        ): Chainable<void>;
    }
}
