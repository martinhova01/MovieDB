import "./setup.server.ts";

import { describe, expect, it } from "vitest";
import { resolveFilters } from "../resolvers/filters.resolver.js";

// Using mostly snapshot tests because the returned object is complex
// and not practical to type or manually check.

describe("resolveFilters", () => {
    it("should not return any hits when exhaustive search applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: [],
                Genre: [],
                Status: [],
                Runtime: [],
            },
            search: "thisisnotamovie",
        });
        for (const key of Object.keys(filters)) {
            for (const item of filters[key]) {
                expect(item.hits).toBe(0);
            }
        }
    });

    it("should return correct filters when no filters specified", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: [],
                Genre: [],
                Status: [],
                Runtime: [],
            },
            search: "",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when nothing applied", async () => {
        const filters = await resolveFilters({});
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when decade applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: ["2010s"],
                Rating: [],
                Genre: [],
                Status: [],
                Runtime: [],
            },
            search: "",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when rating applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: ["3", "0"],
                Genre: [],
                Status: [],
                Runtime: [],
            },
            search: "",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when genre applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: [],
                Genre: ["Action", "Adventure"],
                Status: [],
                Runtime: [],
            },
            search: "",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when status applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: [],
                Genre: [],
                Status: ["Post Production"],
                Runtime: [],
            },
            search: "",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when runtime applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: [],
                Genre: [],
                Status: [],
                Runtime: ["Less than 1 hour", "2 - 3 hours"],
            },
            search: "",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when search applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: [],
                Rating: [],
                Genre: [],
                Status: [],
                Runtime: [],
            },
            search: "inter",
        });
        expect(filters).toMatchSnapshot();
    });

    it("should return correct filters when all filters applied", async () => {
        const filters = await resolveFilters({
            appliedFilters: {
                Decade: ["2020s"],
                Rating: ["4", "3", "0"],
                Genre: ["Action", "Adventure"],
                Status: ["Released"],
                Runtime: [],
            },
            search: "the",
        });
        expect(filters).toMatchSnapshot();
    });
});
