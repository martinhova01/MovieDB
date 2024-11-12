import React from "react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "../shadcn/components/ui/card";
import { Button } from "../shadcn/components/ui/button";
import Ratings from "../shadcn/components/ui/rating";
import { getImageUrl, ImageType } from "@/utils/imageUrl/imageUrl";
import { Movie } from "@/types/__generated__/types";

interface MovieCardDetailedProps {
    movie: Movie;
}

const formatCurrency = (value: number) => {
    return value.toLocaleString("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: 0,
    });
};

const getMovieDetailsList = (movie: Movie) => [
    {
        label: "Status",
        value: movie.status,
    },
    {
        label: "Budget",
        value: movie.budget ? `${formatCurrency(movie.budget)}` : "N/A",
    },
    {
        label: "Revenue",
        value: movie.revenue ? `${formatCurrency(movie.revenue)}` : "N/A",
    },
    {
        label: "Production Companies",
        value: movie.production_companies.length
            ? movie.production_companies.join(", ")
            : "N/A",
    },
    {
        label: "Production Countries",
        value: movie.production_countries.length
            ? movie.production_countries.join(", ")
            : "N/A",
    },
    {
        label: "Spoken Languages",
        value: movie.spoken_languages.length
            ? movie.spoken_languages.join(", ")
            : "N/A",
    },
];

const MovieCardDetailed: React.FC<MovieCardDetailedProps> = ({ movie }) => {
    const releaseYear = movie.release_date.getFullYear();
    const runtimeHours = Math.floor(movie.runtime / 60);
    const runtimeMinutes = movie.runtime % 60;

    return (
        <Card
            className="relative m-4 overflow-hidden bg-cover bg-center shadow-lg"
            style={{
                backgroundImage: `url(${getImageUrl(ImageType.BACKDROP, movie.backdrop_path)})`,
            }}
            data-testid="detailedMovieCard"
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
                        {[
                            releaseYear,
                            `${runtimeHours}h ${runtimeMinutes}m`,
                            movie.genres.length
                                ? movie.genres.join(", ")
                                : null,
                        ]
                            .filter(Boolean)
                            .join(" • ")}
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
                    <figure className="mb-6 w-full max-w-72 flex-shrink-0 md:mb-0 md:mr-6">
                        <img
                            src={getImageUrl(
                                ImageType.POSTER,
                                movie.poster_path,
                                "w500"
                            )}
                            className="rounded-lg"
                            alt={`Poster of ${movie.title}`}
                            title={movie.title}
                        />
                    </figure>
                    <section className="flex-grow">
                        {movie.tagline && (
                            <p className="mb-2 text-xl italic text-gray-300">
                                {movie.tagline}
                            </p>
                        )}
                        <p className="mb-4 text-lg">{movie.overview}</p>
                        <ul className="mb-6 flex flex-col gap-2">
                            {getMovieDetailsList(movie).map((item, index) => (
                                <li key={index}>
                                    <strong>{item.label}: </strong>
                                    {item.value}
                                </li>
                            ))}
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
