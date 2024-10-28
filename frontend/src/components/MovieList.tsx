import { MoviePoster } from "@/types/movieTypes";
import MovieCard from "./MovieCard";
import { Button } from "@/shadcn/components/ui/button";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useState } from "react";
import { filtersVar, searchVar, sortOptionVar } from "@/utils/cache";
import { gql } from "@/__generated__";
import { FiltersInput } from "@/__generated__/types";

const GET_MOVIES = gql(`
    query GetMovies(
        $skip: Int
        $limit: Int
        $filters: FiltersInput
        $sortOption: SortingType
        $search: String
    ) {
        movies(
            skip: $skip
            limit: $limit
            filters: $filters
            sortOption: $sortOption
            search: $search
        ) {
            _id
            title
            vote_average
            release_date
            runtime
            poster_path
        }
    }
`);

const MovieList = () => {
    const [isMoreMovies, setIsMoreMovies] = useState<boolean>(false);
    const filters = useReactiveVar(filtersVar);
    const sortOption = useReactiveVar(sortOptionVar);
    const search = useReactiveVar(searchVar);
    const LIMIT = 20;

    const { data, loading, error, fetchMore } = useQuery(GET_MOVIES, {
        variables: {
            skip: 0,
            limit: LIMIT,
            filters: filters as FiltersInput,
            sortOption: sortOption,
            search: search,
        },
        onCompleted: (data) => {
            if (data.movies) {
                setIsMoreMovies(
                    data.movies.length >= LIMIT &&
                        data.movies.length % LIMIT === 0
                );
            }
        },
    });

    const handleLoadMore = () => {
        fetchMore({ variables: { skip: data?.movies.length } }).then(
            (fetchMoreResult) => {
                setIsMoreMovies(fetchMoreResult.data.movies.length === LIMIT);
            }
        );
    };

    if (loading) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Loading...</h1>
            </section>
        );
    }

    if (error) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <p className="text-primary">Try to refresh</p>
            </section>
        );
    }

    return (
        <>
            {!data?.movies || data.movies.length === 0 ? (
                <section className="text-center">
                    <h1 className="text-2xl">No movies found</h1>
                    <p className="text-primary">Please refine your search</p>
                </section>
            ) : (
                <ul className="flex flex-wrap justify-center">
                    {(data.movies as MoviePoster[]).map((movie) => (
                        <li
                            key={movie._id}
                            className="m-2 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[13%]"
                        >
                            <MovieCard movie={movie} />
                        </li>
                    ))}
                </ul>
            )}
            {isMoreMovies && (
                <div className="flex justify-center">
                    <Button size="lg" className="m-10" onClick={handleLoadMore}>
                        Load More
                    </Button>
                </div>
            )}
        </>
    );
};

export default MovieList;
