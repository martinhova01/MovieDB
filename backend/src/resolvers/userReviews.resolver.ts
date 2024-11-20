import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import {
    validateSkipLimit,
    validateUsername,
} from "../utils/graphqlErrorUtils.js";

export interface ResolveUserReviewsInterface {
    username: string;
    skip?: number;
    limit?: number;
}

export async function resolveUserReviews({
    username,
    skip = 0,
    limit = 10,
}: ResolveUserReviewsInterface) {
    const validationError =
        validateSkipLimit(skip, limit) ?? validateUsername(username);
    if (validationError != null) {
        return validationError;
    }

    return await ReviewModel.find({ username })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "movie", model: MovieModel });
}
