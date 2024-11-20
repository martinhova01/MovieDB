export type Filters = {
    Genre: Filter[];
    Rating: Filter[];
    Decade: Filter[];
    Status: Filter[];
    Runtime: Filter[];
};

export type Filter = {
    name: string;
    hits: number;
};

export type FiltersInput = {
    Genre: string[];
    Rating: string[];
    Decade: string[];
    Status: string[];
    Runtime: string[];
};

const createFilterForGenres = (selectedGenres: string[]) => {
    return selectedGenres.length ? { genres: { $all: selectedGenres } } : {};
};

const createFilterForRating = (selectedRatings: string[]) => {
    if (selectedRatings.length) {
        const mappedRatings = selectedRatings.map(
            (rating) => parseInt(rating) * 2
        );
        const ratingFilters = mappedRatings.map((rating) => {
            return {
                vote_average: {
                    $gte: rating - 1,
                    $lt: rating + 1,
                },
            };
        });
        return { $or: ratingFilters };
    }
    return {};
};

const createFilterForReleaseYear = (selectedDecades: string[]) => {
    const decades: number[] = selectedDecades.map((d) =>
        parseInt(d.slice(0, 4))
    );
    return selectedDecades.length ? { decade: { $in: decades } } : {};
};

const createFilterForStatus = (selectedStatuses: string[]) => {
    return selectedStatuses.length ? { status: { $in: selectedStatuses } } : {};
};

const createFilterForRuntime = (selectedRuntimes: string[]) => {
    if (selectedRuntimes.length) {
        const runtimeQueries = selectedRuntimes.map((runtimeFilter) => {
            switch (runtimeFilter) {
                case "Less than 1 hour":
                    return { runtime: { $lt: 60 } };
                case "1 - 2 hours":
                    return { runtime: { $gte: 60, $lt: 120 } };
                case "2 - 3 hours":
                    return { runtime: { $gte: 120, $lt: 180 } };
                case "3 hours or more":
                    return { runtime: { $gte: 180 } };
                default:
                    return {};
            }
        });
        return { $or: runtimeQueries };
    }
    return {};
};

const createFilters = (filters: FiltersInput | undefined) => {
    if (filters == undefined) {
        return [];
    }
    return [
        createFilterForGenres(filters.Genre),
        createFilterForRating(filters.Rating),
        createFilterForReleaseYear(filters.Decade),
        createFilterForStatus(filters.Status),
        createFilterForRuntime(filters.Runtime),
    ].filter((condition) => Object.keys(condition).length > 0);
};

const createSearch = (search: string | undefined) => {
    if (search == undefined || search == "") {
        return {};
    }
    return { title: { $regex: search, $options: "i" } };
};

export const createFilterAndSearch = (
    filters: FiltersInput | undefined,
    search: string | undefined
) => {
    return {
        $and: [...createFilters(filters), createSearch(search)],
    };
};

export const exportedForTesting = {
    createFilterForGenres,
    createFilterForRating,
    createFilterForReleaseYear,
    createFilterForStatus,
    createFilterForRuntime,
    createFilters,
    createSearch,
};
