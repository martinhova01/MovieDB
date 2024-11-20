import "./setup.server.ts";

import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import { describe, expect, it, vi } from "vitest";
import MovieModel from "../models/movie.model.ts";
import ReviewModel from "../models/review.model.ts";
import { resolveDeleteReview } from "../resolvers/deleteReview.resolver.ts";

describe("resolveDeleteReview", () => {
    it("should return error when review not found", async () => {
        const review = await resolveDeleteReview({
            _id: "000000000000000000000000",
        });
        expect(review).not.toBeNull();
        expect(review).toBeInstanceOf(GraphQLError);

        const error = review as GraphQLError;
        expect(error.message).toBe("Review not found.");
    });

    it("should return success when all is well", async () => {
        const review = await resolveDeleteReview({
            _id: "673627c79c33bb841a3fef74",
        });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);
        expect(review).toHaveProperty("movie");
        expect(review).toMatchObject({
            username: "testuser1",
            rating: 3,
            comment: "This is going to be quite good.",
        });
    });

    it("should delete the review from the database", async () => {
        const reviewId = "6736254b9c33bb841a3fee95";
        const reviewBefore = await ReviewModel.findById(
            new mongoose.Types.ObjectId(reviewId)
        );
        // First, check that the review is in the database
        expect(reviewBefore).not.toBeNull();

        const review = await resolveDeleteReview({ _id: reviewId });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const reviewAfter = await ReviewModel.findById(
            new mongoose.Types.ObjectId(reviewId)
        );

        expect(reviewAfter).toBeNull();
    });

    it("should remove the review from the movie", async () => {
        const movieId = 550;
        const reviewId = "673625f49c33bb841a3fef05";
        const movieBefore = await MovieModel.findById(movieId);
        // First, check that the review is already present
        expect(movieBefore).not.toBeNull();
        expect(movieBefore).toHaveProperty("reviews");
        expect(movieBefore!.reviews).not.toBeNull();
        expect(movieBefore!.reviews).toHaveLength(1);

        const review = await resolveDeleteReview({ _id: reviewId });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const movieAfter = await MovieModel.findById(movieId);
        expect(movieAfter).not.toBeNull();
        expect(movieAfter).toHaveProperty("reviews");
        expect(movieAfter!.reviews).not.toBeNull();
        expect(movieAfter!.reviews).toHaveLength(0);
    });

    it("should update vote_average and vote_count for movie with one review", async () => {
        const movieId = 83533;
        const reviewId = "673627c79c33bb841a3fef74";
        const movieBefore = await MovieModel.findById(movieId);
        expect(movieBefore).not.toBeNull();
        expect(movieBefore!.vote_average).toBe(6);
        expect(movieBefore!.vote_count).toBe(1);

        const review = await resolveDeleteReview({ _id: reviewId });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const movieAfter = await MovieModel.findById(movieId);
        expect(movieAfter).not.toBeNull();
        expect(movieAfter!.vote_average).toBe(0);
        expect(movieAfter!.vote_count).toBe(0);
    });

    it("should update vote_average and vote_count for movie with multiple reviews", async () => {
        const movieId = 157336;
        const reviewId = "6736255c9c33bb841a3fee9a";
        const movie = await MovieModel.findById(movieId);
        expect(movie).not.toBeNull();
        expect(movie!.vote_average).toBe(9);
        expect(movie!.vote_count).toBe(2);

        const review = await resolveDeleteReview({ _id: reviewId });
        expect(review).not.toBeNull();
        expect(review).not.toBeInstanceOf(GraphQLError);

        const savedMovie = await MovieModel.findById(movieId);
        expect(savedMovie).not.toBeNull();
        // New movie rating = (9 (old rating) * 2 (reviews) - 2 (match rating system) * 4 (deleted rating)) / 1 (remaining review) = 10
        expect(savedMovie!.vote_average).toBe(10);
        expect(savedMovie!.vote_count).toBe(1);
    });

    it("should return error when deleting review fails", async () => {
        const deleteOne = vi
            .spyOn(ReviewModel.prototype, "deleteOne")
            .mockImplementation(() => {
                throw new Error("Failed to delete review.");
            });
        const consoleError = vi
            .spyOn(console, "error")
            .mockImplementation(() => {});
        const abortTransaction = vi.spyOn(
            mongoose.mongo.ClientSession.prototype,
            "abortTransaction"
        );
        const endSession = vi.spyOn(
            mongoose.mongo.ClientSession.prototype,
            "endSession"
        );

        const reviewId = "6736254b9c33bb841a3fee95";
        const review = await resolveDeleteReview({ _id: reviewId });
        expect(review).not.toBeNull();
        expect(review).toBeInstanceOf(GraphQLError);
        expect((review as GraphQLError).message).toBe(
            "Failed to delete review."
        );

        expect(deleteOne).toHaveBeenCalled();
        expect(consoleError).toHaveBeenCalled();
        expect(abortTransaction).toHaveBeenCalled();
        expect(endSession).toHaveBeenCalled();

        vi.restoreAllMocks();
    });
});
