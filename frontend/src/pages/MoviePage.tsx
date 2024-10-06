import { useParams } from "react-router-dom";

function MoviePage() {
    const params = useParams<{ movieId: string }>();
    return (
        <div>
            <h1>Movie Page</h1>
            <h2>{params.movieId}</h2>
        </div>
    );
}

export default MoviePage;
