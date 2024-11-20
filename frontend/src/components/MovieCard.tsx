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
    const runtimeHours = Math.floor(movie.runtime / 60);
    const runtimeMinutes = movie.runtime % 60;
    return (
        <Link to={`/movie/${movie._id}`}>
            <Card className="m-0 shadow-lg hover:cursor-pointer hover:shadow-slate-600">
                <CardHeader className="aspect-[2/3] p-2">
                    <img
                        className="h-full object-scale-down object-top"
                        src={getImageUrl(
                            ImageType.POSTER,
                            movie.poster_path,
                            "w342"
                        )}
                        alt={movie.title}
                        title={movie.title}
                    />
                </CardHeader>
                <CardContent className="px-2 pb-2">
                    <CardDescription className="text-center">
                        <time
                            dateTime={movie.release_date
                                .getFullYear()
                                .toString()}
                        >
                            {movie.release_date.getFullYear()}
                        </time>
                        {" • "}
                        <time dateTime={`PT${runtimeHours}H${runtimeMinutes}M`}>
                            {runtimeHours}h {runtimeMinutes}m
                        </time>
                    </CardDescription>
                    <Ratings
                        className="flex justify-around"
                        value={movie.vote_average / 2}
                        variant="yellow"
                        totalstars={5}
                        title={String((movie.vote_average / 2).toFixed(2))}
                    />
                </CardContent>
            </Card>
        </Link>
    );
};

export default MovieCard;
