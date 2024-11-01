import { SortingType } from "@/types/__generated__/types";

const sortingDisplayNames: Map<SortingType, string> = new Map<
    SortingType,
    string
>([
    [SortingType.MOST_POPULAR, "Most popular"],
    [SortingType.BEST_RATED, "Best rated"],
    [SortingType.LONGEST_RUNTIME, "Longest runtime"],
    [SortingType.NEWEST_FIRST, "Newest first"],
    [SortingType.OLDEST_FIRST, "Oldest first"],
    [SortingType.SHORTEST_RUNTIME, "Shortest runtime"],
    [SortingType.WORST_RATED, "Worst rated"],
]);

export const getSortOptionDisplayName = (sortType: SortingType) => {
    return sortingDisplayNames.get(sortType);
};

export const defaultSortOption = SortingType.MOST_POPULAR;
