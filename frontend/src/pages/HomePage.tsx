import { useState } from "react";
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

function HomePage() {
    const [movies, setMovies] = useState<Movie[]>(all_movies);

    const handleSearchChange = (searchString: string) => {
        sessionStorage.setItem("search", searchString);

        // Using sessionStorage to get the filters and sorting option here is a temporary solution
        // This will be refactored and changed when we later add global state management
        // Implemented now to get a better feel for the application
        const storedFilters = sessionStorage.getItem("filters");
        const filters = storedFilters ? JSON.parse(storedFilters) : {};
        const storedSortOption = sessionStorage.getItem("sort_option");
        const parsedSortOption: SortingType = storedSortOption
            ? (storedSortOption as SortingType)
            : SortingType.NEWEST_FIRST;

        handleFilterChange(filters, parsedSortOption);
    };

    const handleFilterChange = (
        filters: { [key: string]: string[] },
        sortOption: SortingType
    ) => {
        // Using sessionStorage here to get the search string is a temporary solution
        // This will be refactored and changed when we later add global state managment
        // Implemented now to get a better feel for the application
        const search = sessionStorage.getItem("search") || "";

        const sortFilterSearchMovies = sortMovies(
            sortOption,
            searchMovies(search, filterMovies([...all_movies], filters))
        );

        setMovies(sortFilterSearchMovies);
    };

    const handleSortChange = (sortOption: SortingType) => {
        const sortedMovies = sortMovies(sortOption, [...movies]);
        setMovies(sortedMovies);
    };

    return (
        <main>
            <section className="flex flex-row p-4 gap-2">
                <SortAndFilterPanel
                    handleFilterChange={handleFilterChange}
                    handleSortChange={handleSortChange}
                />
                <SearchBar handleSearchChange={handleSearchChange} />
            </section>
            <MovieList movies={movies} />
        </main>
    );
}

export default HomePage;
