import { describe, expect, it } from "vitest";
import {
    createBadUserInputError,
    validateReview,
    validateSkipLimit,
    validateUsername,
} from "../utils/graphqlErrorUtils";
import { GraphQLError } from "graphql";

describe("createBadUserInputError", () => {
    it("returns a GraphQLError with the correct message and code", () => {
        const message = "Limit must be an integer of size at least 1.";
        const expectedError = {
            message,
            extensions: { code: "BAD_USER_INPUT" },
        };
        const error = createBadUserInputError(message);

        expect(error).toMatchObject(expectedError);
        expect(error).toBeInstanceOf(Error);
        expect(error).toBeInstanceOf(GraphQLError);
    });
});

describe("validateSkipLimit", () => {
    it("returns null when skip and limit are valid", () => {
        expect(validateSkipLimit(0, 1)).toBeNull();
        expect(validateSkipLimit(0, 100)).toBeNull();
        expect(validateSkipLimit(10, 10)).toBeNull();
        expect(validateSkipLimit(10000, 100)).toBeNull();
    });

    it("returns a GraphQLError when limit is less than 1", () => {
        const args = [
            [0, 0],
            [0, -1],
            [0, -100],
        ];
        for (const [skip, limit] of args) {
            const error = validateSkipLimit(skip, limit);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe(
                "Limit must be an integer of size at least 1."
            );
        }
    });

    it("returns a GraphQLError when limit is greater than 100", () => {
        const args = [
            [0, 101],
            [0, 1000],
            [0, 10000],
        ];
        for (const [skip, limit] of args) {
            const error = validateSkipLimit(skip, limit);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe(
                "Limit must be an integer of size at most 100."
            );
        }
    });

    it("returns a GraphQLError when skip is less than 0", () => {
        const args = [
            [-1, 1],
            [-10, 10],
            [-100, 100],
        ];
        for (const [skip, limit] of args) {
            const error = validateSkipLimit(skip, limit);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe(
                "Skip must be an integer of size at least 0."
            );
        }
    });

    it("returns a GraphQLError when skip/limit are not integers", () => {
        const args = [
            [0.5, 1],
            [4, 10.2],
            [5.1, 5.1],
        ];
        for (const [skip, limit] of args) {
            const error = validateSkipLimit(skip, limit);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe("Skip and limit must be integers.");
        }
    });
});

describe("validateUsername", () => {
    it("returns a GraphQLError when username is too short", () => {
        const args = ["", "a", "ab"];
        for (const username of args) {
            const error = validateUsername(username);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe(
                "Username must be at least 3 characters long."
            );
        }
    });

    it("returns a GraphQLError when username is too long", () => {
        const args = ["a".repeat(21), "a".repeat(30), "a".repeat(50)];
        for (const username of args) {
            const error = validateUsername(username);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe(
                "Username must be at most 20 characters long."
            );
        }
    });

    it("returns null when username is legal length", () => {
        const args = ["abc", "a".repeat(20), "a".repeat(10)];
        for (const username of args) {
            const error = validateUsername(username);

            expect(error).toBeNull();
        }
    });
});

describe("validateReview", () => {
    it("returns a GraphQLError when review is too long", () => {
        const args = ["a".repeat(1501), "a".repeat(2000), "a".repeat(3000)];
        for (const review of args) {
            const error = validateReview(review);

            expect(error).not.toBeNull();
            expect(error).toBeInstanceOf(GraphQLError);
            expect(error!.message).toBe(
                "Review must be at most 1500 characters."
            );
        }
    });

    it("returns null when review is legal length", () => {
        const args = ["", "a".repeat(1500), "a".repeat(1000)];
        for (const review of args) {
            const error = validateReview(review);

            expect(error).toBeNull();
        }
    });
});
