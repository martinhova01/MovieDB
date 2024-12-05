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
    // Make sure the skip, limit, and username are valid
    const validationError =
        validateSkipLimit(skip, limit) ?? validateUsername(username);
    if (validationError != null) {
        return validationError;
    }

    // Return the reviews for the given username with newest reviews first
    return await ReviewModel.find({ username })
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .populate({ path: "movie", model: MovieModel });
}
