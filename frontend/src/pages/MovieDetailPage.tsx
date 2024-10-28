import MovieCardDetailed from "../components/MovieCardDetailed";
import MovieReviews from "../components/MovieReviews";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Movie } from "@/types/__generated__/types";
import { GET_MOVIE } from "@/api/queries";

function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const movieIdAsInt = Number(movieId);

    const { data, loading, error } = useQuery(GET_MOVIE, {
        variables: { movieId: movieIdAsInt },
        skip: isNaN(movieIdAsInt),
    });

    if (error) {
        return (
            <main className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </main>
        );
    }

    if (loading) {
        return (
            <main className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Loading...</h1>
            </main>
        );
    }

    if (!data?.movie) {
        return (
            <main className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Could not find movie!</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </main>
        );
    }

    return (
        <main>
            <MovieCardDetailed movie={data?.movie as Movie} />
            <MovieReviews movieId={(data?.movie as Movie)._id} />
        </main>
    );
}

export default MovieDetailPage;
