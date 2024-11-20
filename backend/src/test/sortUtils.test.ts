import { describe, expect, it } from "vitest";
import { getSortOrder, SortingType } from "../utils/sortUtils";

describe("getSortOrder", () => {
    it("returns correct sort order for MOST_POPULAR", () => {
        expect(getSortOrder(SortingType.MOST_POPULAR)).toStrictEqual({
            popularity: -1,
        });
    });

    it("returns correct sort order for NEWEST_FIRST", () => {
        expect(getSortOrder(SortingType.NEWEST_FIRST)).toStrictEqual({
            release_date: -1,
        });
    });

    it("returns correct sort order for OLDEST_FIRST", () => {
        expect(getSortOrder(SortingType.OLDEST_FIRST)).toStrictEqual({
            release_date: 1,
        });
    });

    it("returns correct sort order for BEST_RATED", () => {
        expect(getSortOrder(SortingType.BEST_RATED)).toStrictEqual({
            vote_average: -1,
        });
    });

    it("returns correct sort order for WORST_RATED", () => {
        expect(getSortOrder(SortingType.WORST_RATED)).toStrictEqual({
            vote_average: 1,
        });
    });

    it("returns correct sort order for LONGEST_RUNTIME", () => {
        expect(getSortOrder(SortingType.LONGEST_RUNTIME)).toStrictEqual({
            runtime: -1,
        });
    });

    it("returns correct sort order for SHORTEST_RUNTIME", () => {
        expect(getSortOrder(SortingType.SHORTEST_RUNTIME)).toStrictEqual({
            runtime: 1,
        });
    });

    it("returns empty sorting order when invalid sorting type", () => {
        expect(getSortOrder("ABC" as SortingType)).toStrictEqual({});
    });
});
