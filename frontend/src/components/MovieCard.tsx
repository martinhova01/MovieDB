import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { Movie } from "@/types/movieTypes";

const MovieCard = ({ movie }: { movie: Movie }) => {
    return (
        <Card className="shadow-lg hover:shadow-slate-600 hover:cursor-pointer m-2">
            <CardHeader className="p-4 max-w-60">
                <CardTitle className="text-xl font-bold text-center h-14 overflow-hidden">
                    {movie.title}
                </CardTitle>
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
            </CardHeader>

            <CardContent className="p-2">
                <img
                    className="w-60"
                    src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                    alt={"poster - " + movie.title}
                />
            </CardContent>
        </Card>
    );
};

export default MovieCard;
