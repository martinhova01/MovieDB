import { GraphQLError } from "graphql";
import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import mongoose from "mongoose";
import { createFilters, Filters } from "../utils/filterUtils.js";
import { getSortOrder, SortingType } from "../utils/sortUtils.js";
import { DateTimeResolver } from "graphql-scalars";

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
    DateTime: DateTimeResolver,
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
            {
                skip = 0,
                limit = 10,
                filters,
                sortOption,
                search,
            }: {
                skip?: number;
                limit?: number;
                filters?: Filters;
                sortOption?: SortingType;
                search?: string;
            }
        ) => {
            const validationError = validateSkipLimit(skip, limit);
            if (validationError != null) {
                return validationError;
            }

            return await MovieModel.find({
                $and: [
                    ...(filters ? createFilters(filters) : []),
                    search ? { $text: { $search: `\"${search}\"` } } : {},
                ],
            })
                .sort({
                    ...getSortOrder(sortOption ?? SortingType.NEWEST_FIRST),
                    _id: 1,
                })
                .skip(skip)
                .limit(limit)
                .populate({ path: "reviews", model: ReviewModel });
        },

        filters: async () => {
            const genres: string[] = (
                await MovieModel.distinct("genres")
            ).filter((genre) => genre != null);

            const ratings: string[] = ["5", "4", "3", "2", "1", "0"];

            const decades = await MovieModel.aggregate([
                {
                    $group: {
                        _id: {
                            $floor: {
                                $divide: [{ $year: "$release_date" }, 10],
                            },
                        },
                    },
                },
                {
                    $project: {
                        _id: { $concat: [{ $toString: "$_id" }, "0s"] },
                    },
                },
                {
                    $sort: { _id: -1 },
                },
            ]);
            const decadeList: string[] = decades
                .map((decade) => decade._id)
                .filter((decade) => decade != null);

            const statuses: string[] = [
                "Released",
                "In Production",
                "Post Production",
                "Planned",
                "Rumored",
                "Canceled",
            ];

            const runtimes: string[] = [
                "Less than 1 hour",
                "1 - 2 hours",
                "2 - 3 hours",
                "3 hours or more",
            ];

            return {
                Genre: genres,
                Rating: ratings,
                Decade: decadeList,
                Status: statuses,
                Runtime: runtimes,
            };
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
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "movie", model: MovieModel });
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
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .populate({ path: "movie", model: MovieModel });
        },
    },

    Mutation: {
        addReview: async (
            _: unknown,
            {
                movie_id,
                username,
                rating,
                comment,
            }: {
                movie_id: number;
                username: string;
                rating: number;
                comment: string;
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
                movie: movie_id,
                username,
                rating,
                comment,
                date: new Date(),
            });

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                await review.save();
                await movie.updateOne({ $push: { reviews: review._id } });
                await session.commitTransaction();

                return await MovieModel.findById(movie_id).populate({
                    path: "reviews",
                    model: ReviewModel,
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
        },

        deleteReview: async (_: unknown, { _id }: { _id: string }) => {
            const review = await ReviewModel.findById(
                new mongoose.Types.ObjectId(_id)
            );
            if (review == null) {
                return createBadUserInputError("Review not found.");
            }

            const session = await mongoose.startSession();
            session.startTransaction();

            try {
                await review.deleteOne();
                await MovieModel.updateOne(
                    { reviews: review._id },
                    { $pull: { reviews: review._id } }
                );
                await session.commitTransaction();

                return await MovieModel.findById(review.movie).populate({
                    path: "reviews",
                    model: ReviewModel,
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
        },
    },
};

export default resolvers;
