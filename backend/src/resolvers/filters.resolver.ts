import MovieModel from "../models/movie.model.js";
import { createFilterAndSearch, FiltersInput } from "../utils/filterUtils.js";

export interface ResolveFiltersInterface {
    appliedFilters?: FiltersInput;
    search?: string;
}

export async function resolveFilters({
    appliedFilters,
    search,
}: ResolveFiltersInterface) {
    const hitsThisQuery = await MovieModel.countDocuments(
        createFilterAndSearch(appliedFilters, search)
    );

    const genresPromise = MovieModel.distinct("genres").then((genreStrings) =>
        Promise.all(
            genreStrings
                .filter((genre) => genre != null)
                .map(async (genre) => {
                    if (appliedFilters.Genre.includes(genre)) {
                        return { name: genre, hits: hitsThisQuery };
                    }

                    let filters: FiltersInput;
                    if (appliedFilters) {
                        filters = {
                            ...appliedFilters,
                            Genre: [
                                ...new Set([...appliedFilters.Genre, genre]),
                            ],
                        };
                    } else {
                        filters = {
                            Decade: [],
                            Rating: [],
                            Genre: [genre],
                            Status: [],
                            Runtime: [],
                        };
                    }

                    const hits = await MovieModel.countDocuments(
                        createFilterAndSearch(filters, search)
                    );
                    return { name: genre, hits };
                })
        )
    );

    const ratingsPromise = Promise.all(
        ["5", "4", "3", "2", "1", "0"].map(async (rating) => {
            let filters: FiltersInput;
            if (appliedFilters) {
                filters = { ...appliedFilters, Rating: [rating] };
            } else {
                filters = {
                    Decade: [],
                    Rating: [rating],
                    Genre: [],
                    Status: [],
                    Runtime: [],
                };
            }

            const hits = await MovieModel.countDocuments(
                createFilterAndSearch(filters, search)
            );
            return { name: rating, hits };
        })
    );

    const decadesPromise = MovieModel.distinct("decade").then((decades) =>
        Promise.all(
            decades
                .sort((a, b) => b - a)
                .map(async (decade) => {
                    let filters: FiltersInput;
                    if (appliedFilters) {
                        filters = {
                            ...appliedFilters,
                            Decade: [decade.toString() + "s"],
                        };
                    } else {
                        filters = {
                            Decade: [decade.toString() + "s"],
                            Rating: [],
                            Genre: [],
                            Status: [],
                            Runtime: [],
                        };
                    }

                    const hits = await MovieModel.countDocuments(
                        createFilterAndSearch(filters, search)
                    );
                    return { name: decade.toString() + "s", hits };
                })
        )
    );

    const statusesPromise = Promise.all(
        ["Released", "In Production", "Post Production", "Planned"].map(
            async (status) => {
                let filters: FiltersInput;
                if (appliedFilters) {
                    filters = { ...appliedFilters, Status: [status] };
                } else {
                    filters = {
                        Decade: [],
                        Rating: [],
                        Genre: [],
                        Status: [status],
                        Runtime: [],
                    };
                }

                const hits = await MovieModel.countDocuments(
                    createFilterAndSearch(filters, search)
                );
                return { name: status, hits };
            }
        )
    );

    const runtimesPromise = Promise.all(
        [
            "Less than 1 hour",
            "1 - 2 hours",
            "2 - 3 hours",
            "3 hours or more",
        ].map(async (runtime) => {
            let filters: FiltersInput;
            if (appliedFilters) {
                filters = { ...appliedFilters, Runtime: [runtime] };
            } else {
                filters = {
                    Decade: [],
                    Rating: [],
                    Genre: [],
                    Status: [],
                    Runtime: [runtime],
                };
            }

            const hits = await MovieModel.countDocuments(
                createFilterAndSearch(filters, search)
            );
            return { name: runtime, hits };
        })
    );

    const [genres, ratings, decades, statuses, runtimes] = await Promise.all([
        genresPromise,
        ratingsPromise,
        decadesPromise,
        statusesPromise,
        runtimesPromise,
    ]);

    return {
        Genre: genres,
        Rating: ratings,
        Decade: decades,
        Status: statuses,
        Runtime: runtimes,
    };
}
