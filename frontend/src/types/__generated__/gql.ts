/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 * Learn more about it here: https://the-guild.dev/graphql/codegen/plugins/presets/preset-client#reducing-bundle-size
 */
const documents = {
    "\n    query GetMovies(\n        $skip: Int\n        $limit: Int\n        $filters: FiltersInput\n        $sortOption: SortingType\n        $search: String\n    ) {\n        movies(\n            skip: $skip\n            limit: $limit\n            filters: $filters\n            sortOption: $sortOption\n            search: $search\n        ) {\n            _id\n            title\n            vote_average\n            release_date\n            runtime\n            poster_path\n        }\n    }\n":
        types.GetMoviesDocument,
    "\n    query GetMovie($movieId: Int!) {\n        movie(id: $movieId) {\n            _id\n            title\n            vote_average\n            vote_count\n            status\n            release_date\n            revenue\n            runtime\n            backdrop_path\n            budget\n            homepage\n            imdb_id\n            original_language\n            original_title\n            overview\n            popularity\n            poster_path\n            tagline\n            genres\n            production_companies\n            production_countries\n            spoken_languages\n            keywords\n            reviews {\n                _id\n                username\n                rating\n                comment\n                date\n            }\n        }\n    }\n":
        types.GetMovieDocument,
    "\n    query GetFilters {\n        filters {\n            Genre\n            Rating\n            Decade\n            Status\n            Runtime\n        }\n    }\n":
        types.GetFiltersDocument,
    "\n    mutation AddReview(\n        $movieId: Int!,\n        $username: String!,\n        $rating: Int!,\n        $comment: String!\n    ) {\n        addReview(\n            movie_id: $movieId,\n            username: $username,\n            rating: $rating,\n            comment: $comment\n        ) {\n            reviews {\n                _id\n                username\n                rating\n                comment\n                date\n            }\n        }\n    }\n":
        types.AddReviewDocument,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    query GetMovies(\n        $skip: Int\n        $limit: Int\n        $filters: FiltersInput\n        $sortOption: SortingType\n        $search: String\n    ) {\n        movies(\n            skip: $skip\n            limit: $limit\n            filters: $filters\n            sortOption: $sortOption\n            search: $search\n        ) {\n            _id\n            title\n            vote_average\n            release_date\n            runtime\n            poster_path\n        }\n    }\n"
): (typeof documents)["\n    query GetMovies(\n        $skip: Int\n        $limit: Int\n        $filters: FiltersInput\n        $sortOption: SortingType\n        $search: String\n    ) {\n        movies(\n            skip: $skip\n            limit: $limit\n            filters: $filters\n            sortOption: $sortOption\n            search: $search\n        ) {\n            _id\n            title\n            vote_average\n            release_date\n            runtime\n            poster_path\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    query GetMovie($movieId: Int!) {\n        movie(id: $movieId) {\n            _id\n            title\n            vote_average\n            vote_count\n            status\n            release_date\n            revenue\n            runtime\n            backdrop_path\n            budget\n            homepage\n            imdb_id\n            original_language\n            original_title\n            overview\n            popularity\n            poster_path\n            tagline\n            genres\n            production_companies\n            production_countries\n            spoken_languages\n            keywords\n            reviews {\n                _id\n                username\n                rating\n                comment\n                date\n            }\n        }\n    }\n"
): (typeof documents)["\n    query GetMovie($movieId: Int!) {\n        movie(id: $movieId) {\n            _id\n            title\n            vote_average\n            vote_count\n            status\n            release_date\n            revenue\n            runtime\n            backdrop_path\n            budget\n            homepage\n            imdb_id\n            original_language\n            original_title\n            overview\n            popularity\n            poster_path\n            tagline\n            genres\n            production_companies\n            production_countries\n            spoken_languages\n            keywords\n            reviews {\n                _id\n                username\n                rating\n                comment\n                date\n            }\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    query GetFilters {\n        filters {\n            Genre\n            Rating\n            Decade\n            Status\n            Runtime\n        }\n    }\n"
): (typeof documents)["\n    query GetFilters {\n        filters {\n            Genre\n            Rating\n            Decade\n            Status\n            Runtime\n        }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
    source: "\n    mutation AddReview(\n        $movieId: Int!,\n        $username: String!,\n        $rating: Int!,\n        $comment: String!\n    ) {\n        addReview(\n            movie_id: $movieId,\n            username: $username,\n            rating: $rating,\n            comment: $comment\n        ) {\n            reviews {\n                _id\n                username\n                rating\n                comment\n                date\n            }\n        }\n    }\n"
): (typeof documents)["\n    mutation AddReview(\n        $movieId: Int!,\n        $username: String!,\n        $rating: Int!,\n        $comment: String!\n    ) {\n        addReview(\n            movie_id: $movieId,\n            username: $username,\n            rating: $rating,\n            comment: $comment\n        ) {\n            reviews {\n                _id\n                username\n                rating\n                comment\n                date\n            }\n        }\n    }\n"];

export function gql(source: string) {
    return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
    TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
