import { Button } from "@/shadcn/components/ui/button";
import { Card, CardContent } from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { Review } from "@/types/movieTypes";
import { usernameVar } from "@/utils/cache";
import { formatDate } from "@/utils/formatDate";
import { useReactiveVar } from "@apollo/client";
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

interface ReviewCardProps {
    review: Review;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
    const username = useReactiveVar(usernameVar);

    const handleDeleteReview = (review: Review) => {
        console.log(review._id);
    };

    return (
        <Card>
            <CardContent className="relative p-4">
                {review.username !== "Guest" &&
                    username === review.username && (
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="sm"
                                    className="absolute right-4 top-4 h-8 px-2"
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
                                        Are you sure you want to delete this
                                        review?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete this review.
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
                                    >
                                        Continue
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    )}
                <Link to={`/movie/${review.movieId}`}>
                    <img
                        title="Visit movie"
                        src={`https://image.tmdb.org/t/p/w342/${review.poster_path}`}
                        className="float-left mb-2 mr-6 h-48 w-32 rounded-lg object-cover"
                        alt="Movie Poster"
                    />
                </Link>
                <section className="min-h-[12rem]">
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
