import React, { useEffect, useState } from "react";
import { all_movies } from "../mock/util";
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
    movieId: number;
}

const MovieCardDetailed: React.FC<MovieCardDetailedProps> = ({ movieId }) => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const foundMovie = all_movies.find(
            (movie: any) => movie.id === movieId
        );

        if (foundMovie) {
            setMovie(foundMovie);
        } else {
            setError("Movie not found");
        }
    }, [movieId]);

    if (error) return <div>{error}</div>;
    if (!movie) return <div>Loading...</div>;

    const releaseYear = movie.release_date.getFullYear();
    const runtimeHours = Math.floor(movie.runtime / 60);
    const runtimeMinutes = movie.runtime % 60;

    return (
        <Card
            className="m-4 shadow-lg bg-cover bg-center relative overflow-hidden"
            style={{
                backgroundImage: `url(https://image.tmdb.org/t/p/original/${movie.backdrop_path})`,
            }}
        >
            {movie.backdrop_path && (
                <div className="absolute inset-0 bg-black opacity-85" />
            )}
            <CardContent className="text-white p-6 h-full relative">
                <CardHeader className="mb-4 p-0">
                    <CardTitle className="text-5xl font-bold">
                        {movie.title}
                    </CardTitle>
                    <p className="text-sm">
                        {releaseYear} • {runtimeHours}h {runtimeMinutes}m •{" "}
                        {movie.genres.map((genre) => genre.name).join(", ")}
                    </p>
                    <Ratings
                        value={movie.vote_average / 2}
                        size={24}
                        variant="yellow"
                        totalstars={5}
                    />
                </CardHeader>

                <section className="flex flex-col md:flex-row h-full">
                    {movie.poster_path && (
                        <figure className="flex-shrink-0 w-72 mb-6 md:mb-0 md:mr-6">
                            <img
                                src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                                className="w-full h-full object-contain rounded-lg"
                                alt={`Poster of ${movie.title}`}
                            />
                        </figure>
                    )}
                    <section className="flex-grow">
                        {movie.tagline && (
                            <p className="text-gray-300 text-xl italic mb-2">
                                {movie.tagline}
                            </p>
                        )}
                        <p className="mb-4 text-lg">{movie.overview}</p>
                        <p>
                            <strong>Revenue:</strong> $
                            {movie.revenue.toLocaleString()}
                        </p>
                        <p className="mb-2">
                            <strong>Budget:</strong> $
                            {movie.budget?.toLocaleString() ?? "N/A"}
                        </p>
                        <p className="mb-2">
                            <strong>Production Companies:</strong>{" "}
                            {movie.production_companies
                                .map((company) => company.name)
                                .join(", ")}
                        </p>
                        <p className="mb-2">
                            <strong>Production Countries:</strong>{" "}
                            {movie.production_countries
                                .map((country) => country.name)
                                .join(", ")}
                        </p>
                        <p className="mb-8">
                            <strong>Spoken Languages:</strong>{" "}
                            {movie.spoken_languages
                                .map((language) => language.name)
                                .join(", ")}
                        </p>
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
