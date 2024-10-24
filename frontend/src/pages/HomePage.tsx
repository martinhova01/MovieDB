import { useEffect, useState } from "react";
import SortAndFilterPanel from "../components/SortAndFilterPanel";
import MovieList from "../components/MovieList";
import { MoviePoster } from "../types/movieTypes";
import SearchBar from "../components/SearchBar";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { filtersVar } from "@/utils/cache";

const GET_MOVIES = gql`
    query GetMovies($skip: Int, $limit: Int, $filters: MovieFilters) {
        movies(skip: $skip, limit: $limit, filters: $filters) {
            _id
            title
            vote_average
            release_date
            runtime
            poster_path
        }
    }
`;

type MoviePosterRaw = Omit<MoviePoster, "release_date"> & {
    release_date: string;
};

interface GetMoviesData {
    movies: MoviePosterRaw[];
}

function HomePage() {
    const [movies, setMovies] = useState<MoviePoster[]>([]);
    const filters = useReactiveVar(filtersVar);

    const { data, loading, error, fetchMore } = useQuery<GetMoviesData>(
        GET_MOVIES,
        {
            variables: {
                skip: 0,
                limit: 20,
                filters: {
                    genre: filters.Genre || [],
                    rating: filters.Rating || [],
                    releaseYear: filters["Release Year"] || [],
                    language: filters.Language || [],
                    status: filters.Status || [],
                    runtime: filters.Runtime || [],
                },
            },
        }
    );

    useEffect(() => {
        if (data?.movies) {
            const moviesWithDate = data.movies.map((movie) => ({
                ...movie,
                release_date: new Date(movie.release_date),
            }));
            setMovies(moviesWithDate as MoviePoster[]);
        }
    }, [data]);

    if (loading) {
        return (
            <main className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Loading...</h1>
            </main>
        );
    }

    if (error) {
        return (
            <main className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <h2 className="text-primary">Try to refresh</h2>
            </main>
        );
    }

    const loadMore = () => {
        fetchMore({
            variables: { skip: movies.length },
        });
    };

    return (
        <main>
            <section className="flex flex-row gap-2 p-4">
                <SortAndFilterPanel />
                <SearchBar />
            </section>
            <MovieList movies={movies} loadMore={loadMore} />
        </main>
    );
}

export default HomePage;
