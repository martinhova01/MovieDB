import { MoviePoster } from "@/types/movieTypes";
import MovieCard from "./MovieCard";
import { Button } from "@/shadcn/components/ui/button";

const MovieList = ({
    movies,
    loadMore,
}: {
    movies: MoviePoster[];
    loadMore: () => void;
}) => {
    return (
        <>
            {movies.length === 0 ? (
                <section className="text-center">
                    <h1 className="text-2xl">No movies found</h1>
                    <p className="text-primary">Please refine your search</p>
                </section>
            ) : (
                <ul className="flex flex-wrap justify-center">
                    {movies.map((movie: MoviePoster) => (
                        <li
                            key={movie._id}
                            className="m-2 w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[13%]"
                        >
                            <MovieCard movie={movie} />
                        </li>
                    ))}
                </ul>
            )}
            <div className="flex justify-center">
                <Button size="lg" className="m-10" onClick={loadMore}>
                    Load More
                </Button>
            </div>
        </>
    );
};

export default MovieList;
