import { GraphQLError } from "graphql";

/**
 * Creates a new GraphQLError with a "BAD_USER_INPUT" code, with the given message.
 *
 * @param message - The error message.
 */
export function createBadUserInputError(message: string) {
    return new GraphQLError(message, {
        extensions: { code: "BAD_USER_INPUT" },
    });
}

/**
 * Validates the `skip` and `limit` parameters for pagination.
 *
 * @param skip - The number of items to skip. Must be an integer greater than or equal to 0.
 * @param limit - The maximum number of items to return. Must be an integer between 1 and 100, inclusive.
 * @returns An error object if validation fails, otherwise `null`.
 */
export function validateSkipLimit(skip: number, limit: number) {
    if (limit == null || limit < 1) {
        return createBadUserInputError(
            "Limit must be an integer of size at least 1."
        );
    }
    // If the limit is too large, the backend might run out of memory
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

/**
 * Validates the provided username based on predefined length constraints.
 *
 * @param username - The username to validate. Must be between 3 and 20 characters long.
 * @returns GraphQLError if the username is invalid, or null if the username is valid.
 */
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

/**
 * Validates the length of a review comment.
 *
 * @param comment - The review comment to validate. Maximum length is 1500 characters.
 * @returns An error object if the comment exceeds the maximum length, otherwise null.
 */
export function validateReview(comment: string) {
    const reviewMaxLength = 1500;
    if (comment.trim().length > reviewMaxLength) {
        return createBadUserInputError(
            `Review must be at most ${reviewMaxLength} characters.`
        );
    }
    return null;
}
