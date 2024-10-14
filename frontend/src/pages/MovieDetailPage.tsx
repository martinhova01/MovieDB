import { useEffect, useState } from "react";
import MovieCardDetailed from "../components/MovieCardDetailed";
import MovieReviews from "../components/MovieReviews";
import { Link, useParams } from "react-router-dom";
import { all_movies } from "../mock/util";
import { Movie } from "../types/movieTypes";

function MovieDetailPage() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);
    const { movieId } = useParams<{ movieId: string }>();

    useEffect(() => {
        const numericMovieId = parseInt(movieId!, 10);

        if (isNaN(numericMovieId)) {
            setError("Invalid movieID");
            return;
        }

        const foundMovie = all_movies.find(
            (movie: Movie) => movie._id === numericMovieId
        );

        if (foundMovie) {
            setMovie(foundMovie);
        } else {
            setError("Movie not found");
        }
    }, [movieId]);

    if (error) {
        return (
            <main className="w-dvw text-center mt-2">
                <h1 className="text-2xl">{error}</h1>
                <Link to="/" className="text-primary hover:underline">
                    Return to home page
                </Link>
            </main>
        );
    }

    if (!movie) return <div>Loading...</div>;

    return (
        <main>
            <MovieCardDetailed movie={movie} />
            <MovieReviews movieId={movie._id} />
        </main>
    );
}

export default MovieDetailPage;
