import { useState } from "react";
import MovieCardDetailed from "../components/MovieCardDetailed";
import MovieReviews from "../components/MovieReviews";
import { Link, useParams } from "react-router-dom";
import { Movie } from "../types/movieTypes";
import { gql, useQuery } from "@apollo/client";

const GET_MOVIE = gql`
    query GetMovie($movieId: Int!) {
        movie(id: $movieId) {
            _id
            title
            vote_average
            vote_count
            status
            release_date
            revenue
            runtime
            backdrop_path
            budget
            homepage
            imdb_id
            original_language
            original_title
            overview
            popularity
            poster_path
            tagline
            genres
            production_companies
            production_countries
            spoken_languages
            keywords
        }
    }
`;

type MovieRaw = Omit<Movie, "release_date"> & {
    release_date: string;
};

interface GetMovieData {
    movie: MovieRaw;
}

function MovieDetailPage() {
    const [movie, setMovie] = useState<Movie | null>(null);
    const { movieId } = useParams<{ movieId: string }>();
    const movieIdAsInt = Number(movieId);

    const { loading, error } = useQuery<GetMovieData>(GET_MOVIE, {
        variables: { movieId: movieIdAsInt },
        skip: isNaN(movieIdAsInt),
        onCompleted: (data) => {
            if (data.movie) {
                const movieWithDate: Movie = {
                    ...data.movie,
                    release_date: new Date(data.movie.release_date),
                };
                setMovie(movieWithDate as Movie);
            }
        },
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

    if (!movie) {
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
            <MovieCardDetailed movie={movie} />
            <MovieReviews movieId={movie._id} />
        </main>
    );
}

export default MovieDetailPage;
