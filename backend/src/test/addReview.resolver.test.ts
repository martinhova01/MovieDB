import "./setup.server.ts";

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { describe, expect, it, vi } from "vitest";
import MovieModel from "../models/movie.model.ts";
import ReviewModel from "../models/review.model.ts";
import { resolveAddReview } from "../resolvers/addReview.resolver.ts";

describe("resolveAddReview", () => {
    it("should return error when movie not found", async () => {
        const review = await resolveAddReview({
            username: "test",
            movie_id: 0,
            rating: 5,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).toBeInstanceOf(GraphQLError);

        const error = review as GraphQLError;
        expect(error.message).toBe("Movie not found.");
    });

    it("should return error when rating is out of bounds", async () => {
        const review = await resolveAddReview({
            username: "test",
            movie_id: 670292,
            rating: 6,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).toBeInstanceOf(GraphQLError);

        const error = review as GraphQLError;
        expect(error.message).toBe(
            "Rating must be an integer between 1 and 5."
        );
    });

    it("should return success when all is well", async () => {
        const review = await resolveAddReview({
            username: "test",
            movie_id: 670292,
            rating: 5,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);
        expect(review).toHaveProperty("movie");
        expect(review).toMatchObject({
            username: "test",
            rating: 5,
            comment: "This is a review",
        });
    });

    it("should save the review to the database", async () => {
        const isReviewAlreadyPresent = await ReviewModel.findOne({
            username: "test",
            comment: "This is a review",
        });
        // First, check that the review is not already present
        expect(isReviewAlreadyPresent).toBeNull();

        const review = await resolveAddReview({
            username: "test",
            movie_id: 670292,
            rating: 5,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const savedReview = await ReviewModel.findOne({
            username: "test",
            comment: "This is a review",
        });

        expect(savedReview).not.toBeNull();
        expect(savedReview).toMatchObject({
            username: "test",
            movie: 670292,
            comment: "This is a review",
        });
    });

    it("should add the review to the movie", async () => {
        const isReviewAlreadyPresent = await MovieModel.findById(670292);
        // First, check that the review is not already present
        expect(isReviewAlreadyPresent).not.toBeNull();
        expect(isReviewAlreadyPresent!.reviews).toHaveLength(0);

        const review = await resolveAddReview({
            username: "test",
            movie_id: 670292,
            rating: 5,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const savedReview = await MovieModel.findById(670292);
        expect(savedReview).not.toBeNull();
        expect(savedReview!.reviews).toHaveLength(1);
    });

    it("should update vote_average and vote_count for movie with no reviews", async () => {
        const movie = await MovieModel.findById(609681);
        expect(movie).not.toBeNull();
        expect(movie!.vote_average).toBe(0);
        expect(movie!.vote_count).toBe(0);

        const rating = 5;
        const review = await resolveAddReview({
            username: "test",
            movie_id: 609681,
            rating: rating,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const savedMovie = await MovieModel.findById(609681);
        expect(savedMovie).not.toBeNull();
        expect(savedMovie!.vote_average).toBe(rating * 2);
        expect(savedMovie!.vote_count).toBe(1);
    });

    it("should update vote_average and vote_count for movie with reviews", async () => {
        const movie = await MovieModel.findById(83533);
        expect(movie).not.toBeNull();
        expect(movie!.vote_average).toBe(6);
        expect(movie!.vote_count).toBe(1);

        const review = await resolveAddReview({
            username: "test",
            movie_id: 83533,
            rating: 2,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const savedMovie = await MovieModel.findById(83533);
        expect(savedMovie).not.toBeNull();
        expect(savedMovie!.vote_average).toBe(5); // (6 + 2*2) / 2 = 5
        expect(savedMovie!.vote_count).toBe(2);
    });

    it("should return error when saving review fails", async () => {
        vi.spyOn(ReviewModel.prototype, "save").mockImplementation(() => {
            throw new Error("Failed to save review.");
        });
        vi.spyOn(console, "error").mockImplementation(() => {});
        const endSession = vi.spyOn(
            mongoose.mongo.ClientSession.prototype,
            "endSession"
        );

        const review = await resolveAddReview({
            username: "test",
            movie_id: 670292,
            rating: 5,
            comment: "This is a review",
        });
        expect(review).not.toBeNull();
        expect(review).toBeInstanceOf(GraphQLError);
        expect((review as GraphQLError).message).toBe("Failed to add review.");
        expect(ReviewModel.prototype.save).toHaveBeenCalled();
        expect(console.error).toHaveBeenCalled();
        expect(endSession).toHaveBeenCalled();

        vi.restoreAllMocks();
    });
});
