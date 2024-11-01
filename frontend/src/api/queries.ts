import { gql } from "@/types/__generated__";

export const GET_MOVIES = gql(`
    query GetMovies(
        $skip: Int
        $limit: Int
        $filters: FiltersInput
        $sortOption: SortingType
        $search: String
    ) {
        movies(
            skip: $skip
            limit: $limit
            filters: $filters
            sortOption: $sortOption
            search: $search
        ) {
            _id
            title
            vote_average
            release_date
            runtime
            poster_path
        }
    }
`);

export const GET_MOVIE = gql(`
    query GetMovie($movieId: Int!) {
        movie(id: $movieId) {
            _id
            title
            vote_average
            vote_count
            status
            release_date
            revenue
            runtime
            backdrop_path
            budget
            homepage
            imdb_id
            original_language
            original_title
            overview
            popularity
            poster_path
            tagline
            genres
            production_companies
            production_countries
            spoken_languages
            keywords
            reviews {
                _id
                username
                rating
                comment
                date
            }
        }
    }
`);

export const GET_FILTERS = gql(`
    query GetFilters {
        filters {
            Genre
            Rating
            Decade
            Status
            Runtime
        }
    }
`);

export const GET_LATEST_REVIEWS = gql(`
    query GetLatestReviews(
        $skip: Int,
        $limit: Int
    ) {
        latestReviews(
            skip: $skip,
            limit: $limit
        ) {
            _id
            movie {
                _id
                title
                poster_path
            }
            username
            rating
            comment
            date
        }
    }
`);

export const GET_USER_REVIEWS = gql(`
    query GetUserReviews(
        $username: String!,
        $skip: Int,
        $limit: Int
    ) {
        userReviews(
            username: $username,
            skip: $skip,
            limit: $limit
        ) {
            _id
            movie {
                _id
                title
                poster_path
            }
            rating
            comment
            date
        }
    }
`);

export const ADD_REVIEW = gql(`
    mutation AddReview(
        $movieId: Int!,
        $username: String!,
        $rating: Int!,
        $comment: String!
    ) {
        addReview(
            movie_id: $movieId,
            username: $username,
            rating: $rating,
            comment: $comment
        ) {
            _id
            vote_average
            vote_count
            reviews {
                _id
                username
                rating
                comment
                date
            }
        }
    }
`);

export const DELETE_REVIEW = gql(`
    mutation DeleteReview($id: ID!) {
        deleteReview(_id: $id) {
            _id
            vote_average
            vote_count
            reviews {
                _id
                username
                rating
                comment
                date
            }
        }
    }
`);
