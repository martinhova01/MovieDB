import { MoviePoster } from "@/types/movieTypes";
import MovieCard from "./MovieCard";
import { Button } from "@/shadcn/components/ui/button";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useMemo, useState } from "react";
import { filtersVar, searchVar, sortOptionVar } from "@/utils/cache";
import { FiltersInput } from "@/types/__generated__/types";
import { GET_MOVIES } from "@/api/queries";

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

    const movies = useMemo(
        () => data?.movies as MoviePoster[] | undefined,
        [data]
    );

    const handleLoadMore = () => {
        fetchMore({ variables: { skip: movies?.length } }).then(
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

    if (error || !movies) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <p className="text-primary">Try to refresh</p>
            </section>
        );
    }

    if (movies.length === 0) {
        return (
            <section className="text-center">
                <h1 className="text-2xl">No movies found</h1>
                <p className="text-primary">Please refine your search</p>
            </section>
        );
    }

    return (
        <>
            <ul className="flex flex-wrap justify-center">
                {movies.map((movie) => (
                    <li
                        key={movie._id}
                        className="m-2 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[13%]"
                    >
                        <MovieCard movie={movie} />
                    </li>
                ))}
            </ul>
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
