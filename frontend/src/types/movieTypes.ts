interface MoviePoster {
    __typename?: "Movie";
    _id: number; // Unique identifier
    title: string; // Unique in combination with release_date
    vote_average: number;
    release_date: Date;
    runtime: number;
    poster_path?: string;
}

interface Review {
    _id: number;
    movie: number;
    username: string;
    rating: number;
    comment: string;
    date: Date;
}

export type { MoviePoster, Review };
