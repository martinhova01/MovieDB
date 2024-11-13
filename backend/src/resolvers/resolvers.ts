import { DateTimeResolver } from "graphql-scalars";
import {
    resolveAddReview,
    ResolveAddReviewInterface,
} from "./addReview.resolver.js";
import {
    resolveDeleteReview,
    ResolveDeleteReviewInterface,
} from "./deleteReview.resolver.js";
import { resolveFilters, ResolveFiltersInterface } from "./filters.resolver.js";
import {
    resolveLatestReviews,
    ResolveLatestReviewsInterface,
} from "./latestReviews.resolver.js";
import { resolveMovie, ResolveMovieInterface } from "./movie.resolver.js";
import { resolveMovies, ResolveMoviesInterface } from "./movies.resolver.js";
import {
    resolveUserReviews,
    ResolveUserReviewsInterface,
} from "./userReviews.resolver.js";

const resolvers = {
    DateTime: DateTimeResolver,
    Query: {
        movie: (_: unknown, args: ResolveMovieInterface) => {
            return resolveMovie(args);
        },

        movies: (_: unknown, args: ResolveMoviesInterface) => {
            return resolveMovies(args);
        },

        filters: (_: unknown, args: ResolveFiltersInterface) => {
            return resolveFilters(args);
        },

        latestReviews: (_: unknown, args: ResolveLatestReviewsInterface) => {
            return resolveLatestReviews(args);
        },

        userReviews: (_: unknown, args: ResolveUserReviewsInterface) => {
            return resolveUserReviews(args);
        },
    },

    Mutation: {
        addReview: (_: unknown, args: ResolveAddReviewInterface) => {
            return resolveAddReview(args);
        },

        deleteReview: (_: unknown, args: ResolveDeleteReviewInterface) => {
            return resolveDeleteReview(args);
        },
    },
};

export default resolvers;
