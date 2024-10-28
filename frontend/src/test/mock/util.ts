import { Movie } from "@/types/__generated__/types.ts";
import _genres from "./mock_genres.json";
import _keywords from "./mock_keywords.json";
import _movies from "./mock_movies.json";
import _production_companies from "./mock_production_companies.json";
import _production_countries from "./mock_production_countries.json";
import _spoken_languages from "./mock_spoken_languages.json";

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
}));
