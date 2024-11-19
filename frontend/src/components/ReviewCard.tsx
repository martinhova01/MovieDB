import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { formatDate } from "@/utils/formatUtil";
import { Reference, useMutation, useReactiveVar } from "@apollo/client";
import { Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
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
import { DELETE_REVIEW } from "../api/queries";
import { Review } from "@/types/__generated__/types";
import { getImageUrl, ImageType } from "@/utils/imageUrl/imageUrl";
import Loader from "./Loader";
import { toast } from "sonner";

interface ReviewCardProps {
    review: Review;
    showPoster?: boolean;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    showPoster = true,
}) => {
    const username = useReactiveVar(usernameVar);

    const [deleteReview, { loading }] = useMutation(DELETE_REVIEW, {
        update(cache, { data }) {
            if (!data?.deleteReview) return;
            const deletedRef: string = `Review:${data.deleteReview._id}`;
            cache.modify({
                id: `Movie:${data.deleteReview.movie._id}`,
                fields: {
                    reviews(existingReviewRefs = []) {
                        return existingReviewRefs.filter(
                            (reviewRef: Reference) =>
                                reviewRef.__ref != deletedRef
                        );
                    },
                },
            });
            cache.modify({
                fields: {
                    latestReviews(existingReviewRefs = []) {
                        return existingReviewRefs.filter(
                            (reviewRef: Reference) =>
                                reviewRef.__ref != deletedRef
                        );
                    },
                    userReviews(existingReviewRefs = [], { storeFieldName }) {
                        if (!storeFieldName.includes(username)) {
                            return existingReviewRefs;
                        }
                        return existingReviewRefs.filter(
                            (reviewRef: Reference) =>
                                reviewRef.__ref != deletedRef
                        );
                    },
                },
            });
            cache.evict({ id: deletedRef });
        },
    });

    const handleDeleteReview = (review: Review) => {
        deleteReview({
            variables: {
                id: review._id,
            },
        })
            .then((response) => {
                if (response.data?.deleteReview) {
                    toast.success("Review has been deleted");
                }
            })
            .catch((error) => {
                toast.error("Failed to delete review", {
                    action: {
                        label: "Retry",
                        onClick: () => handleDeleteReview(review),
                    },
                    description:
                        error instanceof Error
                            ? error.message
                            : "An error occurred",
                });
            });
    };

    return (
        <Card>
            <CardContent className="relative p-4">
                {review.username !== "Guest" &&
                    username === review.username && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                {loading ? (
                                    <Loader
                                        size="sm"
                                        className="absolute right-4 top-4 m-0 h-8 px-2"
                                    />
                                ) : (
                                    <Button
                                        size="sm"
                                        className="absolute right-4 top-4 h-8 px-2"
                                    >
                                        <Trash2 className="h-4 w-4 sm:hidden" />
                                        <span className="hidden sm:inline">
                                            Delete
                                        </span>
                                    </Button>
                                )}
                            </AlertDialogTrigger>

                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>
                                        Are you sure you want to delete this
                                        review?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone and will
                                        permanently delete the review.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() =>
                                            handleDeleteReview(review)
                                        }
                                        disabled={loading}
                                    >
                                        {loading ? "Deleting..." : "Continue"}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                {showPoster && (
                    <Link to={`/movie/${review.movie._id}`}>
                        <img
                            title={review.movie.title}
                            src={getImageUrl(
                                ImageType.POSTER,
                                review.movie.poster_path,
                                "w342"
                            )}
                            className="float-left mb-2 mr-6 h-48 w-32 rounded-lg object-cover"
                            alt={`${review.movie.title} poster`}
                        />
                    </Link>
                )}
                <section className={showPoster ? "min-h-[12rem]" : ""}>
                    <section className="mb-2 pr-16">
                        <h2 className="text-lg font-bold sm:text-xl">
                            {review.username}
                        </h2>
                        <time
                            className="text-xs opacity-60 sm:text-sm"
                            dateTime={review.date.toISOString()}
                        >
                            {formatDate(review.date)}
                        </time>
                    </section>
                    <Ratings
                        value={review.rating}
                        variant="yellow"
                        totalstars={5}
                    />
                    {review.comment && (
                        <p className="mt-2 break-words text-sm sm:text-base">
                            {review.comment}
                        </p>
                    )}
                </section>
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
