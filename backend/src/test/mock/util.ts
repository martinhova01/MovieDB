import _movies from "./movies.json";
import _reviews from "./reviews.json";

export const movies = _movies.map((movie) => ({
    ...movie,
    release_date: movie.release_date["$date"],
    reviews: movie.reviews.map((review: { $oid: string }) => review["$oid"]),
}));

export const reviews = _reviews.map((review) => ({
    ...review,
    date: review.date["$date"],
    _id: review._id["$oid"],
}));
