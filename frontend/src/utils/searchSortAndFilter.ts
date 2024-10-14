import { all_genres, all_languages } from "../mock/util";
import { Movie, Status } from "../types/movieTypes";

export const all_filters: { [key: string]: string[] } = {
    Genre: all_genres,
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
    Language: all_languages,
    Status: Object.values(Status) as string[],
    Runtime: [
        "Less than 1 hour",
        "1 - 2 hours",
        "2 - 3 hours",
        "3 hours or more",
    ],
};

const filterByGenres = (movies: Movie[], selectedGenres: string[]) => {
    if (selectedGenres.length) {
        return movies.filter((movie) =>
            selectedGenres.every((selectedGenre) =>
                movie.genres.some((genre) => genre === selectedGenre)
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
                    (language) => language === selectedLanguage
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
                switch (runtimeFilter) {
                    case "Less than 1 hour":
                        return runtime < 60;
                    case "1 - 2 hours":
                        return runtime >= 60 && runtime < 120;
                    case "2 - 3 hours":
                        return runtime >= 120 && runtime < 180;
                    case "3 hours or more":
                        return runtime >= 180;
                    default:
                        return false;
                }
            });
        });
    }
    return movies;
};

export const filterMovies = (
    movies: Movie[],
    filters: { [key: string]: string[] }
) => {
    let filteredMovies = movies;

    const filterFunctions = {
        Genre: filterByGenres,
        Rating: filterByRating,
        "Release Year": filterByReleaseYear,
        Language: filterByLanguage,
        Status: filterByStatus,
        Runtime: filterByRuntime,
    };

    for (const [filterKey, filterFunction] of Object.entries(filterFunctions)) {
        filteredMovies = filterFunction(
            filteredMovies,
            filters[filterKey] || []
        );
    }

    return filteredMovies;
};

export enum SortingType {
    NEWEST_FIRST = "Newest first",
    OLDEST_FIRST = "Oldest first",
    TITLE_ASC = "Title A-Z",
    TITLE_DESC = "Title Z-A",
    BEST_RATED = "Best rated",
    WORST_RATED = "Worst rated",
    LONGEST_RUNTIME = "Longest runtime",
    SHORTEST_RUNTIME = "Shortest runtime",
}

const sortingMap: Map<SortingType, (a: Movie, b: Movie) => number> = new Map<
    SortingType,
    (a: Movie, b: Movie) => number
>([
    [
        SortingType.NEWEST_FIRST,
        (a, b) => b.release_date.getTime() - a.release_date.getTime(),
    ],
    [
        SortingType.OLDEST_FIRST,
        (a, b) => a.release_date.getTime() - b.release_date.getTime(),
    ],
    [SortingType.TITLE_ASC, (a, b) => a.title.localeCompare(b.title)],
    [SortingType.TITLE_DESC, (a, b) => b.title.localeCompare(a.title)],
    [SortingType.BEST_RATED, (a, b) => b.vote_average - a.vote_average],
    [SortingType.WORST_RATED, (a, b) => a.vote_average - b.vote_average],
    [SortingType.LONGEST_RUNTIME, (a, b) => b.runtime - a.runtime],
    [SortingType.SHORTEST_RUNTIME, (a, b) => a.runtime - b.runtime],
]);

export const sortMovies = (sortOption: SortingType, movies: Movie[]) => {
    if (sortingMap.has(sortOption)) {
        movies.sort(sortingMap.get(sortOption));
    }

    return movies;
};

export const searchMovies = (search: string, movies: Movie[]) => {
    return movies.filter((movie) =>
        movie.title.toLowerCase().includes(search.toLowerCase())
    );
};
