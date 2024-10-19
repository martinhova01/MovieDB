import { useEffect, useState } from "react";
import SortAndFilterPanel from "../components/SortAndFilterPanel";
import MovieList from "../components/MovieList";
import { all_movies } from "../mock/util";
import {
    filterMovies,
    SortingType,
    searchMovies,
    sortMovies,
} from "../utils/searchSortAndFilter";
import { Movie } from "../types/movieTypes";
import SearchBar from "../components/SearchBar";
import { useReactiveVar } from "@apollo/client";
import { filtersVar, sortOptionVar } from "@/cache";

function HomePage() {
    const [movies, setMovies] = useState<Movie[]>(all_movies);
    const filters = useReactiveVar(filtersVar);
    const sortOption = useReactiveVar(sortOptionVar);

    useEffect(() => {
        handleChange(filters, sortOption);
    }, [filters, sortOption]);

    const handleSearchChange = (searchString: string) => {
        sessionStorage.setItem("search", searchString);
        handleChange(filters, sortOption);
    };

    const handleChange = (
        filters: { [key: string]: string[] },
        sortOption: SortingType
    ) => {
        // Using sessionStorage here to get the search string is a temporary solution
        const search = sessionStorage.getItem("search") || "";

        const sortFilterSearchMovies = sortMovies(
            sortOption,
            searchMovies(search, filterMovies([...all_movies], filters))
        );

        setMovies(sortFilterSearchMovies);
    };

    return (
        <main>
            <section className="flex flex-row p-4 gap-2">
                <SortAndFilterPanel />
                <SearchBar handleSearchChange={handleSearchChange} />
            </section>
            <MovieList movies={movies} />
        </main>
    );
}

export default HomePage;
