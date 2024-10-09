import React, { useState, useEffect } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Card, CardContent } from "../shadcn/components/ui/card";
import Ratings from "../shadcn/components/ui/rating";
import { Review } from "../types/movieTypes";
interface MovieReviewsProps {
    movieId: number;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movieId }) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState<number>(0);
    const [comment, setComment] = useState<string>("");

    useEffect(() => {
        const storedReviews = localStorage.getItem(`movieReviews_${movieId}`);
        if (storedReviews) {
            setReviews(JSON.parse(storedReviews));
        }
    }, [movieId]);

    const saveReviews = (updatedReviews: Review[]) => {
        localStorage.setItem(
            `movieReviews_${movieId}`,
            JSON.stringify(updatedReviews)
        );
        setReviews(updatedReviews);
    };

    const handleSubmitReview = (e: React.FormEvent) => {
        e.preventDefault();
        const newReview: Review = {
            id: Date.now(), //Temporary id
            username: "Username", //Temporary username
            rating,
            comment: comment.trim() || undefined,
            date: new Date(),
        };
        const updatedReviews = [...reviews, newReview];
        saveReviews(updatedReviews);
        setRating(0);
        setComment("");
    };

    const handleDeleteReview = (id: number) => {
        const updatedReviews = reviews.filter((review) => review.id !== id);
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
                <h3 className="text-2xl font-bold mb-4">Submit review</h3>
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
                    <h3 className="text-2xl font-bold mb-4">Reviews</h3>
                )}
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="mt-4">
                            <section className="flex justify-between items-start mb-2">
                                <section>
                                    <h4 className="text-xl font-bold">
                                        {review.username}
                                    </h4>
                                    <time className="text-sm text-gray-500">
                                        {formatDate(review.date)}
                                    </time>
                                </section>
                                <Button
                                    onClick={() =>
                                        handleDeleteReview(review.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </section>
                            <Ratings
                                value={review.rating}
                                variant="yellow"
                                totalstars={5}
                            />
                            {review.comment && (
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
