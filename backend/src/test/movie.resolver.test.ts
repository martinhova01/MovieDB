import "./setup.server.ts";

import { describe, expect, it } from "vitest";
import { resolveMovie } from "../resolvers/movie.resolver.js";

describe("resolveMovie", () => {
    it("should return correct movie", async () => {
        const movies = [
            { _id: 980489, title: "Gran Turismo" },
            { _id: 298618, title: "The Flash" },
        ];
        for (const { _id, title } of movies) {
            const movie = await resolveMovie({ id: _id });
            expect(movie).toMatchObject({ _id, title });
        }
    });

    it("should return null for non-existent movie", async () => {
        const movie = await resolveMovie({ id: 123456 });
        expect(movie).toBeNull();
    });

    it("should fill reviews", async () => {
        const movieData = {
            _id: 157336,
            title: "Interstellar",
        };
        const comments = [
            {
                username: "testuser2",
                comment: "It's quite good",
            },
            {
                username: "testuser1",
                comment: "Best movie ever made!",
            },
        ];
        const movie = await resolveMovie({ id: movieData._id });
        expect(movie).not.toBeNull();
        expect(movie).toHaveProperty("reviews");
        expect(movie!.reviews).toHaveLength(2);
        for (const comment of comments) {
            expect(movie!.reviews).toContainEqual(
                expect.objectContaining(comment)
            );
        }
    });
});
