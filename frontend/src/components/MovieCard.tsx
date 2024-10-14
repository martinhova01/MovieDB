import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { Movie } from "@/types/movieTypes";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }: { movie: Movie }) => {
    return (
        <Link to={`/movie/${movie._id}`}>
            <Card className="shadow-lg hover:shadow-slate-600 hover:cursor-pointer m-0">
                <CardHeader className="p-2">
                    <img
                        className="w-full"
                        src={
                            "https://image.tmdb.org/t/p/w500" +
                            movie.poster_path
                        }
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
        </Link>
    );
};

export default MovieCard;
