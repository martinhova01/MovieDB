import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { usernameVar } from "@/utils/cache";
import { formatDate } from "@/utils/formatUtil";
import { useApolloClient, useMutation, useReactiveVar } from "@apollo/client";
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
import {
    DELETE_REVIEW,
    GET_LATEST_REVIEWS,
    GET_USER_REVIEWS,
} from "../api/queries";
import { Review } from "@/types/__generated__/types";
import { getImageUrl, ImageType } from "@/utils/imageUrl/imageUrl";
import Loader from "./Loader";

interface ReviewCardProps {
    review: Review;
    showPoster?: boolean;
    onDelete?: (review: Review) => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
    review,
    showPoster = true,
    onDelete,
}) => {
    const username = useReactiveVar(usernameVar);
    const client = useApolloClient();

    const [deleteReview, { loading, error: deleteReviewError }] = useMutation(
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

    const handleDeleteReview = async (review: Review) => {
        const response = await deleteReview({
            variables: {
                id: review._id,
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

        if (response.data?.deleteReview) {
            onDelete?.(review);
            client.cache.gc();
        }
    };

    if (deleteReviewError) {
        return (
            <div className="flex h-full items-center justify-center">
                <section className="text-center">
                    <h1 className="text-2xl">
                        Something went wrong when deleting the review!
                    </h1>
                    <p className="text-primary">Try to refresh</p>
                </section>
            </div>
        );
    }

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
                        <h4 className="text-lg font-bold sm:text-xl">
                            {review.username}
                        </h4>
                        <time className="text-xs text-gray-500 sm:text-sm">
                            {formatDate(review.date)}
                        </time>
                    </section>
                    <Ratings
                        value={review.rating}
                        variant="yellow"
                        totalstars={5}
                    />
                    {review.comment && (
                        <p className="mt-2 text-sm sm:text-base">
                            {review.comment}
                        </p>
                    )}
                </section>
            </CardContent>
        </Card>
    );
};

export default ReviewCard;
