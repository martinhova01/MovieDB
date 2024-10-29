import React, { useState, useEffect } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Card, CardContent } from "../shadcn/components/ui/card";
import Ratings from "../shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";
import { Movie, Review } from "@/types/__generated__/types";
interface MovieReviewsProps {
    movie: Movie;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movie }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");
    const username = useReactiveVar(usernameVar);

    useEffect(() => {
        const storedReviews = localStorage.getItem(`movieReviews_${movie._id}`);
        if (storedReviews) {
            const reviews = JSON.parse(storedReviews) as Array<
                Omit<Review, "date" | "movie"> & {
                    date: string;
                    movie: Omit<Movie, "release_date"> & {
                        release_date: string;
                    };
                }
            >;
            setReviews(
                reviews.map((review) => ({
                    ...review,
                    date: new Date(review.date),
                    movie: {
                        ...review.movie,
                        release_date: new Date(review.movie.release_date),
                    },
                }))
            );
        }
    }, [movie]);

    const saveReviews = (updatedReviews: Review[]) => {
        localStorage.setItem(
            `movieReviews_${movie._id}`,
            JSON.stringify(updatedReviews)
        );
        setReviews(updatedReviews);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview: Review = {
            _id: Date.now().toString(), //Temporary id
            movie: movie,
            username: username,
            rating,
            comment: comment.trim(),
            date: new Date(),
        };
        const updatedReviews = [...reviews, newReview];
        saveReviews(updatedReviews);
        setRating(0);
        setComment("");
    };

    const handleDeleteReview = (review: Review) => {
        const updatedReviews = reviews.filter((r) => r._id !== review._id);
        saveReviews(updatedReviews);
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
