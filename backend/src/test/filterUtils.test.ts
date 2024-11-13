import { describe, expect, it } from "vitest";
import {
    createFilterAndSearch,
    exportedForTesting,
    FiltersInput,
} from "../utils/filterUtils";
const {
    createFilterForGenres,
    createFilterForRating,
    createFilterForReleaseYear,
    createFilterForStatus,
    createFilterForRuntime,
    createFilters,
    createSearch,
} = exportedForTesting;

describe("createFilterForGenres", () => {
    it("creates correct filters for multiple genres", () => {
        const genre_lists = [
            ["Action", "Adventure"],
            ["Action"],
            [
                "Action",
                "Adventure",
                "Animation",
                "Comedy",
                "Crime",
                "Documentary",
                "Drama",
                "Family",
                "Fantasy",
                "History",
                "Horror",
                "Music",
                "Mystery",
                "Romance",
                "Thriller",
                "War",
                "Western",
            ],
        ];

        for (const genre_list of genre_lists) {
            expect(createFilterForGenres(genre_list)).toStrictEqual({
                genres: { $all: genre_list },
            });
        }
    });

    it("creates correct filters for no genres", () => {
        expect(createFilterForGenres([])).toStrictEqual({});
    });
});

describe("createFilterForRating", () => {
    it("creates correct filters for multiple ratings", () => {
        const rating_lists = [
            ["5"],
            ["2", "4"],
            ["0", "1", "2", "3", "4", "5"],
        ];
        const return_values = [
            {
                $or: [{ vote_average: { $gte: 9, $lt: 11 } }],
            },
            {
                $or: [
                    { vote_average: { $gte: 3, $lt: 5 } },
                    { vote_average: { $gte: 7, $lt: 9 } },
                ],
            },
            {
                $or: [
                    { vote_average: { $gte: -1, $lt: 1 } },
                    { vote_average: { $gte: 1, $lt: 3 } },
                    { vote_average: { $gte: 3, $lt: 5 } },
                    { vote_average: { $gte: 5, $lt: 7 } },
                    { vote_average: { $gte: 7, $lt: 9 } },
                    { vote_average: { $gte: 9, $lt: 11 } },
                ],
            },
        ];

        for (let i = 0; i < rating_lists.length; i++) {
            expect(createFilterForRating(rating_lists[i])).toStrictEqual(
                return_values[i]
            );
        }
    });

    it("creates correct filters for no ratings", () => {
        expect(createFilterForRating([])).toStrictEqual({});
    });
});

describe("createFilterForReleaseYear", () => {
    it("creates correct filters for multiple decades", () => {
        const decade_lists = [
            ["1920s"],
            ["2190s", "2000s"],
            ["1920s", "1930s", "1940s", "1950s", "1960s", "1970s", "1980s"],
        ];
        const return_values = [
            {
                decade: { $in: [1920] },
            },
            {
                decade: { $in: [2190, 2000] },
            },
            {
                decade: { $in: [1920, 1930, 1940, 1950, 1960, 1970, 1980] },
            },
        ];

        for (let i = 0; i < decade_lists.length; i++) {
            expect(createFilterForReleaseYear(decade_lists[i])).toStrictEqual(
                return_values[i]
            );
        }
    });

    it("creates correct filters for no decades", () => {
        expect(createFilterForReleaseYear([])).toStrictEqual({});
    });
});

describe("createFilterForStatus", () => {
    it("creates correct filters for multiple statuses", () => {
        const status_lists = [
            ["Released"],
            ["In Production"],
            ["In Production", "Planned", "Post Production", "Released"],
        ];
        const return_values = [
            {
                status: { $in: ["Released"] },
            },
            {
                status: { $in: ["In Production"] },
            },
            {
                status: {
                    $in: [
                        "In Production",
                        "Planned",
                        "Post Production",
                        "Released",
                    ],
                },
            },
        ];

        for (let i = 0; i < status_lists.length; i++) {
            expect(createFilterForStatus(status_lists[i])).toStrictEqual(
                return_values[i]
            );
        }
    });

    it("creates correct filters for no statuses", () => {
        expect(createFilterForStatus([])).toStrictEqual({});
    });
});

