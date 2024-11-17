import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import {
    createBadUserInputError,
    validateReview,
    validateUsername,
} from "../utils/graphqlErrorUtils.js";

export interface ResolveAddReviewInterface {
    movie_id: number;
    username: string;
    rating: number;
    comment: string;
}

export async function resolveAddReview({
    movie_id,
    username,
    rating,
    comment,
}: ResolveAddReviewInterface) {
    if (rating < 1 || rating > 5) {
        return createBadUserInputError(
            "Rating must be an integer between 1 and 5."
        );
    }

    const validationError =
        validateReview(comment) ?? validateUsername(username);
    if (validationError != null) return validationError;

    const movie = await MovieModel.findById(movie_id);
    if (movie == null) {
        return createBadUserInputError("Movie not found.");
    }

    const review = new ReviewModel({
        movie: movie_id,
        username,
        rating,
        comment,
        date: new Date(),
    });

    // The database uses ratings from 0 to 10, so we need to multiply by 2
    const review_rating = review.rating * 2;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await review.save();
        await movie.updateOne({
            $push: { reviews: { $each: [review._id], $position: 0 } },
            $set: {
                vote_average:
                    (movie.vote_average * movie.vote_count + review_rating) /
                    (movie.vote_count + 1),
                vote_count: movie.vote_count + 1,
            },
        });
        await session.commitTransaction();

        return await review.populate({
            path: "movie",
            model: MovieModel,
        });
    } catch (error) {
        console.error("Error adding review:", error);
        await session.abortTransaction();
        return new GraphQLError("Failed to add review.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
    } finally {
        session.endSession();
    }
}
