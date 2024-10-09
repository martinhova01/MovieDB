import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { Movie } from "@/types/movieTypes";
import { useNavigate } from "react-router-dom";

const MovieCard = ({ movie }: { movie: Movie }) => {
    const navigate = useNavigate();
    const handleClick = () => {
        navigate(`/movie/${movie.id}`);
    };

    return (
        <Card
            className="shadow-lg hover:shadow-slate-600 hover:cursor-pointer m-0"
            onClick={handleClick}
        >
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
