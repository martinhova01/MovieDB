import { SortingType } from "@/types/__generated__/types";

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
