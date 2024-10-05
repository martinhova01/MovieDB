/* eslint-disable @typescript-eslint/no-empty-object-type */

// We disable the eslint rule above because we want to use empty interfaces to
// differentiate between different types even though they have the same structure

interface IdName {
    id: number;
    name: string;
}

interface Genre extends IdName {}
interface Keyword extends IdName {}
interface Language extends IdName {}
interface ProductionCompany extends IdName {}
interface ProductionCountry extends IdName {}

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
    imdb_id: string | undefined;
    original_language: string;
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
