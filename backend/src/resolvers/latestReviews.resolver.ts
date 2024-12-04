import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import { validateSkipLimit } from "../utils/graphqlErrorUtils.js";

export interface ResolveLatestReviewsInterface {
    skip?: number;
    limit?: number;
}

export async function resolveLatestReviews({
    skip = 0,
    limit = 10,
}: ResolveLatestReviewsInterface) {
    // Make sure the skip and limit are valid
    const validationError = validateSkipLimit(skip, limit);
    if (validationError != null) {
        return validationError;
    }

    return await ReviewModel.find()
        .sort({ date: -1 }) // Return the latest reviews first
        .skip(skip)
        .limit(limit)
        .populate({ path: "movie", model: MovieModel });
}
