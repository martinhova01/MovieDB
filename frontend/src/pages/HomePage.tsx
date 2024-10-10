import { useState } from "react";
import SortAndFilterPanel from "../components/SortAndFilterPanel";
import MovieList from "../components/MovieList";
import { all_movies } from "../mock/util";
import { filterMovies, sortMovies } from "../utils/sortAndFilter";
import { Movie } from "../types/movieTypes";

function HomePage() {
    const [movies, setMovies] = useState<Movie[]>(all_movies);

    const handleFilterChange = (
        filters: { [key: string]: string[] },
        sortOption: string
    ) => {
        const filteredMovies = filterMovies(all_movies, filters);
        const sortedAndFilteredMovies = sortMovies(sortOption, filteredMovies);
        setMovies(sortedAndFilteredMovies);
    };

    const handleSortChange = (sortOption: string) => {
        const sortedMovies = sortMovies(sortOption, movies);
        setMovies(sortedMovies);
    };

    return (
        <main>
            <SortAndFilterPanel
                handleFilterChange={handleFilterChange}
                handleSortChange={handleSortChange}
            />
            <MovieList movies={movies} />
        </main>
    );
}

export default HomePage;
