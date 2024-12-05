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
    // Ensure that the rating is a number between 1 and 5
    if (rating < 1 || rating > 5) {
        return createBadUserInputError(
            "Rating must be an integer between 1 and 5."
        );
    }

    // Make sure the comment and username are valid, and that the movie exists
    const validationError =
        validateReview(comment) ?? validateUsername(username);
    if (validationError != null) return validationError;

    const movie = await MovieModel.findById(movie_id);
    if (movie == null) {
        return createBadUserInputError("Movie not found.");
    }

    // Create the new review object
    // Make sure to trim it to remove any unwanted leading/trailing whitespace
    const review = new ReviewModel({
        movie: movie_id,
        username: username.trim(),
        rating,
        comment: comment.trim(),
        date: new Date(),
    });

    // The database uses ratings from 0 to 10, so we need to multiply by 2
    const review_rating = review.rating * 2;

    const session = await mongoose.startSession();
    session.startTransaction();

    // When adding a review, we need to save the review, add the review to the movie's reviews array,
    // and update the movie's vote_average and vote_count fields
    try {
        await review.save();

        // Add the new review to the beginning of the reviews array
        // and update the vote_average and vote_count fields based on the new review
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
