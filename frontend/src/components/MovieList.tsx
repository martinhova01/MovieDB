import { Movie } from "@/types/movieTypes";
import MovieCard from "./MovieCard";

const MovieList = ({ movies }: { movies: Movie[] }) => {
    return (
        <div className="flex flex-wrap justify-evenly">
            {movies.map((movie: Movie) => (
                <MovieCard movie={movie} />
            ))}
        </div>
    );
};

export default MovieList;
