import SortAndFilterPanel from "../components/SortAndFilterPanel";
import MovieList from "../components/MovieList";
import SearchBar from "../components/SearchBar";

function HomePage() {
    return (
        <main id="main-content">
            <section className="flex flex-row gap-2 p-4">
                <SortAndFilterPanel />
                <SearchBar />
            </section>
            <MovieList />
        </main>
    );
}

export default HomePage;
