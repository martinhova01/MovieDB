import { Movie } from "@/types/movieTypes";
import MovieCard from "./MovieCard";
import { Button } from "@/shadcn/components/ui/button";
import { useState } from "react";

const MovieList = ({ movies }: { movies: Movie[] }) => {
    const [maxLength, setMaxLength] = useState(20);
    return (
        <>
            <ul className="flex flex-wrap justify-center">
                {movies.slice(0, maxLength).map((movie: Movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </ul>
            <div className="flex justify-center">
                <Button
                    size="lg"
                    className="m-10"
                    onClick={() =>
                        setMaxLength(
                            Math.min(maxLength + 10, movies.length - 1)
                        )
                    }
                >
                    Load More
                </Button>
            </div>
        </>
    );
};

export default MovieList;
