export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  Date: { input: any; output: any; }
};

export type Movie = {
  _id: Scalars['Int']['output'];
  title: Scalars['String']['output'];
  vote_average: Scalars['Float']['output'];
  vote_count: Scalars['Int']['output'];
  status: Scalars['String']['output'];
  release_date: Scalars['Date']['output'];
  revenue: Scalars['Float']['output'];
  runtime: Scalars['Int']['output'];
  backdrop_path?: Maybe<Scalars['String']['output']>;
  budget: Scalars['Int']['output'];
  homepage?: Maybe<Scalars['String']['output']>;
  imdb_id?: Maybe<Scalars['String']['output']>;
  original_language: Scalars['String']['output'];
  original_title: Scalars['String']['output'];
  overview: Scalars['String']['output'];
  popularity: Scalars['Float']['output'];
  poster_path?: Maybe<Scalars['String']['output']>;
  tagline?: Maybe<Scalars['String']['output']>;
  genres: Array<Scalars['String']['output']>;
  production_companies: Array<Scalars['String']['output']>;
  production_countries: Array<Scalars['String']['output']>;
  spoken_languages: Array<Scalars['String']['output']>;
  keywords: Array<Scalars['String']['output']>;
};

export type Filters = {
  Genre: Array<Scalars['String']['output']>;
  Rating: Array<Scalars['String']['output']>;
  Decade: Array<Scalars['String']['output']>;
  Status: Array<Scalars['String']['output']>;
  Runtime: Array<Scalars['String']['output']>;
};

export type FiltersInput = {
  Genre: Array<Scalars['String']['input']>;
  Rating: Array<Scalars['String']['input']>;
  Decade: Array<Scalars['String']['input']>;
  Status: Array<Scalars['String']['input']>;
  Runtime: Array<Scalars['String']['input']>;
};

export enum SortingType {
  NewestFirst = 'NEWEST_FIRST',
  OldestFirst = 'OLDEST_FIRST',
  BestRated = 'BEST_RATED',
  WorstRated = 'WORST_RATED',
  LongestRuntime = 'LONGEST_RUNTIME',
  ShortestRuntime = 'SHORTEST_RUNTIME'
}

export type Query = {
  movie?: Maybe<Movie>;
  movies: Array<Movie>;
  filters?: Maybe<Filters>;
};


export type QueryMovieArgs = {
  id: Scalars['Int']['input'];
};


export type QueryMoviesArgs = {
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<FiltersInput>;
  sortOption?: InputMaybe<SortingType>;
  search?: InputMaybe<Scalars['String']['input']>;
};

export type GetMovieQueryVariables = Exact<{
  movieId: Scalars['Int']['input'];
}>;


export type GetMovieQuery = { __typename?: 'Query', movie?: { __typename?: 'Movie', _id: number, title: string, vote_average: number, vote_count: number, status: string, release_date: any, revenue: number, runtime: number, backdrop_path?: string | null, budget: number, homepage?: string | null, imdb_id?: string | null, original_language: string, original_title: string, overview: string, popularity: number, poster_path?: string | null, tagline?: string | null, genres: Array<string>, production_companies: Array<string>, production_countries: Array<string>, spoken_languages: Array<string>, keywords: Array<string> } | null };

export type GetMoviesQueryVariables = Exact<{
  skip?: InputMaybe<Scalars['Int']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  filters?: InputMaybe<FiltersInput>;
  sortOption?: InputMaybe<SortingType>;
  search?: InputMaybe<Scalars['String']['input']>;
}>;


export type GetMoviesQuery = { __typename?: 'Query', movies: Array<{ __typename?: 'Movie', _id: number, title: string, vote_average: number, release_date: any, runtime: number, poster_path?: string | null }> };

export type GetFiltersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetFiltersQuery = { __typename?: 'Query', filters?: { __typename?: 'Filters', Genre: Array<string>, Rating: Array<string>, Decade: Array<string>, Status: Array<string>, Runtime: Array<string> } | null };
