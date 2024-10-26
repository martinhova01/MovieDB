import { SortOrder } from "mongoose";

enum SortingType {
    NEWEST_FIRST = "Newest first",
    OLDEST_FIRST = "Oldest first",
    TITLE_ASC = "Title A-Z",
    TITLE_DESC = "Title Z-A",
    BEST_RATED = "Best rated",
    WORST_RATED = "Worst rated",
    LONGEST_RUNTIME = "Longest runtime",
    SHORTEST_RUNTIME = "Shortest runtime",
}

export const getSortOrder = (
    sortOption: string
): { [key: string]: SortOrder } => {
    switch (sortOption) {
        case SortingType.NEWEST_FIRST:
            return { release_date: -1 };
        case SortingType.OLDEST_FIRST:
            return { release_date: 1 };
        case SortingType.TITLE_ASC:
            return { title: 1 };
        case SortingType.TITLE_DESC:
            return { title: -1 };
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
