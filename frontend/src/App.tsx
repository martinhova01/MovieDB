import FilterPanel from "./components/FilterPanel";
import MovieList from "./components/MovieList";
import { all_movies } from "./mock/util";

function App() {
    return (
        <>
            <FilterPanel />
            <MovieList movies={all_movies} />
        </>
    );
}

export default App;