describe("createFilterForRuntime", () => {
    it("creates correct filters for multiple runtimes", () => {
        const runtime_lists = [
            ["Less than 1 hour"],
            ["1 - 2 hours"],
            ["2 - 3 hours"],
            ["3 hours or more"],
            [
                "Less than 1 hour",
                "1 - 2 hours",
                "2 - 3 hours",
                "3 hours or more",
            ],
        ];
        const return_values = [
            {
                $or: [{ runtime: { $lt: 60 } }],
            },
            {
                $or: [{ runtime: { $gte: 60, $lt: 120 } }],
            },
            {
                $or: [{ runtime: { $gte: 120, $lt: 180 } }],
            },
            {
                $or: [{ runtime: { $gte: 180 } }],
            },
            {
                $or: [
                    { runtime: { $lt: 60 } },
                    { runtime: { $gte: 60, $lt: 120 } },
                    { runtime: { $gte: 120, $lt: 180 } },
                    { runtime: { $gte: 180 } },
                ],
            },
        ];

        for (let i = 0; i < runtime_lists.length; i++) {
            expect(createFilterForRuntime(runtime_lists[i])).toStrictEqual(
                return_values[i]
            );
        }
    });

    it("creates correct filters for no runtimes", () => {
        expect(createFilterForRuntime([])).toStrictEqual({});
    });

    it("creates correct filters for invalid runtimes", () => {
        expect(createFilterForRuntime(["Invalid runtime"])).toStrictEqual({
            $or: [{}],
        });

        expect(
            createFilterForRuntime(["2 - 3 hours", "Invalid runtime"])
        ).toStrictEqual({
            $or: [{ runtime: { $gte: 120, $lt: 180 } }, {}],
        });
    });
});

describe("createFilters", () => {
    it("creates correct filters for groups of filter types", () => {
        const filters: FiltersInput = {
            Genre: ["Action", "Adventure"],
            Rating: ["5"],
            Decade: ["1920s"],
            Status: ["Released"],
            Runtime: ["Less than 1 hour"],
        };
        expect(createFilters(filters)).toStrictEqual([
            { genres: { $all: ["Action", "Adventure"] } },
            { $or: [{ vote_average: { $gte: 9, $lt: 11 } }] },
            { decade: { $in: [1920] } },
            { status: { $in: ["Released"] } },
            { $or: [{ runtime: { $lt: 60 } }] },
        ]);
    });

    it("creates correct filters for no filters", () => {
        expect(createFilters(undefined)).toStrictEqual([]);
    });
});

describe("createSearch", () => {
    it("creates correct search for non-empty search term", () => {
        expect(createSearch("test")).toStrictEqual({
            title: { $regex: "test", $options: "i" },
        });

        expect(createSearch("Interstellar 2")).toStrictEqual({
            title: { $regex: "Interstellar 2", $options: "i" },
        });
    });

    it("creates correct search for no search term", () => {
        expect(createSearch(undefined)).toStrictEqual({});
        expect(createSearch("")).toStrictEqual({});
    });
});

describe("createFilterAndSearch", () => {
    it("creates correct filters and search for non-empty filters and search term", () => {
        const filters: FiltersInput = {
            Genre: ["Action", "Adventure"],
            Rating: ["5"],
            Decade: ["1920s"],
            Status: ["Released"],
            Runtime: ["Less than 1 hour"],
        };
        const search = "Fight Club 3";

        expect(createFilterAndSearch(filters, search)).toStrictEqual({
            $and: [
                { genres: { $all: ["Action", "Adventure"] } },
                { $or: [{ vote_average: { $gte: 9, $lt: 11 } }] },
                { decade: { $in: [1920] } },
                { status: { $in: ["Released"] } },
                { $or: [{ runtime: { $lt: 60 } }] },
                { title: { $regex: search, $options: "i" } },
            ],
        });
    });

    it("creates correct filters and search for missing parameters", () => {
        expect(createFilterAndSearch(undefined, undefined)).toStrictEqual({
            $and: [{}],
        });

        expect(createFilterAndSearch(undefined, "")).toStrictEqual({
            $and: [{}],
        });

        expect(
            createFilterAndSearch(undefined, "Lord of the Rings 4")
        ).toStrictEqual({
            $and: [{ title: { $regex: "Lord of the Rings 4", $options: "i" } }],
        });

        const empty_filters: FiltersInput = {
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        };

        expect(createFilterAndSearch(empty_filters, "")).toStrictEqual({
            $and: [{}],
        });

        expect(createFilterAndSearch(empty_filters, "test")).toStrictEqual({
            $and: [{ title: { $regex: "test", $options: "i" } }],
        });
    });
});
