import ReviewCard from "@/components/ReviewCard";
import { all_reviews } from "@/mock/util";
import { Button } from "@/shadcn/components/ui/button";
import { Review } from "@/types/movieTypes";
import { useEffect, useState } from "react";

function ActivityPage() {
    const [maxLength, setMaxLength] = useState(10);

    const reviews: Review[] = all_reviews;

    useEffect(() => {
        setMaxLength(Math.min(10, reviews.length));
    }, [reviews]);

    return (
        <main className="mx-auto mt-8 max-w-6xl px-4 pb-4">
            <h1 className="mb-6 text-center text-3xl font-bold">
                Latest Activity
            </h1>
            {reviews.length === 0 ? (
                <section className="text-center">
                    <h1 className="text-2xl">No reviews found</h1>
                </section>
            ) : (
                <ul className="space-y-6">
                    {reviews.slice(0, maxLength).map((review) => (
                        <li key={review._id}>
                            <ReviewCard review={review} />
                        </li>
                    ))}
                </ul>
            )}
            {maxLength < reviews.length && (
                <div className="flex justify-center">
                    <Button
                        size="lg"
                        className="m-10"
                        onClick={() =>
                            setMaxLength(
                                Math.min(maxLength + 10, reviews.length)
                            )
                        }
                    >
                        Load More
                    </Button>
                </div>
            )}
        </main>
    );
}

export default ActivityPage;
