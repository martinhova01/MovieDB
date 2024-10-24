export type MovieFilters = {
    genre: string[];
    rating: string[];
    releaseYear: string[];
    language: string[];
    status: string[];
    runtime: string[];
};

const filterByGenres = (selectedGenres: string[]) => {
    return selectedGenres.length ? { genres: { $all: selectedGenres } } : {};
};

const filterByRating = (selectedRatings: string[]) => {
    if (selectedRatings.length) {
        const mappedRatings = selectedRatings.map(rating => parseInt(rating) * 2);
        const ratingFilters =  mappedRatings.map(rating => {
            return {
                vote_average: {
                    $gte: rating - 1,
                    $lt: rating + 1
                }
            };
        })
        return { $or: ratingFilters }
    }
    return {};
};

const filterByReleaseYear = (selectedDecades: string[]) => {
    if (selectedDecades.length) {
        const yearFilters = selectedDecades.map((decade) => {
            const startYear = parseInt(decade.slice(0, 4));
            return {
                release_date: {
                    $gte: new Date(`${startYear}-01-01`),
                    $lt: new Date(`${startYear + 10}-01-01`),
                },
            };
        });
        return { $or: yearFilters };
    }
    return {};
};

const filterByLanguage = (selectedLanguages: string[]) => {
    return selectedLanguages.length
        ? { spoken_languages: { $all: selectedLanguages } }
        : {};
};

const filterByStatus = (selectedStatuses: string[]) => {
    return selectedStatuses.length ? { status: { $in: selectedStatuses } } : {};
};

const filterByRuntime = (selectedRuntimes: string[]) => {
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
        return { $or: runtimeQueries }
    }
    return {};
};

export const createFilterQuery = (filters: MovieFilters) => {
    const queryConditions = [
        filterByGenres(filters.genre),
        filterByRating(filters.rating),
        filterByReleaseYear(filters.releaseYear),
        filterByLanguage(filters.language),
        filterByStatus(filters.status),
        filterByRuntime(filters.runtime),
    ].filter(condition => Object.keys(condition).length > 0);

    return queryConditions.length > 0 ? { $and: queryConditions } : {};
};