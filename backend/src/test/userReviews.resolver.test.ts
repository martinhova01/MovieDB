import "./setup.server.ts";

import { describe, expect, it } from "vitest";

import { resolveUserReviews } from "../resolvers/userReviews.resolver.js";
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

describe("resolveUserReviews", () => {
    it("should return error on invalid skip", async () => {
        const reviews = await resolveUserReviews({
            username: "testuser1",
            skip: -1,
        });
        expect(reviews).toBeInstanceOf(GraphQLError);
    });

    it("should return error on invalid limit", async () => {
        const reviews = await resolveUserReviews({
            username: "testuser1",
            limit: 101,
        });
        expect(reviews).toBeInstanceOf(GraphQLError);
    });

    it("should return correct review", async () => {
        const reviews = await resolveUserReviews({
            username: "testuser1",
            limit: 1,
        });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(1);
        expect(reviews[0]).toHaveProperty("movie");
        expect(reviews[0]).toMatchObject(allRealReviews[0]);
    });

    it("should return correct review with skip", async () => {
        const reviews = await resolveUserReviews({
            username: "testuser1",
            skip: 2,
            limit: 1,
        });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(1);
        expect(reviews[0]).toHaveProperty("movie");
        expect(reviews[0]).toMatchObject(allRealReviews[3]);
    });

    it("should return 1 review for user with only 1 review", async () => {
        const reviews = await resolveUserReviews({
            username: "testuser2",
            limit: 100,
        });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(1);
        expect(reviews).toMatchObject([allRealReviews[2]]);
    });

    it("should return no reviews for unknown user", async () => {
        const reviews = await resolveUserReviews({
            username: "notARealUser",
        });

        expect(reviews).not.toBeNull();
        expect(reviews).toHaveLength(0);
    });
});
