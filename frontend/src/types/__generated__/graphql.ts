import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";
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
    /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
    DateTime: { input: Date; output: Date };
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

export type GetFiltersQueryVariables = Exact<{
    appliedFilters?: InputMaybe<FiltersInput>;
    search?: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GetFiltersQuery = {
    __typename?: "Query";
    filters: {
        __typename?: "Filters";
        Genre: Array<{ __typename?: "Filter"; name: string; hits: number }>;
        Rating: Array<{ __typename?: "Filter"; name: string; hits: number }>;
        Decade: Array<{ __typename?: "Filter"; name: string; hits: number }>;
        Status: Array<{ __typename?: "Filter"; name: string; hits: number }>;
        Runtime: Array<{ __typename?: "Filter"; name: string; hits: number }>;
    };
};

export type GetLatestReviewsQueryVariables = Exact<{
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetLatestReviewsQuery = {
    __typename?: "Query";
    latestReviews: Array<{
        __typename?: "Review";
        _id: string;
        username: string;
        rating: number;
        comment: string;
        date: Date;
        movie: {
            __typename?: "Movie";
            _id: number;
            title: string;
            poster_path?: string | null;
        };
    }>;
};

export type GetUserReviewsQueryVariables = Exact<{
    username: Scalars["String"]["input"];
    skip?: InputMaybe<Scalars["Int"]["input"]>;
    limit?: InputMaybe<Scalars["Int"]["input"]>;
}>;

export type GetUserReviewsQuery = {
    __typename?: "Query";
    userReviews: Array<{
        __typename?: "Review";
        _id: string;
        rating: number;
        comment: string;
        date: Date;
        movie: {
            __typename?: "Movie";
            _id: number;
            title: string;
            poster_path?: string | null;
        };
    }>;
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
        __typename?: "Review";
        _id: string;
        username: string;
        rating: number;
        comment: string;
        date: Date;
        movie: {
            __typename?: "Movie";
            _id: number;
            vote_average: number;
            vote_count: number;
        };
    };
};

export type DeleteReviewMutationVariables = Exact<{
    id: Scalars["ID"]["input"];
}>;

export type DeleteReviewMutation = {
    __typename?: "Mutation";
    deleteReview: {
        __typename?: "Review";
        _id: string;
        username: string;
        rating: number;
        comment: string;
        date: Date;
        movie: {
            __typename?: "Movie";
            _id: number;
            vote_average: number;
            vote_count: number;
        };
    };
};

export const GetMoviesDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetMovies" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "skip" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "Int" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "limit" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "Int" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "filters" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "FiltersInput" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "sortOption" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "SortingType" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "search" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "String" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "movies" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "skip" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "skip" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "limit" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "limit" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "filters" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "filters" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "sortOption" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "sortOption" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "search" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "search" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "_id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "title" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "vote_average",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "release_date",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "runtime" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "poster_path",
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetMoviesQuery, GetMoviesQueryVariables>;
export const GetMovieDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetMovie" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "movieId" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Int" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "movie" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "movieId" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "_id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "title" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "vote_average",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "vote_count" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "status" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "release_date",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "revenue" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "runtime" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "backdrop_path",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "budget" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "homepage" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "imdb_id" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "original_language",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "original_title",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "overview" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "popularity" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "poster_path",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "tagline" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "genres" },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "production_companies",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "production_countries",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: {
                                        kind: "Name",
                                        value: "spoken_languages",
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "keywords" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "reviews" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "_id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "username",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "rating",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "comment",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "date",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetMovieQuery, GetMovieQueryVariables>;
export const GetFiltersDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetFilters" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "appliedFilters" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "FiltersInput" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "search" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "String" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "filters" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "appliedFilters" },
                                value: {
                                    kind: "Variable",
                                    name: {
                                        kind: "Name",
                                        value: "appliedFilters",
                                    },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "search" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "search" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "Genre" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "hits",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "Rating" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "hits",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "Decade" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "hits",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "Status" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "hits",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "Runtime" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "name",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "hits",
                                                },
                                            },
                                        ],
                                    },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetFiltersQuery, GetFiltersQueryVariables>;
export const GetLatestReviewsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetLatestReviews" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "skip" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "Int" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "limit" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "Int" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "latestReviews" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "skip" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "skip" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "limit" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "limit" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "_id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "movie" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "_id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "title",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "poster_path",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "rating" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "comment" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "date" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    GetLatestReviewsQuery,
    GetLatestReviewsQueryVariables
>;
export const GetUserReviewsDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "query",
            name: { kind: "Name", value: "GetUserReviews" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "username" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "skip" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "Int" },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "limit" },
                    },
                    type: {
                        kind: "NamedType",
                        name: { kind: "Name", value: "Int" },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "userReviews" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "username" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "username" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "skip" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "skip" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "limit" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "limit" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "_id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "movie" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "_id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "title",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "poster_path",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "rating" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "comment" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "date" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<GetUserReviewsQuery, GetUserReviewsQueryVariables>;
export const AddReviewDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "AddReview" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "movieId" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Int" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "username" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "rating" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "Int" },
                        },
                    },
                },
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "comment" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "String" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "addReview" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "movie_id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "movieId" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "username" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "username" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "rating" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "rating" },
                                },
                            },
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "comment" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "comment" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "_id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "movie" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "_id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "vote_average",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "vote_count",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "rating" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "comment" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "date" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<AddReviewMutation, AddReviewMutationVariables>;
export const DeleteReviewDocument = {
    kind: "Document",
    definitions: [
        {
            kind: "OperationDefinition",
            operation: "mutation",
            name: { kind: "Name", value: "DeleteReview" },
            variableDefinitions: [
                {
                    kind: "VariableDefinition",
                    variable: {
                        kind: "Variable",
                        name: { kind: "Name", value: "id" },
                    },
                    type: {
                        kind: "NonNullType",
                        type: {
                            kind: "NamedType",
                            name: { kind: "Name", value: "ID" },
                        },
                    },
                },
            ],
            selectionSet: {
                kind: "SelectionSet",
                selections: [
                    {
                        kind: "Field",
                        name: { kind: "Name", value: "deleteReview" },
                        arguments: [
                            {
                                kind: "Argument",
                                name: { kind: "Name", value: "_id" },
                                value: {
                                    kind: "Variable",
                                    name: { kind: "Name", value: "id" },
                                },
                            },
                        ],
                        selectionSet: {
                            kind: "SelectionSet",
                            selections: [
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "_id" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "movie" },
                                    selectionSet: {
                                        kind: "SelectionSet",
                                        selections: [
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "_id",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "vote_average",
                                                },
                                            },
                                            {
                                                kind: "Field",
                                                name: {
                                                    kind: "Name",
                                                    value: "vote_count",
                                                },
                                            },
                                        ],
                                    },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "username" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "rating" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "comment" },
                                },
                                {
                                    kind: "Field",
                                    name: { kind: "Name", value: "date" },
                                },
                            ],
                        },
                    },
                ],
            },
        },
    ],
} as unknown as DocumentNode<
    DeleteReviewMutation,
    DeleteReviewMutationVariables
>;
