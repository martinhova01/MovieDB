import React, { useState } from "react";
import { toast } from "sonner";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Card } from "../shadcn/components/ui/card";
import Ratings from "../shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { Reference, useMutation, useReactiveVar } from "@apollo/client";
import { Movie } from "@/types/__generated__/types";
import { ADD_REVIEW } from "@/api/queries";
import Loader from "./Loader";
import ReviewCard from "./ReviewCard";
import { validateReview, validateUsername } from "@/utils/userInputValidation";

interface MovieReviewsProps {
    movie: Movie;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movie }) => {
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const username = useReactiveVar(usernameVar);

    const [addReview, { loading }] = useMutation(ADD_REVIEW, {
        update(cache, { data }) {
            if (!data?.addReview) return;
            const newRef: Reference = { __ref: `Review:${data.addReview._id}` };

            // Update the cache to include the new review, instead of refetching.
            // This includes updating the cache for this movie, the latest reviews,
            // and the user's reviews.
            cache.modify({
                id: `Movie:${data.addReview.movie._id}`,
                fields: {
                    reviews(existingReviewRefs = []) {
                        return [newRef, ...existingReviewRefs];
                    },
                },
            });
            cache.modify({
                fields: {
                    latestReviews(existingReviewRefs = []) {
                        return [newRef, ...existingReviewRefs];
                    },
                    userReviews(existingReviewRefs = [], { storeFieldName }) {
                        if (!storeFieldName.includes(username)) {
                            return existingReviewRefs;
                        }
                        return [newRef, ...existingReviewRefs];
                    },
                },
            });
        },
    });

    const handleSubmitReview = (e?: React.FormEvent) => {
        e?.preventDefault();

        // Validate the review and username before submitting
        // If validation fails, a toast will be displayed, and we should not proceed here
        if (!validateReview(comment) || !validateUsername(username)) return;

        addReview({
            variables: {
                movieId: movie._id,
                username: username,
                rating: rating,
                comment: comment.trim(),
            },
        })
            .then((response) => {
                if (response.data?.addReview) {
                    toast.success("Review added successfully");
                    // Reset the form after successful submission
                    setRating(0);
                    setComment("");
                }
            })
            .catch((error) => {
                toast.error("Failed to submit review", {
                    action: {
                        label: "Retry",
                        onClick: () => handleSubmitReview(),
                    },
                    description:
                        error instanceof Error
                            ? error.message
                            : "An error occurred",
                });
            });
    };

    return (
        <Card className="m-4">
            <section className="m-4 mb-6">
                <h2 className="mb-4 text-2xl font-bold">Submit review</h2>
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
                        maxLength={1500}
                    />
                    <Button type="submit" disabled={rating === 0 || loading}>
                        {loading ? (
                            <Loader size="sm" color="stroke-secondary" />
                        ) : (
                            "Submit Review"
                        )}
                    </Button>
                </form>
            </section>
            <section className="m-4 space-y-4">
                {movie.reviews.length > 0 && (
                    <h2 className="mb-4 text-2xl font-bold">Reviews</h2>
                )}
                <ul className="space-y-6">
                    {movie.reviews.map((review) => (
                        <li key={review._id}>
                            <ReviewCard review={review} showPoster={false} />
                        </li>
                    ))}
                </ul>
            </section>
        </Card>
    );
};

export default MovieReviews;
