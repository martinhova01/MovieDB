import FilterPanel from "./components/FilterPanel";
import MovieList from "./components/MovieList";
import { all_movies } from "./mock/util";
import { Outlet } from "react-router-dom";

function App() {
    return (
        <>
            <FilterPanel />
            <MovieList movies={all_movies} />
            <Outlet />
        </>
    );
}

export default App;
