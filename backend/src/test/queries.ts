export const GET_MOVIES = `
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
`;

export const GET_MOVIE = `
    query GetMovie($movieId: Int!) {
        movie(id: $movieId) {
            _id
            title
            genres
            reviews {
                _id
                username
                rating
                comment
                date
            }
        }
    }
`;

export const GET_FILTERS = `
    query GetFilters(
        $appliedFilters: FiltersInput
        $search: String
    ) {
        filters(
            appliedFilters: $appliedFilters
            search: $search
        ) {
            Genre {
                name
                hits
            }
            Rating {
                name
                hits
            }
            Decade {
                name
                hits
            }
            Status {
                name
                hits
            }
            Runtime {
                name
                hits
            }
        }
    }
`;

export const GET_LATEST_REVIEWS = `
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
`;

export const GET_USER_REVIEWS = `
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
`;

export const ADD_REVIEW = `
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
            movie {
                _id
                title
                vote_average
                vote_count
            }
            username
            rating
            comment
            date
        }
    }
`;

export const DELETE_REVIEW = `
    mutation DeleteReview($id: ID!) {
        deleteReview(_id: $id) {
            _id
            movie {
                _id
                title
                vote_average
                vote_count
            }
            username
            rating
            comment
            date
        }
    }
`;
