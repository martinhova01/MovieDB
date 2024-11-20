import { GraphQLError } from "graphql";

export function createBadUserInputError(message: string) {
    return new GraphQLError(message, {
        extensions: { code: "BAD_USER_INPUT" },
    });
}

export function validateSkipLimit(skip: number, limit: number) {
    if (limit == null || limit < 1) {
        return createBadUserInputError(
            "Limit must be an integer of size at least 1."
        );
    }
    if (limit > 100) {
        return createBadUserInputError(
            "Limit must be an integer of size at most 100."
        );
    }
    if (skip == null || skip < 0) {
        return createBadUserInputError(
            "Skip must be an integer of size at least 0."
        );
    }
    if (!Number.isInteger(skip) || !Number.isInteger(limit)) {
        return createBadUserInputError("Skip and limit must be integers.");
    }
    return null;
}

export function validateUsername(username: string) {
    const usernameMinLength = 3;
    const usernameMaxLength = 20;
    if (username.length < usernameMinLength) {
        return createBadUserInputError(
            `Username must be at least ${usernameMinLength} characters long.`
        );
    }
    if (username.length > 20) {
        return createBadUserInputError(
            `Username must be at most ${usernameMaxLength} characters long.`
        );
    }
    return null;
}

export function validateReview(comment: string) {
    const reviewMaxLength = 1500;
    if (comment.trim().length > reviewMaxLength) {
        return createBadUserInputError(
            `Review must be at most ${reviewMaxLength} characters.`
        );
    }
    return null;
}
