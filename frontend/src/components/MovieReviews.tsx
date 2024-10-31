import React, { useState } from "react";
import { Button } from "../shadcn/components/ui/button";
import { Textarea } from "../shadcn/components/ui/textarea";
import { Card, CardContent } from "../shadcn/components/ui/card";
import Ratings from "../shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { useApolloClient, useMutation, useReactiveVar } from "@apollo/client";
import { Movie, Review } from "@/types/__generated__/types";
import { ADD_REVIEW, DELETE_REVIEW } from "@/api/queries";
import { formatDate } from "@/utils/formatDate";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/shadcn/components/ui/alert-dialog";
interface MovieReviewsProps {
    movie: Movie;
}

const MovieReviews: React.FC<MovieReviewsProps> = ({ movie }) => {
    const client = useApolloClient();
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

    const [deleteReview, { error: deleteReviewError }] = useMutation(
        DELETE_REVIEW,
        {
            update(cache, { data }) {
                if (!data?.deleteReview) return;
                cache.modify({
                    id: data.deleteReview._id.toString(),
                    fields: {
                        reviews() {
                            return data.deleteReview.reviews;
                        },
                    },
                });
            },
        }
    );

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
        const newReviews: Review[] = response.data.addReview
            .reviews as Review[];
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

        const newReviews: Review[] = response.data.deleteReview
            .reviews as Review[];
        setReviews(newReviews);

        // Make sure the deleted review is deleted from cache.
        client.cache.gc();
    };

    if (addReviewError || deleteReviewError) {
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
                                    <h4 className="text-lg font-bold sm:text-xl">
                                        {review.username}
                                    </h4>
                                    <time className="text-xs text-gray-500 sm:text-sm">
                                        {formatDate(review.date)}
                                    </time>
                                </section>
                                {review.username !== "Guest" &&
                                    username === review.username && (
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    size="sm"
                                                    className="h-8 px-2"
                                                >
                                                    <Trash2 className="h-4 w-4 sm:hidden" />
                                                    <span className="hidden sm:inline">
                                                        Delete
                                                    </span>
                                                </Button>
                                            </AlertDialogTrigger>

                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure you want to
                                                        delete this review?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be
                                                        undone. This will
                                                        permanently delete this
                                                        review.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteReview(
                                                                review
                                                            )
                                                        }
                                                    >
                                                        Continue
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    )}
                            </section>
                            <Ratings
                                value={review.rating}
                                variant="yellow"
                                totalstars={5}
                            />
                            {review.comment !== "" && (
                                <p className="mt-2 text-sm sm:text-base">
                                    {review.comment}
                                </p>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </section>
        </Card>
    );
};

export default MovieReviews;
