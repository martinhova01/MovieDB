import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/shadcn/components/ui/card";
import Ratings from "@/shadcn/components/ui/rating";
import { MoviePoster } from "@/types/movieTypes";
import { getImageUrl, ImageType } from "@/utils/imageUrl/imageUrl";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }: { movie: MoviePoster }) => {
    return (
        <Link to={`/movie/${movie._id}`}>
            <Card className="m-0 shadow-lg hover:cursor-pointer hover:shadow-slate-600">
                <CardHeader className="p-2">
                    <img
                        className="w-full"
                        src={getImageUrl(
                            ImageType.POSTER,
                            movie.poster_path,
                            "w342"
                        )}
                        alt={movie.title}
                        title={movie.title}
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
