export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = {
    [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]?: Maybe<T[SubKey]>;
};
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & {
    [SubKey in K]: Maybe<T[SubKey]>;
};
export type MakeEmpty<
    T extends { [key: string]: unknown },
    K extends keyof T,
> = { [_ in K]?: never };
export type Incremental<T> =
    | T
    | {
          [P in keyof T]?: P extends " $fragmentName" | "__typename"
              ? T[P]
              : never;
      };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
    ID: { input: string; output: string };
    String: { input: string; output: string };
    Boolean: { input: boolean; output: boolean };
    Int: { input: number; output: number };
    Float: { input: number; output: number };
    DateTime: { input: Date; output: Date };
};

export type Movie = {
    __typename?: "Movie";
    _id: Scalars["Int"]["output"];
    title: Scalars["String"]["output"];
    vote_average: Scalars["Float"]["output"];
    vote_count: Scalars["Int"]["output"];
    status: Scalars["String"]["output"];
    release_date: Scalars["DateTime"]["output"];
    revenue: Scalars["Float"]["output"];
    runtime: Scalars["Int"]["output"];
    backdrop_path?: Maybe<Scalars["String"]["output"]>;
    budget: Scalars["Int"]["output"];
    homepage?: Maybe<Scalars["String"]["output"]>;
    imdb_id?: Maybe<Scalars["String"]["output"]>;
    original_language: Scalars["String"]["output"];
    original_title: Scalars["String"]["output"];
    overview: Scalars["String"]["output"];
    popularity: Scalars["Float"]["output"];
    poster_path?: Maybe<Scalars["String"]["output"]>;
    tagline?: Maybe<Scalars["String"]["output"]>;
    genres: Array<Scalars["String"]["output"]>;
    production_companies: Array<Scalars["String"]["output"]>;
    production_countries: Array<Scalars["String"]["output"]>;
    spoken_languages: Array<Scalars["String"]["output"]>;
    keywords: Array<Scalars["String"]["output"]>;
    reviews: Array<Review>;
};

export type Review = {
    __typename?: "Review";
    _id: Scalars["ID"]["output"];
    movie: Movie;
    username: Scalars["String"]["output"];
    rating: Scalars["Int"]["output"];
    comment: Scalars["String"]["output"];
    date: Scalars["DateTime"]["output"];
};

export type Filters = {
    __typename?: "Filters";
    Genre: Array<Scalars["String"]["output"]>;
    Rating: Array<Scalars["String"]["output"]>;
    Decade: Array<Scalars["String"]["output"]>;
    Status: Array<Scalars["String"]["output"]>;
    Runtime: Array<Scalars["String"]["output"]>;
};

export type FiltersInput = {
    Genre: Array<Scalars["String"]["input"]>;
    Rating: Array<Scalars["String"]["input"]>;
    Decade: Array<Scalars["String"]["input"]>;
    Status: Array<Scalars["String"]["input"]>;
    Runtime: Array<Scalars["String"]["input"]>;
};

export enum SortingType {
    MOST_POPULAR = "MOST_POPULAR",
    NEWEST_FIRST = "NEWEST_FIRST",
    OLDEST_FIRST = "OLDEST_FIRST",
    BEST_RATED = "BEST_RATED",
    WORST_RATED = "WORST_RATED",
    LONGEST_RUNTIME = "LONGEST_RUNTIME",
    SHORTEST_RUNTIME = "SHORTEST_RUNTIME",
}

export type Query = {
    __typename?: "Query";
    movie?: Maybe<Movie>;
    movies: Array<Movie>;
    filters: Filters;
    latestReviews: Array<Review>;
    userReviews: Array<Review>;
};

export type QuerymovieArgs = {
    id: Scalars["Int"]["input"];
};

export type QuerymoviesArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    filters?: InputMaybe<FiltersInput>;
    sortOption?: InputMaybe<SortingType>;
    search?: InputMaybe<Scalars["String"]["input"]>;
};

export type QuerylatestReviewsArgs = {
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type QueryuserReviewsArgs = {
    username: Scalars["String"]["input"];
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
};

export type Mutation = {
    __typename?: "Mutation";
    addReview: Movie;
    deleteReview: Movie;
};

export type MutationaddReviewArgs = {
    movie_id: Scalars["Int"]["input"];
    username: Scalars["String"]["input"];
    rating: Scalars["Int"]["input"];
    comment: Scalars["String"]["input"];
};

export type MutationdeleteReviewArgs = {
    _id: Scalars["ID"]["input"];
};

export type GetMoviesQueryVariables = Exact<{
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
    filters?: InputMaybe<FiltersInput>;
    sortOption?: InputMaybe<SortingType>;
    search?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetMoviesQuery = {
    __typename?: "Query";
    movies: Array<{
        __typename?: "Movie";
        _id: number;
        title: string;
        vote_average: number;
        release_date: Date;
        runtime: number;
        poster_path?: string | null;
    }>;
};

export type GetMovieQueryVariables = Exact<{
    movieId: Scalars["Int"]["input"];
}>;

export type GetMovieQuery = {
    __typename?: "Query";
    movie?: {
        __typename?: "Movie";
        _id: number;
        title: string;
        vote_average: number;
        vote_count: number;
        status: string;
        release_date: Date;
        revenue: number;
        runtime: number;
        backdrop_path?: string | null;
        budget: number;
        homepage?: string | null;
        imdb_id?: string | null;
        original_language: string;
        original_title: string;
        overview: string;
        popularity: number;
        poster_path?: string | null;
        tagline?: string | null;
        genres: Array<string>;
        production_companies: Array<string>;
        production_countries: Array<string>;
        spoken_languages: Array<string>;
        keywords: Array<string>;
        reviews: Array<{
            __typename?: "Review";
            _id: string;
            username: string;
            rating: number;
            comment: string;
            date: Date;
        }>;
    } | null;
};

export type GetFiltersQueryVariables = Exact<{ [key: string]: never }>;

export type GetFiltersQuery = {
    __typename?: "Query";
    filters: {
        __typename?: "Filters";
        Genre: Array<string>;
        Rating: Array<string>;
        Decade: Array<string>;
        Status: Array<string>;
        Runtime: Array<string>;
    };
};

export type AddReviewMutationVariables = Exact<{
    movieId: Scalars["Int"]["input"];
    username: Scalars["String"]["input"];
    rating: Scalars["Int"]["input"];
    comment: Scalars["String"]["input"];
}>;

export type AddReviewMutation = {
    __typename?: "Mutation";
    addReview: {
        __typename?: "Movie";
        reviews: Array<{
            __typename?: "Review";
            _id: string;
            username: string;
            rating: number;
            comment: string;
            date: Date;
        }>;
    };
};
