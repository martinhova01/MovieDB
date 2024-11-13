import { MoviePoster } from "@/types/movieTypes";
import MovieCard from "./MovieCard";
import InfiniteScroll from "react-infinite-scroller";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useMemo, useState } from "react";
import { formatNumber } from "@/utils/formatUtil";
import {
    filtersVar,
    searchVar,
    sortOptionVar,
    totalHitsVar,
} from "@/utils/cache";
import { GET_MOVIES } from "@/api/queries";
import Loader from "./Loader";
import MovieCardSkeleton from "./MovieCardSkeleton";

const MovieList = () => {
    const [isMoreMovies, setIsMoreMovies] = useState<boolean>(false);
    const filters = useReactiveVar(filtersVar);
    const sortOption = useReactiveVar(sortOptionVar);
    const search = useReactiveVar(searchVar);
    const totalHits = useReactiveVar(totalHitsVar);
    const LIMIT = 20;

    const { data, loading, error, fetchMore } = useQuery(GET_MOVIES, {
        variables: {
            skip: 0,
            limit: LIMIT,
            filters: filters,
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

    if (error || (!loading && !movies)) {
        return (
            <section className="mt-2 w-dvw text-center">
                <h1 className="text-2xl">Something went wrong!</h1>
                <p className="text-primary">Try to refresh</p>
            </section>
        );
    }

    if (!loading && movies?.length === 0) {
        return (
            <section className="text-center">
                <h1 className="text-2xl">No movies found</h1>
                <p className="text-primary">Please refine your search</p>
            </section>
        );
    }

    const listClass = "m-2 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[13%]";

    return (
        <InfiniteScroll
            loadMore={handleLoadMore}
            hasMore={isMoreMovies}
            initialLoad={false}
            threshold={100}
            loader={
                <Loader
                    key={-1}
                    aria-label="Loading more movies..."
                    className="text-center"
                >
                    <p className="text-2xl">Loading...</p>
                </Loader>
            }
        >
            <p className="px-3 py-1 text-center text-lg font-bold">
                Total Hits: {formatNumber(totalHits)}
            </p>
            <ul className="flex flex-wrap justify-center">
                {loading
                    ? Array.from({ length: LIMIT }, (_, i) => i).map((i) => (
                          <li
                              key={i}
                              className={listClass}
                              data-testid="movie-card-skeleton"
                          >
                              <MovieCardSkeleton />
                          </li>
                      ))
                    : movies?.map((movie) => (
                          <li
                              key={movie._id}
                              className={listClass}
                              data-testid="movie-card"
                          >
                              <MovieCard movie={movie} />
                          </li>
                      ))}
            </ul>
        </InfiniteScroll>
    );
};

export default MovieList;
