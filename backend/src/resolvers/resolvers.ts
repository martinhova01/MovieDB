import { GraphQLScalarType } from "graphql";
import MovieModel from "../models/movie.model.js";

const dateScalar = new GraphQLScalarType({
    name: "Date",
    parseValue(value: string) {
        return new Date(value);
    },
    serialize(value: Date) {
        return value.toISOString();
    },
});

const resolvers = {
    Date: dateScalar,
    Query: {
        movie: async (_: unknown, { id }: { id: number }) => {
            return await MovieModel.findById(id);
        },
        movies: async (_: unknown, { skip = 0, limit = 10 }) => {
            return await MovieModel.find()
                .skip(skip)
                .limit(Math.min(100, limit));
        },
    },
};

export default resolvers;
