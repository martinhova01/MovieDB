import { Movie, SortingType } from "@/__generated__/types";

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

const sortingMap: Map<SortingType, (a: Movie, b: Movie) => number> = new Map<
    SortingType,
    (a: Movie, b: Movie) => number
>([
    [
        SortingType.NewestFirst,
        (a, b) => b.release_date.getTime() - a.release_date.getTime(),
    ],
    [
        SortingType.OldestFirst,
        (a, b) => a.release_date.getTime() - b.release_date.getTime(),
    ],
    [SortingType.BestRated, (a, b) => b.vote_average - a.vote_average],
    [SortingType.WorstRated, (a, b) => a.vote_average - b.vote_average],
    [SortingType.LongestRuntime, (a, b) => b.runtime - a.runtime],
    [SortingType.ShortestRuntime, (a, b) => a.runtime - b.runtime],
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

const sortingDisplayNames: Map<SortingType, string> = new Map<
    SortingType,
    string
>([
    [SortingType.BestRated, "Best rated"],
    [SortingType.LongestRuntime, "Longest runtime"],
    [SortingType.NewestFirst, "Newest first"],
    [SortingType.OldestFirst, "Oldest first"],
    [SortingType.ShortestRuntime, "Shortest runtime"],
    [SortingType.WorstRated, "Worst rated"],
]);

export const getSortOptionDisplayName = (sortType: SortingType) => {
    return sortingDisplayNames.get(sortType);
};
