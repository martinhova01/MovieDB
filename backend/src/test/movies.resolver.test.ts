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

    it("should return correct search results", async () => {
        const moviesData = [
            { _id: 1008042, title: "Talk to Me" },
            { _id: 976573, title: "Elemental" },
            {
                _id: 614930,
                title: "Teenage Mutant Ninja Turtles: Mutant Mayhem",
            },
            { _id: 83533, title: "Avatar 3" },
        ];
        const movies = await resolveMovies({
            skip: 0,
            limit: 100,
            search: "ta",
        });

        expect(movies).toHaveLength(4);
        for (let i = 0; i < 4; i++) {
            expect(movies[i]).toMatchObject(moviesData[i]);
        }
    });

    it("should return correct search/filter/sort results", async () => {
        const moviesData = [
            { _id: 447277, title: "The Little Mermaid" },
            { _id: 335977, title: "Indiana Jones and the Dial of Destiny" },
            { _id: 298618, title: "The Flash" },
            { _id: 667538, title: "Transformers: Rise of the Beasts" },
            { _id: 447365, title: "Guardians of the Galaxy Vol. 3" },
            { _id: 569094, title: "Spider-Man: Across the Spider-Verse" },
        ];
        const movies = await resolveMovies({
            skip: 0,
            limit: 100,
            search: "the",
            filters: {
                Genre: ["Adventure"],
                Rating: ["3", "4"],
                Decade: ["2020s"],
                Status: ["Released"],
                Runtime: ["2 - 3 hours"],
            },
            sortOption: SortingType.WORST_RATED,
        });

        expect(movies).toHaveLength(6);
        for (let i = 0; i < 6; i++) {
            expect(movies[i]).toMatchObject(moviesData[i]);
        }
    });

    it("should correctly slice movies when using skip and limit", async () => {
        const allMovies = await resolveMovies({
            skip: 0,
            limit: 50,
        });

        expect(allMovies).not.toBeInstanceOf(GraphQLError);
        if (allMovies instanceof GraphQLError) return;

        expect(allMovies).toHaveLength(50);
        const allMoviesIdTitle = allMovies.map((movie) => {
            return {
                _id: movie._id,
                title: movie.title,
            };
        });

        for (let i = 0; i < 50; i += 10) {
            const movies = await resolveMovies({
                skip: i,
                limit: 10,
            });

            expect(movies).not.toBeInstanceOf(GraphQLError);
            if (movies instanceof GraphQLError) return;

            expect(movies).toHaveLength(10);
            const moviesIdTitle = movies.map((movie) => {
                return {
                    _id: movie._id,
                    title: movie.title,
                };
            });

            expect(moviesIdTitle).toMatchObject(
                allMoviesIdTitle.slice(i, i + 10)
            );
        }
    });
});
