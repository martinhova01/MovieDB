import React, { useState, useEffect } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../shadcn/components/ui/select";
import { Card, CardContent } from "@/shadcn/components/ui/card";

interface Review {
    id: number;
    rating: number;
    comment?: string;
    date: string;
}

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
            id: Date.now(),
            rating,
            comment: comment.trim() || undefined,
            date: new Date().toISOString(),
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

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
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
            <div className="m-4 mb-6">
                <h3 className="text-2xl font-bold mb-4">Submit review</h3>
                <form onSubmit={handleSubmitReview} className="space-y-4">
                    <Select
                        onValueChange={(value: any) => setRating(Number(value))}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                        <SelectContent>
                            {[0, 1, 2, 3, 4, 5].map((value) => (
                                <SelectItem
                                    key={value}
                                    value={value.toString()}
                                >
                                    {value} / 5
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Write your review (optional)"
                    />
                    <Button type="submit" disabled={rating === 0}>
                        Submit Review
                    </Button>
                </form>
            </div>
            <div className="m-4 space-y-4">
                {reviews.length > 0 ? (
                    <h3 className="text-2xl font-bold mb-4">Reviews</h3>
                ) : null}
                {reviews.map((review) => (
                    <Card key={review.id}>
                        <CardContent className="mt-4">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-xl font-bold">
                                        Username
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        {formatDate(review.date)}
                                    </p>
                                </div>
                                <Button
                                    onClick={() =>
                                        handleDeleteReview(review.id)
                                    }
                                >
                                    Delete
                                </Button>
                            </div>
                            <p className="font-bold">{review.rating} / 5</p>
                            {review.comment && (
                                <p className="mt-2">{review.comment}</p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </Card>
    );
};

export default MovieReviews;
