interface IdName {
    id: number;
    name: string;
}

type Genre = IdName;
type Keyword = IdName;
type Language = IdName;
type ProductionCompany = IdName;
type ProductionCountry = IdName;

enum Status {
    Released = "Released",
    InProduction = "In Production",
    PostProduction = "Post Production",
    Planned = "Planned",
    Rumored = "Rumored",
    Canceled = "Canceled",
}

interface Movie {
    id: number; // Unique identifier
    title: string; // Unique in combination with release_date
    vote_average: number;
    vote_count: number;
    status: Status;
    release_date: Date;
    revenue: number;
    runtime: number;
    adult: boolean;
    backdrop_path: string | undefined;
    budget: number;
    homepage: string | undefined;
    imdb_id: number | undefined;
    original_language: Language;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | undefined;
    tagline: string | undefined;
    genres: Genre[];
    production_companies: ProductionCompany[];
    production_countries: ProductionCountry[];
    spoken_languages: Language[];
    keywords: Keyword[];
}

export { Status };
export type {
    Genre,
    Keyword,
    Language,
    ProductionCompany,
    ProductionCountry,
    Movie,
};
