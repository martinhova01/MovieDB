import ReviewCard from "@/components/ReviewCard";
import InfiniteScroll from "react-infinite-scroller";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery, useReactiveVar } from "@apollo/client";
import { GET_USER_REVIEWS } from "../api/queries";
import { Review } from "@/types/__generated__/types";
import { usernameVar } from "@/utils/cache";
import Loader from "../components/Loader";

const MyReviewsPage = () => {
    const username = useReactiveVar(usernameVar);
    const [isMoreReviews, setIsMoreReviews] = useState<boolean>(false);
    const LIMIT = 20;
    const navigate = useNavigate();

    const { data, loading, error, fetchMore } = useQuery(GET_USER_REVIEWS, {
        variables: {
            username: username,
            skip: 0,
            limit: LIMIT,
        },
        // Do not send network-request if username is "Guest"
        // Since guests should not see this page at all
        skip: username === "Guest",
        onCompleted: (data) => {
            if (data.userReviews) {
                // Let the infinite scroll know if there are more reviews to fetch
                setIsMoreReviews(
                    data.userReviews.length >= LIMIT &&
                        data.userReviews.length % LIMIT === 0
                );
            }
        },
    });

    const userReviews = useMemo(
        () => data?.userReviews as Review[] | undefined,
        [data]
    );

    useEffect(() => {
        if (username === "Guest") {
            // Guests should not see this page at all
            navigate("/");
        }
    }, [username, navigate]);

    const handleLoadMore = () => {
        fetchMore({ variables: { skip: userReviews?.length } }).then(
            (fetchMoreResult) => {
                setIsMoreReviews(
                    fetchMoreResult.data.userReviews.length === LIMIT
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

    if (error || !userReviews) {
        return (
            <section className="mt-6 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <p className="text-primary">Try to refresh</p>
            </section>
        );
    }

    if (userReviews.length === 0) {
        return (
            <section className="mt-6 text-center">
                <h1 className="text-2xl">You have not added any reviews yet</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </section>
        );
    }

    return (
        <section className="mx-auto mt-8 max-w-6xl px-4 pb-4">
            <h1 className="mb-6 text-center text-3xl font-bold">My Reviews</h1>
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
                    {userReviews.map((review) => (
                        <li key={review._id}>
                            <ReviewCard
                                review={{
                                    ...review,
                                    username,
                                }}
                            />
                        </li>
                    ))}
                </ul>
            </InfiniteScroll>
        </section>
    );
};

export default MyReviewsPage;
