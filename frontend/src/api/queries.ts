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
