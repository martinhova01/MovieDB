import React, { useState } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Card, CardContent } from "../shadcn/components/ui/card";
import Ratings from "../shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { useMutation, useReactiveVar } from "@apollo/client";
import { Movie, Review } from "@/types/__generated__/types";
import { ADD_REVIEW, DELETE_REVIEW } from "@/api/queries";
import { parseReviewResponse } from "@/api/apiUtils";
interface MovieReviewsProps {
    movie: Movie;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movie }) => {
    const [reviews, setReviews] = useState<Review[]>([...movie.reviews]);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const username = useReactiveVar(usernameVar);

    const [addReview, { loading: addReviewLoading, error: AddReviewError }] =
        useMutation(ADD_REVIEW);
    const [
        deleteReview,
        { loading: deleteReviewLoading, error: deleteReviewError },
    ] = useMutation(DELETE_REVIEW);

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();

        const response = await addReview({
            variables: {
                movieId: movie._id,
                username: username,
                rating: rating,
                comment: comment.trim(),
            },
        });

        if (response.data == undefined) {
            return;
        }

        // Make sure date is correctly initialized as a Date-object.
        const newReviews: Review[] = parseReviewResponse(
            response.data.addReview.reviews
        );
        setReviews(newReviews);

        setRating(0);
        setComment("");
    };

    const handleDeleteReview = async (review: Review) => {
        const response = await deleteReview({
            variables: {
                id: review._id,
            },
        });

        if (response.data == undefined) {
            return;
        }

        // Make sure date is correctly initialized as a Date-object.
        const newReviews: Review[] = parseReviewResponse(
            response.data.deleteReview.reviews
        );
        setReviews(newReviews);
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (addReviewLoading || deleteReviewLoading) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Loading reviews...</h1>
            </section>
        );
    }

    if (AddReviewError || deleteReviewError) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">
                    Something went wrong when loading reviews!
                </h1>
                <p className="text-primary">Try to refresh</p>
            </section>
        );
    }

    return (
        <Card className="m-4">
            <section className="m-4 mb-6">
                <h3 className="mb-4 text-2xl font-bold">Submit review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <Ratings
                        value={rating}
                        onValueChange={setRating}
                        variant="yellow"
                        totalstars={5}
                        size={24}
                        asInput={true}
                    />
                    <Textarea
                        id="review-comment"
                        name="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review (optional)"
                    />
                    <Button type="submit" disabled={rating === 0}>
                        Submit Review
                    </Button>
                </form>
            </section>
            <section className="m-4 space-y-4">
                {reviews.length > 0 && (
                    <h3 className="mb-4 text-2xl font-bold">Reviews</h3>
                )}
                {reviews.map((review) => (
                    <Card key={review._id}>
                        <CardContent className="mt-4">
                            <section className="mb-2 flex items-start justify-between">
                                <section>
                                    <h4 className="text-xl font-bold">
                                        {review.username}
                                    </h4>
                                    <time className="text-sm text-gray-500">
                                        {formatDate(review.date)}
                                    </time>
                                </section>
                                {review.username !== "Guest" &&
                                    username === review.username && (
                                        <Button
                                            onClick={() =>
                                                handleDeleteReview(review)
                                            }
                                        >
                                            Delete
                                        </Button>
                                    )}
                            </section>
                            <Ratings
                                value={review.rating}
                                variant="yellow"
                                totalstars={5}
                            />
                            {review.comment !== "" && (
                                <p className="mt-2">{review.comment}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </section>
        </Card>
    );
};

export default MovieReviews;
