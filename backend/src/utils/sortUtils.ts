import { SortOrder } from "mongoose";

export enum SortingType {
    NEWEST_FIRST = "NEWEST_FIRST",
    OLDEST_FIRST = "OLDEST_FIRST",
    BEST_RATED = "BEST_RATED",
    WORST_RATED = "WORST_RATED",
    LONGEST_RUNTIME = "LONGEST_RUNTIME",
    SHORTEST_RUNTIME = "SHORTEST_RUNTIME",
}

export const getSortOrder = (
    sortOption: SortingType
): { [key: string]: SortOrder } => {
    switch (sortOption) {
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
