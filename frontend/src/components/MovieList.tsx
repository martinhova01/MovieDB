import { Movie } from "@/types/movieTypes";
import MovieCard from "./MovieCard";
import { Button } from "@/shadcn/components/ui/button";
import { useEffect, useState } from "react";

const MovieList = ({ movies }: { movies: Movie[] }) => {
    const [maxLength, setMaxLength] = useState(20);

    useEffect(() => {
        setMaxLength(Math.min(20, movies.length));
    }, [movies]);

    return (
        <>
            <ul className="w-dvw flex flex-wrap justify-center">
                {movies.slice(0, maxLength).map((movie: Movie) => (
                    <li
                        key={movie.id}
                        className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[13%] m-2"
                    >
                        <MovieCard movie={movie} />
                    </li>
                ))}
            </ul>
            {maxLength < movies.length && (
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
            )}
        </>
    );
};

export default MovieList;
