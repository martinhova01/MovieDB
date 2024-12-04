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

/**
 * Creates a filter (readable by MongoDB) for the selected genres.
 * If no genres are selected, no restriction is applied.
 */
const createFilterForGenres = (selectedGenres: string[]) => {
    return selectedGenres.length ? { genres: { $all: selectedGenres } } : {};
};

/**
 * Creates a filter (readable by MongoDB) for the selected ratings.
 * If no ratings are selected, no restriction is applied.
 * Ratings should be numbers in string format (e.g., "1", "2", "3").
 */
const createFilterForRating = (selectedRatings: string[]) => {
    if (selectedRatings.length) {
        // Scale the ratings to the 0-10 scale used in the database
        const mappedRatings = selectedRatings.map(
            (rating) => parseInt(rating) * 2
        );
        const ratingFilters = mappedRatings.map((rating) => {
            // Create a restriction range for each rating selected
            // E.g. rating 4 should include movies with ratings 3.5-4.5
            // (translated to 7-9 in the 0-10 scale)
            return {
                vote_average: {
                    $gte: rating - 1,
                    $lt: rating + 1,
                },
            };
        });
        // Any of the selected ratings should match
        return { $or: ratingFilters };
    }
    return {};
};

/**
 * Creates a filter (readable by MongoDB) for the selected release years.
 * If no release years are selected, no restriction is applied.
 * Decades should be strings in the format "YYYYs" (e.g., "1990s").
 */
const createFilterForReleaseYear = (selectedDecades: string[]) => {
    const decades: number[] = selectedDecades.map((d) =>
        parseInt(d.slice(0, 4))
    );
    // The query should match movies which were released in any of the selected decades
    return selectedDecades.length ? { decade: { $in: decades } } : {};
};

/**
 * Creates a filter (readable by MongoDB) for the selected statuses.
 * If no statuses are selected, no restriction is applied.
 * Statuses should be strings (e.g., "Released", "Planned").
 */
const createFilterForStatus = (selectedStatuses: string[]) => {
    return selectedStatuses.length ? { status: { $in: selectedStatuses } } : {};
};

/**
 * Creates a filter (readable by MongoDB) for the selected runtimes.
 * If no runtimes are selected, no restriction is applied.
 * Runtimes should be strings (e.g., "Less than 1 hour", "1 - 2 hours").
 * The runtime is stored in minutes in the database.
 * Runtimes not matching any of the predefined categories are ignored.
 */
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
        // The movie should match any of the selected runtime categories
        return { $or: runtimeQueries };
    }
    return {};
};

/**
 * Creates an array of filters (readable by MongoDB) for the all selected filters.
 * If no filters are selected, no restriction is applied.
 */
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
    // The filter above removes empty restrictions
};

/**
 * Creates a search filter (readable by MongoDB) for the given search string.
 * If no search string is provided, no restriction is applied.
 */
const createSearch = (search: string | undefined) => {
    if (search == undefined || search == "") {
        return {};
    }
    // The title should contain the search string (case-insensitive)
    return { title: { $regex: search, $options: "i" } };
};

/**
 * Creates a filter (readable by MongoDB) for the combined filters and search string.
 * The filter should match all the filters and the search string.
 */
export const createFilterAndSearch = (
    filters: FiltersInput | undefined,
    search: string | undefined
) => {
    // $and is used to specify that all conditions should be met
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
