import React, { useState } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Card } from "../shadcn/components/ui/card";
import Ratings from "../shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { useMutation, useReactiveVar } from "@apollo/client";
import { Movie, Review } from "@/types/__generated__/types";
import {
    ADD_REVIEW,
    GET_LATEST_REVIEWS,
    GET_USER_REVIEWS,
} from "@/api/queries";
import ReviewCard from "./ReviewCard";
interface MovieReviewsProps {
    movie: Movie;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movie }) => {
    const [reviews, setReviews] = useState<Review[]>([...movie.reviews]);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const username = useReactiveVar(usernameVar);

    const [addReview, { error: addReviewError }] = useMutation(ADD_REVIEW, {
        update(cache, { data }) {
            if (!data?.addReview) return;

            cache.modify({
                id: data.addReview._id.toString(),
                fields: {
                    reviews() {
                        return data.addReview.reviews;
                    },
                },
            });
        },
    });

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await addReview({
                variables: {
                    movieId: movie._id,
                    username: username,
                    rating: rating,
                    comment: comment.trim(),
                },
                refetchQueries: [
                    {
                        query: GET_LATEST_REVIEWS,
                        variables: { skip: 0, limit: 20 },
                    },
                    {
                        query: GET_USER_REVIEWS,
                        variables: { username: username, skip: 0, limit: 20 },
                    },
                ],
            });

            if (response.data?.addReview) {
                setReviews(response.data.addReview.reviews as Review[]);
                setRating(0);
                setComment("");
            }
        } catch (error) {}
    };

    const handleDeleteReview = (deletedReview: Review) => {
        setReviews(
            reviews.filter((review) => review._id !== deletedReview._id)
        );
    };

    if (addReviewError) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">
                    Something went wrong when adding reviews
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
                <ul className="space-y-6">
                    {reviews.map((review) => (
                        <li key={review._id}>
                            <ReviewCard
                                review={review}
                                showPoster={false}
                                onDelete={handleDeleteReview}
                            />
                        </li>
                    ))}
                </ul>
            </section>
        </Card>
    );
};

export default MovieReviews;
