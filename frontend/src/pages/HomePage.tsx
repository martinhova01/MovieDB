import { useEffect, useState } from "react";
import SortAndFilterPanel from "../components/SortAndFilterPanel";
import MovieList from "../components/MovieList";
import { all_movies } from "../mock/util";
import {
    filterMovies,
    searchMovies,
    sortMovies,
} from "../utils/searchSortAndFilter";
import { Movie } from "../types/movieTypes";
import SearchBar from "../components/SearchBar";
import { useReactiveVar } from "@apollo/client";
import { filtersVar, searchVar, sortOptionVar } from "@/utils/cache";

function HomePage() {
    const [movies, setMovies] = useState<Movie[]>(all_movies);
    const filters = useReactiveVar(filtersVar);
    const sortOption = useReactiveVar(sortOptionVar);
    const search = useReactiveVar(searchVar);

    useEffect(() => {
        const sortFilterSearchMovies = sortMovies(
            sortOption,
            searchMovies(search, filterMovies([...all_movies], filters))
        );

        setMovies(sortFilterSearchMovies);
    }, [filters, sortOption, search]);

    return (
        <main>
            <section className="flex flex-row p-4 gap-2">
                <SortAndFilterPanel />
                <SearchBar />
            </section>
            <MovieList movies={movies} />
        </main>
    );
}

export default HomePage;
