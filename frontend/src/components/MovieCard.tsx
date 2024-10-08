import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { Movie } from "@/types/movieTypes";

const MovieCard = ({ movie }: { movie: Movie }) => {
    return (
        <Card className="w-[45%] sm:w-[30%] md:w-[22%] lg:w-[18%] xl:w-[13%] shadow-lg hover:shadow-slate-600 hover:cursor-pointer m-2">
            <CardHeader className="p-2">
                <img
                    className="w-full"
                    src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                    alt={movie.title}
                />
            </CardHeader>
            <CardContent className="p-2">
                <CardDescription className="text-center">
                    {movie.release_date.getFullYear()} •{" "}
                    {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
                </CardDescription>
                <Ratings
                    className="flex justify-around"
                    value={movie.vote_average / 2}
                    variant="yellow"
                    totalstars={5}
                />
            </CardContent>
        </Card>
    );
};

export default MovieCard;
