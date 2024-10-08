import FilterPanel from "../components/FilterPanel";
import MovieList from "../components/MovieList";
import { all_movies } from "../mock/util";

function MoviesPage() {
    return (
        <div>
            <FilterPanel />
            <MovieList movies={all_movies} />{" "}
        </div>
    );
}

export default MoviesPage;
