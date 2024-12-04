import { SortOrder } from "mongoose";

export enum SortingType {
    MOST_POPULAR = "MOST_POPULAR",
    NEWEST_FIRST = "NEWEST_FIRST",
    OLDEST_FIRST = "OLDEST_FIRST",
    BEST_RATED = "BEST_RATED",
    WORST_RATED = "WORST_RATED",
    LONGEST_RUNTIME = "LONGEST_RUNTIME",
    SHORTEST_RUNTIME = "SHORTEST_RUNTIME",
}

export const defaultSortOption = SortingType.MOST_POPULAR;

/**
 * Returns a sort order object (readable by MongoDB) based on the provided sorting option.
 *
 * @param sortOption - The sorting option of type `SortingType`.
 * @returns An object where the key is the field to sort by and the value is the sort order.
 *          The sort order is -1 for descending and 1 for ascending.
 */
export const getSortOrder = (
    sortOption: SortingType
): { [key: string]: SortOrder } => {
    switch (sortOption) {
        case SortingType.MOST_POPULAR:
            return { popularity: -1 };
        case SortingType.NEWEST_FIRST:
            return { release_date: -1 };
        case SortingType.OLDEST_FIRST:
            return { release_date: 1 };
        case SortingType.BEST_RATED:
            return { vote_average: -1 };
        case SortingType.WORST_RATED:
            return { vote_average: 1 };
        case SortingType.LONGEST_RUNTIME:
            return { runtime: -1 };
        case SortingType.SHORTEST_RUNTIME:
            return { runtime: 1 };
        default:
            return {};
    }
};
