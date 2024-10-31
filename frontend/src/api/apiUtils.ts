import { Review } from "@/types/__generated__/types";

type ResponseReview = {
    __typename?: "Review";
    _id: string;
    username: string;
    rating: number;
    comment: string;
    date: Date;
};

/**
 *  Make sure that the date-field is correctly initialized as a Date-object
 *  when getting reviews as a response from a query.
 */
export function parseReviewResponse(inputReviews: ResponseReview[]): Review[] {
    return inputReviews.map((review) => ({
        ...review,
        date: new Date(review.date),
    })) as Review[];
}
