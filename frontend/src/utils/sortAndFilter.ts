import { all_genres, all_languages } from "../mock/util";
import { Movie, Status } from "../types/movieTypes";

export const all_filters: { [key: string]: string[] } = {
    Genre: all_genres.map((genre) => genre.name),
    Rating: ["5", "4", "3", "2", "1"],
    "Release Year": [
        "2020s",
        "2010s",
        "2000s",
        "1990s",
        "1980s",
        "1970s",
        "1960s",
        "1950s",
        "1940s",
        "1930s",
        "1920s",
        "1910s",
        "1900s",
        "1890s",
        "1880s",
        "1870s",
    ],
    Language: all_languages.map((language) => language.name),
    Status: Object.values(Status) as string[],
    Runtime: ["Less than 1 hour", "1 - 2 hours", "More than 2 hours"],
};

const filterByGenres = (movies: Movie[], selectedGenres: string[]) => {
    if (selectedGenres.length) {
        return movies.filter((movie) =>
            selectedGenres.every((selectedGenre) =>
                movie.genres.some((genre) => genre.name === selectedGenre)
            )
        );
    }
    return movies;
};

const filterByRating = (movies: Movie[], selectedRatings: string[]) => {
    if (selectedRatings.length) {
        return movies.filter((movie) =>
            selectedRatings.includes(
                Math.round(movie.vote_average / 2).toString()
            )
        );
    }
    return movies;
};

const filterByReleaseYear = (movies: Movie[], selectedDecades: string[]) => {
    if (selectedDecades.length) {
        return movies.filter((movie) => {
            const releaseYear = movie.release_date.getFullYear();
            return selectedDecades.some((decade) => {
                const startYear = parseInt(decade.slice(0, 4));
                return releaseYear >= startYear && releaseYear < startYear + 10;
            });
        });
    }
    return movies;
};

const filterByLanguage = (movies: Movie[], selectedLanguages: string[]) => {
    if (selectedLanguages.length) {
        return movies.filter((movie) =>
            selectedLanguages.every((selectedLanguage) =>
                movie.spoken_languages.some(
                    (language) => language.name === selectedLanguage
                )
            )
        );
    }
    return movies;
};

const filterByStatus = (movies: Movie[], selectedStatuses: string[]) => {
    if (selectedStatuses.length) {
        return movies.filter((movie) =>
            selectedStatuses.includes(movie.status)
        );
    }
    return movies;
};

const filterByRuntime = (movies: Movie[], selectedRuntimes: string[]) => {
    if (selectedRuntimes.length) {
        return movies.filter((movie) => {
            const runtime = movie.runtime;
            return selectedRuntimes.some((runtimeFilter) => {
                if (runtimeFilter === "Less than 1 hour") return runtime < 60;
                if (runtimeFilter === "1 - 2 hours")
                    return runtime >= 60 && runtime <= 120;
                if (runtimeFilter === "More than 2 hours") return runtime > 120;
                return false;
            });
        });
    }
    return movies;
};

export const filterMovies = (
    movies: Movie[],
    filters: { [key: string]: string[] }
) => {
    let filteredMovies = [...movies];

    filteredMovies = filterByGenres(filteredMovies, filters.Genre || []);
    filteredMovies = filterByRating(filteredMovies, filters.Rating || []);
    filteredMovies = filterByReleaseYear(
        filteredMovies,
        filters["Release Year"] || []
    );
    filteredMovies = filterByLanguage(filteredMovies, filters.Language || []);
    filteredMovies = filterByStatus(filteredMovies, filters.Status || []);
    filteredMovies = filterByRuntime(filteredMovies, filters.Runtime || []);

    return filteredMovies;
};

const sortingMap: { [key: string]: (a: Movie, b: Movie) => number } = {
    "Newest first": (a, b) =>
        b.release_date.getTime() - a.release_date.getTime(),
    "Oldest first": (a, b) =>
        a.release_date.getTime() - b.release_date.getTime(),
    "Title A-Z": (a, b) => a.title.localeCompare(b.title),
    "Title Z-A": (a, b) => b.title.localeCompare(a.title),
    "Best rated": (a, b) => b.vote_average - a.vote_average,
    "Worst rated": (a, b) => a.vote_average - b.vote_average,
    "Longest runtime": (a, b) => b.runtime - a.runtime,
    "Shortest runtime": (a, b) => a.runtime - b.runtime,
};

export const all_sort_options = Object.keys(sortingMap);

export const sortMovies = (sortOption: string, movies: Movie[]) => {
    const sortedMovies = [...movies];

    if (sortingMap[sortOption]) {
        sortedMovies.sort(sortingMap[sortOption]);
    }

    return sortedMovies;
};
