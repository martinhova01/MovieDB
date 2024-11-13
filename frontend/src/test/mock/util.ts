import { Movie, Review } from "@/types/__generated__/types.ts";
import _genres from "./mock_genres.json";
import _keywords from "./mock_keywords.json";
import _movies from "./mock_movies.json";
import _reviews from "./mock_reviews.json";
import _production_companies from "./mock_production_companies.json";
import _production_countries from "./mock_production_countries.json";
import _spoken_languages from "./mock_spoken_languages.json";
import _review from "./mock_review.json";

export const all_genres: string[] = _genres;
export const all_keywords: string[] = _keywords;
export const all_languages: string[] = _spoken_languages;
export const all_production_companies: string[] = _production_companies;
export const all_production_countries: string[] = _production_countries;

export const all_movies: Movie[] = _movies.map((movie) => ({
    ...movie,
    release_date: new Date(movie.release_date),
    backdrop_path: movie.backdrop_path ?? undefined,
    homepage: movie.homepage ?? undefined,
    imdb_id: movie.imdb_id ?? undefined,
    poster_path: movie.poster_path ?? undefined,
    tagline: movie.tagline ?? undefined,
    reviews: [],
}));

export const all_reviews: Review[] = _reviews.map((review) => {
    const movie = all_movies.find((m) => m._id === review.movieId);
    if (!movie) throw new Error(`Movie with ID ${review.movieId} not found`);
    return {
        ...review,
        _id: review._id.toString(),
        date: new Date(review.date),
        movie,
        comment: review.comment ?? "",
    };
});

export const mock_review: Review = {
    ..._review,
    date: new Date(_review.date),
    movie: {
        ..._review.movie,
        release_date: new Date(_review.movie.release_date),
    },
};
