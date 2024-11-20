import MovieModel from "../models/movie.model.js";
import ReviewModel from "../models/review.model.js";

export interface ResolveMovieInterface {
    id: number;
}

export async function resolveMovie({ id }: ResolveMovieInterface) {
    // "Int!" in `schema.ts` makes sure that the id is a non-nullable integer,
    //  so we don't need to check for null/float.
    return await MovieModel.findById(id).populate({
        path: "reviews",
        model: ReviewModel,
    });
}
