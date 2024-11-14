import "./setup.server.ts";

import { describe, expect, it } from "vitest";

import { resolveLatestReviews } from "../resolvers/latestReviews.resolver.js";
import { GraphQLError } from "graphql";
import mongoose from "mongoose";

const allRealReviews = [
    {
        _id: "673627c79c33bb841a3fef74",
        movie: {
            _id: 83533,
            title: "Avatar 3",
        },
        username: "testuser1",
        date: new Date("2024-11-14T16:39:35.185Z"),
    },
    {
        _id: "673625f49c33bb841a3fef05",
        movie: {
            _id: 550,
            title: "Fight Club",
        },
        username: "testuser1",
        date: new Date("2024-11-14T16:31:48.039Z"),
    },
    {
        _id: "6736255c9c33bb841a3fee9a",
        movie: {
            _id: 157336,
            title: "Interstellar",
        },
        username: "testuser2",
        date: new Date("2024-11-14T16:29:16.190Z"),
    },
    {
        _id: "6736254b9c33bb841a3fee95",
        movie: {
            _id: 157336,
            title: "Interstellar",
        },
        username: "testuser1",
        date: new Date("2024-11-14T16:28:59.076Z"),
    },
].map((review) => ({
    ...review,
    _id: new mongoose.Types.ObjectId(review._id),
}));

describe("resolveLatestReviews", () => {
    it("should return error on invalid skip", async () => {
        const reviews = await resolveLatestReviews({ skip: -1 });
        expect(reviews).toBeInstanceOf(GraphQLError);
    });

    it("should return error on invalid limit", async () => {
        const reviews = await resolveLatestReviews({ limit: 101 });
        expect(reviews).toBeInstanceOf(GraphQLError);
    });

    it("should return correct review", async () => {
        const reviews = await resolveLatestReviews({ limit: 1 });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(1);
        expect(reviews[0]).toHaveProperty("movie");
        expect(reviews[0]).toMatchObject(allRealReviews[0]);
    });

    it("should return correct reviews", async () => {
        const reviews = await resolveLatestReviews({ skip: 1, limit: 3 });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(3);
        expect(reviews).toMatchObject(allRealReviews.slice(1, 4));
    });

    it("should return no reviews", async () => {
        const reviews = await resolveLatestReviews({ skip: 4, limit: 3 });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(0);
    });
});
