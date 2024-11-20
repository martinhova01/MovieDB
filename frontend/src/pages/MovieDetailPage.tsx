import MovieCardDetailed from "../components/MovieCardDetailed";
import MovieReviews from "../components/MovieReviews";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Movie } from "@/types/__generated__/types";
import { GET_MOVIE } from "@/api/queries";
import { useMemo } from "react";
import Loader from "../components/Loader";

function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const movieIdAsInt = Number(movieId);

    const { data, loading, error } = useQuery(GET_MOVIE, {
        variables: { movieId: movieIdAsInt },
        skip: isNaN(movieIdAsInt),
    });

    const movie = useMemo(() => data?.movie as Movie | undefined, [data]);

    if (error) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </section>
        );
    }

    if (loading) {
        return (
            <section className="mt-2 w-dvw text-center">
                <Loader size="lg">
                    <p className="text-2xl">Loading...</p>
                </Loader>
            </section>
        );
    }

    if (!movie) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Could not find movie!</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </section>
        );
    }

    return (
        <section className="pb-2">
            <MovieCardDetailed movie={movie} />
            <MovieReviews movie={movie} />
        </section>
    );
}

export default MovieDetailPage;
