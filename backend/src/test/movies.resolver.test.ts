import "./setup.server.ts";

import { GraphQLError } from "graphql";
import { describe, expect, it } from "vitest";
import { resolveMovies } from "../resolvers/movies.resolver.js";
import { SortingType } from "../utils/sortUtils.ts";

describe("resolveMovies", () => {
    it("should return correct movies", async () => {
        const moviesData = [
            { _id: 968051, title: "The Nun II" },
            { _id: 615656, title: "Meg 2: The Trench" },
            { _id: 762430, title: "Retribution" },
        ];
        const movies = await resolveMovies({
            skip: 2,
            limit: 3,
        });
        expect(movies).toHaveLength(3);
        for (let i = 0; i < 3; i++) {
            expect(movies[i]).toMatchObject(moviesData[i]);
        }
    });

    it("should return error for invalid skip/limit", async () => {
        const error = await resolveMovies({
            skip: -1,
            limit: 10,
        });
        expect(error).toBeInstanceOf(GraphQLError);
        expect(error).toHaveProperty("message");
    });

    it("should return sorted movies", async () => {
        const moviesData = [
            { _id: 872585, title: "Oppenheimer" },
            { _id: 734253, title: "Adipurush" },
            { _id: 603692, title: "John Wick: Chapter 4" },
        ];
        const movies = await resolveMovies({
            skip: 0,
            limit: 3,
            sortOption: SortingType.LONGEST_RUNTIME,
        });
        expect(movies).toHaveLength(3);
        for (let i = 0; i < 3; i++) {
            expect(movies[i]).toMatchObject(moviesData[i]);
        }
    });

    it("should return fewer movies than requested when using narrow filters", async () => {
        const moviesData = [
            { _id: 565770, title: "Blue Beetle" },
            { _id: 667538, title: "Transformers: Rise of the Beasts" },
            { _id: 447365, title: "Guardians of the Galaxy Vol. 3" },
        ];
        const movies = await resolveMovies({
            skip: 0,
            limit: 100,
            filters: {
                Genre: ["Adventure", "Science Fiction"],
                Rating: ["4"],
                Decade: ["2020s"],
                Status: ["Released"],
                Runtime: [],
            },
        });
        expect(movies).toHaveLength(3);
        for (let i = 0; i < 3; i++) {
            expect(movies[i]).toMatchObject(moviesData[i]);
        }
    });
});
