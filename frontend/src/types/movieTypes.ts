enum Status {
    Released = "Released",
    InProduction = "In Production",
    PostProduction = "Post Production",
    Planned = "Planned",
    Rumored = "Rumored",
    Canceled = "Canceled",
}

interface Movie {
    _id: number; // Unique identifier
    title: string; // Unique in combination with release_date
    vote_average: number;
    vote_count: number;
    status: Status;
    release_date: Date;
    revenue: number;
    runtime: number;
    backdrop_path?: string;
    budget: number;
    homepage?: string;
    imdb_id?: string;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path?: string;
    tagline?: string;
    genres: string[];
    production_companies: string[];
    production_countries: string[];
    spoken_languages: string[];
    keywords: string[];
}

interface MoviePoster {
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

interface Filters {
    Genre: string[];
    Rating: string[];
    Decade: string[];
    Status: string[];
    Runtime: string[];
}

enum SortingType {
    NEWEST_FIRST = "Newest first",
    OLDEST_FIRST = "Oldest first",
    BEST_RATED = "Best rated",
    WORST_RATED = "Worst rated",
    LONGEST_RUNTIME = "Longest runtime",
    SHORTEST_RUNTIME = "Shortest runtime",
}

export { Status, SortingType };
export type { Movie, MoviePoster, Review, Filters };
