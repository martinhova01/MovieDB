import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";
import { createFilterAndSearch, FiltersInput } from "../utils/filterUtils.js";
import {
    defaultSortOption,
    getSortOrder,
    SortingType,
} from "../utils/sortUtils.js";
import { validateSkipLimit } from "../utils/graphqlErrorUtils.js";

export interface ResolveMoviesInterface {
    skip?: number;
    limit?: number;
    filters?: FiltersInput;
    sortOption?: SortingType;
    search?: string;
}

export async function resolveMovies({
    skip = 0,
    limit = 10,
    filters,
    sortOption,
    search,
}: ResolveMoviesInterface) {
    const validationError = validateSkipLimit(skip, limit);
    if (validationError != null) {
        return validationError;
    }

    return await MovieModel.find(createFilterAndSearch(filters, search))
        .sort({
            ...getSortOrder(sortOption ?? defaultSortOption),
            _id: 1,
        })
        .skip(skip)
        .limit(limit)
        .populate({ path: "reviews", model: ReviewModel });
}
