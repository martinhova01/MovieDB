import ReviewCard from "@/components/ReviewCard";
import InfiniteScroll from "react-infinite-scroller";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_LATEST_REVIEWS } from "../api/queries";
import { Review } from "@/types/__generated__/types";
import Loader from "../components/Loader";

const ActivityPage = () => {
    const [isMoreReviews, setIsMoreReviews] = useState<boolean>(false);
    const LIMIT = 20;

    const { data, loading, error, fetchMore } = useQuery(GET_LATEST_REVIEWS, {
        variables: {
            skip: 0,
            limit: LIMIT,
        },
        onCompleted: (data) => {
            if (data.latestReviews) {
                setIsMoreReviews(
                    data.latestReviews.length >= LIMIT &&
                        data.latestReviews.length % LIMIT === 0
                );
            }
        },
    });

    const latestReviews = useMemo(
        () => data?.latestReviews as Review[] | undefined,
        [data]
    );

    const handleLoadMore = () => {
        fetchMore({ variables: { skip: latestReviews?.length } }).then(
            (fetchMoreResult) => {
                setIsMoreReviews(
                    fetchMoreResult.data.latestReviews.length === LIMIT
                );
            }
        );
    };

    if (loading) {
        return (
            <section className="mt-6 w-dvw text-center">
                <Loader size="lg">
                    <p className="text-2xl">Loading...</p>
                </Loader>
            </section>
        );
    }

    if (error || !latestReviews) {
        return (
            <section className="mt-6 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <p className="text-primary">Try to refresh</p>
            </section>
        );
    }

    if (latestReviews.length === 0) {
        return (
            <section className="mt-6 text-center">
                <h1 className="text-2xl">No reviews have been added yet</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </section>
        );
    }

    return (
        <main id="main-content" className="mx-auto mt-8 max-w-6xl px-4 pb-4">
            <h1 className="mb-6 text-center text-3xl font-bold">
                Latest Activity
            </h1>
            <InfiniteScroll
                loadMore={handleLoadMore}
                hasMore={isMoreReviews}
                initialLoad={false}
                threshold={100}
                loader={
                    <Loader
                        key={-1}
                        aria-label="Loading more reviews..."
                        className="text-center"
                    >
                        <p className="text-2xl">Loading...</p>
                    </Loader>
                }
            >
                <ul className="space-y-6">
                    {latestReviews.map((review) => (
                        <li key={review._id}>
                            <ReviewCard review={review} />
                        </li>
                    ))}
                </ul>
            </InfiniteScroll>
        </main>
    );
};

export default ActivityPage;
