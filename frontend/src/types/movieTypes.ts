interface MoviePoster {
    __typename?: "Movie";
    _id: number; // Unique identifier
    title: string; // Unique in combination with release_date
    vote_average: number;
    release_date: Date;
    runtime: number;
    poster_path?: string;
}

export type { MoviePoster };
