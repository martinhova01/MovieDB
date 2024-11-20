import { toast } from "sonner";

/**
 *  Returns true if the username is valid, false otherwise.
 *  A valid username must be between 3 and 20 characters long.
 *
 *  Displays a toast error if the username is too short or too long.
 */
export function validateUsername(username: string) {
    const usernameMinLength = 3;
    const usernameMaxLength = 20;

    if (username.length < usernameMinLength) {
        toast.error("Username is too short", {
            description: `Username must be at least ${usernameMinLength} characters long`,
        });
        return false;
    }

    if (username.length > usernameMaxLength) {
        toast.error("Username is too long", {
            description: `Username must be at most  ${usernameMaxLength} characters long`,
        });
        return false;
    }

    return true;
}

/**
 * Returns true if the review is valid, false otherwise.
 * A valid review must be at most 1500 characters long.
 *
 * Displays a toast error if the review is too long.
 */
export function validateReview(comment: string) {
    const reviewMaxLength = 1500;

    if (comment.trim().length > reviewMaxLength) {
        toast.error("Review is too long", {
            description: `Review must be at most ${reviewMaxLength} characters.`,
        });
        return false;
    }

    return true;
}
