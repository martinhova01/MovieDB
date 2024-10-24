import { GraphQLError, GraphQLScalarType } from "graphql";
import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import mongoose from "mongoose";

const dateScalar = new GraphQLScalarType({
    name: "Date",
    parseValue(value: string) {
        return new Date(value);
    },
    serialize(value: Date) {
        return value.toISOString();
    },
});

function createBadUserInputError(message: string) {
    return new GraphQLError(message, {
        extensions: { code: "BAD_USER_INPUT" },
    });
}

function validateSkipLimit(skip: number, limit: number) {
    if (limit == null || limit < 1) {
        return createBadUserInputError(
            "Limit must be an integer of size at least 1."
        );
    }
    if (limit > 100) {
        return createBadUserInputError(
            "Limit must be an integer of size at most 100."
        );
    }
    if (skip == null || skip < 0) {
        return createBadUserInputError(
            "Skip must be an integer of size at least 0."
        );
    }
    return null;
}

const resolvers = {
    Date: dateScalar,
    Query: {
        movie: async (_: unknown, { id }: { id: number }) => {
            // "Int!" in `schema.ts` makes sure that the id is a non-nullable integer,
            //  so we don't need to check for null/float.
            return await MovieModel.findById(id).populate({
                path: "reviews",
                model: ReviewModel,
            });
        },

        movies: async (
            _: unknown,
            { skip = 0, limit = 10 }: { skip?: number; limit?: number }
        ) => {
            const validationError = validateSkipLimit(skip, limit);
            if (validationError != null) {
                return validationError;
            }
            return await MovieModel.find()
                .skip(skip)
                .limit(limit)
                .populate({ path: "reviews", model: ReviewModel });
        },

        latestReviews: async (
            _: unknown,
            { skip = 0, limit = 10 }: { skip?: number; limit?: number }
        ) => {
            const validationError = validateSkipLimit(skip, limit);
            if (validationError != null) {
                return validationError;
            }
            return await ReviewModel.find()
                .sort({ review_date: -1 })
                .skip(skip)
                .limit(limit);
        },

        userReviews: async (
            _: unknown,
            {
                username,
                skip = 0,
                limit = 10,
            }: { username: string; skip?: number; limit?: number }
        ) => {
            const validationError = validateSkipLimit(skip, limit);
            if (validationError != null) {
                return validationError;
            }
            return await ReviewModel.find({ username })
                .sort({ review_date: -1 })
                .skip(skip)
                .limit(limit);
        },
    },

    Mutation: {
        addReview: async (
            _: unknown,
            {
                movie_id,
                username,
                rating,
                description,
            }: {
                movie_id: number;
                username: string;
                rating: number;
                description: string;
            }
        ) => {
            if (rating < 1 || rating > 5) {
                return createBadUserInputError(
                    "Rating must be an integer between 1 and 5."
                );
            }

            const movie = await MovieModel.findById(movie_id);
            if (movie == null) {
                return createBadUserInputError("Movie not found.");
            }

            const review = new ReviewModel({
                movie_id,
                username,
                rating,
                description,
                review_date: new Date(),
            });

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                await review.save();
                await movie.updateOne({ $push: { reviews: review._id } });
                await session.commitTransaction();
                return review;
            } catch (error) {
                console.error("Error adding review:", error);
                await session.abortTransaction();
                return new GraphQLError("Failed to add review.", {
                    extensions: { code: "INTERNAL_SERVER_ERROR" },
                });
            } finally {
                session.endSession();
            }
        },
    },
};

export default resolvers;
