import React from "react";
import { Movie } from "../types/movieTypes";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../shadcn/components/ui/card";
import { Button } from "../shadcn/components/ui/button";
import Ratings from "../shadcn/components/ui/rating";

interface MovieCardDetailedProps {
    movie: Movie;
}

const MovieCardDetailed: React.FC<MovieCardDetailedProps> = ({ movie }) => {
    const releaseYear = movie.release_date.getFullYear();
    const runtimeHours = Math.floor(movie.runtime / 60);
    const runtimeMinutes = movie.runtime % 60;

    return (
        <Card
            className="relative m-4 overflow-hidden bg-cover bg-center shadow-lg"
            style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
            }}
        >
            {movie.backdrop_path && (
                <div className="absolute inset-0 bg-black opacity-85" />
            )}
            <CardContent className="relative h-full p-6 text-white">
                <CardHeader className="mb-4 p-0">
                    <CardTitle className="text-5xl font-bold">
                        {movie.title}
                    </CardTitle>
                    <p className="text-sm">
                        {releaseYear} • {runtimeHours}h {runtimeMinutes}m •{" "}
                        {movie.genres.join(", ")}
                    </p>
                    <Ratings
                        value={movie.vote_average / 2}
                        size={24}
                        variant="yellow"
                        totalstars={5}
                        title={String((movie.vote_average / 2).toFixed(2))}
                    />
                </CardHeader>

                <section className="flex h-full flex-col md:flex-row">
                    {movie.poster_path && (
                        <figure className="mb-6 w-full max-w-72 flex-shrink-0 md:mb-0 md:mr-6">
                            <img
                                src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                                className="rounded-lg"
                                alt={`Poster of ${movie.title}`}
                            />
                        </figure>
                    )}
                    <section className="flex-grow">
                        {movie.tagline && (
                            <p className="mb-2 text-xl italic text-gray-300">
                                {movie.tagline}
                            </p>
                        )}
                        <p className="mb-4 text-lg">{movie.overview}</p>
                        <ul className="mb-6 flex flex-col gap-2">
                            <li>
                                <strong>Revenue:</strong> $
                                {movie.revenue.toLocaleString()}
                            </li>
                            <li>
                                <strong>Budget:</strong> $
                                {movie.budget?.toLocaleString() ?? "N/A"}
                            </li>
                            <li>
                                <strong>Production Companies:</strong>{" "}
                                {movie.production_companies.join(", ")}
                            </li>
                            <li>
                                <strong>Production Countries:</strong>{" "}
                                {movie.production_countries.join(", ")}
                            </li>
                            <li>
                                <strong>Spoken Languages:</strong>{" "}
                                {movie.spoken_languages.join(", ")}
                            </li>
                        </ul>
                        {movie.homepage && (
                            <Button asChild>
                                <a
                                    href={movie.homepage}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    Visit Homepage
                                </a>
                            </Button>
                        )}
                    </section>
                </section>
            </CardContent>
        </Card>
    );
};

export default MovieCardDetailed;
