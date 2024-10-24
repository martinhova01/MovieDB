import { GraphQLError, GraphQLScalarType } from "graphql";
import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";

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
            return await MovieModel.find()
                .skip(skip)
                .limit(limit)
                .populate({ path: "reviews", model: ReviewModel });
        },
    },
};

export default resolvers;
