import { SortOrder } from "mongoose";

export const getSortOrder = (
    sortOption: string
): { [key: string]: SortOrder } => {
    switch (sortOption) {
        case "Newest first":
            return { release_date: -1 };
        case "Oldest first":
            return { release_date: 1 };
        case "Best rated":
            return { vote_average: -1 };
        case "Worst rated":
            return { vote_average: 1 };
        case "Longest runtime":
            return { runtime: -1 };
        case "Shortest runtime":
            return { runtime: 1 };
        default:
            return {};
    }
};
