import MovieCardDetailed from "@/components/MovieCardDetailed";
import MovieReviews from "@/components/MovieReviews";
import { useParams } from "react-router-dom";

function MoviePage() {
    const { movieId } = useParams<{ movieId: string }>();

    const numericMovieId = movieId ? parseInt(movieId, 10) : undefined;

    if (numericMovieId === undefined) {
        return <div>Invalid movie ID</div>;
    }

    return (
        <div>
            <MovieCardDetailed movieId={numericMovieId} />
            <MovieReviews movieId={numericMovieId} />
        </div>
    );
}

export default MoviePage;
