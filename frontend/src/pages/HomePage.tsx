import FilterPanel from "../components/FilterPanel";
import MovieList from "../components/MovieList";
import { all_movies } from "../mock/util";

function HomePage() {
    return (
        <main>
            <FilterPanel />
            <MovieList movies={all_movies} />
        </main>
    );
}

export default HomePage;
