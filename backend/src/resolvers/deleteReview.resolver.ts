import { GraphQLError } from "graphql";
import mongoose from "mongoose";
import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import { createBadUserInputError } from "../utils/graphqlErrorUtils.js";

export interface ResolveDeleteReviewInterface {
    _id: string;
}

export async function resolveDeleteReview({
    _id,
}: ResolveDeleteReviewInterface) {
    const review = await ReviewModel.findById(new mongoose.Types.ObjectId(_id));
    if (review == null) {
        return createBadUserInputError("Review not found.");
    }

    // The database uses ratings from 0 to 10, so we need to multiply by 2
    const review_rating = review.rating * 2;

    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await review.deleteOne();
        const movie = await MovieModel.findById(review.movie);
        const new_rating =
            movie.vote_count - 1 == 0
                ? 0
                : (movie.vote_average * movie.vote_count - review_rating) /
                  (movie.vote_count - 1);
        await movie.updateOne({
            $pull: { reviews: review._id },
            $set: {
                vote_average: new_rating,
                vote_count: movie.vote_count - 1,
            },
        });
        await session.commitTransaction();

        return await review.populate({
            path: "movie",
            model: MovieModel,
        });
    } catch (error) {
        console.error("Error deleting review:", error);
        await session.abortTransaction();
        return new GraphQLError("Failed to delete review.", {
            extensions: { code: "INTERNAL_SERVER_ERROR" },
        });
    } finally {
        session.endSession();
    }
}
