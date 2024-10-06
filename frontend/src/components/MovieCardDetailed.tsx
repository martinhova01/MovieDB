import React, { useEffect, useState } from "react";
import mockMovies from "../mock/mock_movies.json";
import { Movie, Status } from "../types/movieTypes";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../shadcn/components/ui/card";
import { Button } from "../shadcn/components/ui/button";

interface MovieCardDetailedProps {
    movieId: number;
}

const MovieCardDetailed: React.FC<MovieCardDetailedProps> = ({ movieId }) => {
    const [movie, setMovie] = useState<Movie | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (movieId) {
            const foundMovie = mockMovies.find(
                (movie: any) => movie.id === movieId
            );

            if (foundMovie) {
                const movieWithEnumStatusAndDate: Movie = {
                    ...foundMovie,
                    status: foundMovie.status as Status,
                    release_date: new Date(foundMovie.release_date),
                    homepage: foundMovie.homepage || undefined,
                };
                setMovie(movieWithEnumStatusAndDate);
            } else {
                setError("Movie not found");
            }
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
            <div className="absolute inset-0 bg-black opacity-85" />
            <div className="relative z-10 flex flex-col md:flex-row">
                <div className="flex-shrink-0 md:w-96">
                    <img
                        src={`https://image.tmdb.org/t/p/original/${movie.poster_path}`}
                        className="w-full h-auto md:h-full object-cover"
                        alt={movie.title}
                    />
                </div>
                <CardContent className="text-white p-6 flex-grow">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-5xl font-bold">
                            {movie.title}
                        </CardTitle>
                        <p className="text-sm">
                            {releaseYear} • {runtimeHours}h {runtimeMinutes}m •{" "}
                            {movie.genres.map((genre) => genre.name).join(", ")}
                        </p>
                        <p className="text-xl">
                            <strong>
                                {movie.vote_average.toFixed(1)}
                                {"/10"}
                            </strong>
                            {" ("}
                            {movie.vote_count}
                            {")"}
                        </p>
                    </CardHeader>
                    <h2 className="text-gray-300 text-xl italic mb-2">
                        {movie.tagline}
                    </h2>
                    <p className="mb-4 text-lg">{movie.overview}</p>
                    <p>
                        <strong>Revenue:</strong> $
                        {movie.revenue.toLocaleString()}
                    </p>
                    <p className="mb-2">
                        <strong>Budget:</strong> $
                        {movie.budget.toLocaleString()}
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
                    <p className="mb-2">
                        <strong>Spoken Languages:</strong>{" "}
                        {movie.spoken_languages
                            .map((language) => language.name)
                            .join(", ")}
                    </p>
                    <p className="mb-4">
                        <strong>Original Language:</strong>{" "}
                        {movie.original_language}
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
                </CardContent>
            </div>
        </Card>
    );
};

export default MovieCardDetailed;
