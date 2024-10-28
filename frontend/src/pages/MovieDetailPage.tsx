import MovieCardDetailed from "../components/MovieCardDetailed";
import MovieReviews from "../components/MovieReviews";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { gql } from "@/types/__generated__";
import { Movie } from "@/types/__generated__/types";

const GET_MOVIE = gql(`
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
`);

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
