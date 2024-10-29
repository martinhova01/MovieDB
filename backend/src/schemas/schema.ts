export const typeDefs = `#graphql
  scalar DateTime

  type Movie {
    _id: Int!
    title: String!
    vote_average: Float!
    vote_count: Int!
    status: String!
    release_date: DateTime!
    revenue: Float!
    runtime: Int!
    backdrop_path: String
    budget: Int!
    homepage: String
    imdb_id: String
    original_language: String!
    original_title: String!
    overview: String!
    popularity: Float!
    poster_path: String
    tagline: String
    genres: [String!]!
    production_companies: [String!]!
    production_countries: [String!]!
    spoken_languages: [String!]!
    keywords: [String!]!
    reviews: [Review!]!
  }

  type Review {
    _id: ID!
    movie: Movie!
    username: String!
    rating: Int!
    comment: String!
    date: DateTime!
  }

  type Filters {
    Genre: [String!]!
    Rating: [String!]!
    Decade: [String!]!
    Status: [String!]!
    Runtime: [String!]!
  }

  input FiltersInput {
    Genre: [String!]!
    Rating: [String!]!
    Decade: [String!]!
    Status: [String!]!
    Runtime: [String!]!
  }

  enum SortingType {
    NEWEST_FIRST
    OLDEST_FIRST
    BEST_RATED
    WORST_RATED
    LONGEST_RUNTIME
    SHORTEST_RUNTIME
  }

  type Query {
    movie(id: Int!): Movie
    movies(skip: Int, limit: Int, filters: FiltersInput, sortOption: SortingType, search: String): [Movie!]!
    filters: Filters!
    latestReviews(skip: Int, limit: Int): [Review!]!
    userReviews(username: String!, skip: Int, limit: Int): [Review!]!
  }

  type Mutation {
    addReview(
      movie_id: Int!
      username: String!
      rating: Int!
      comment: String!
    ): Movie!
    deleteReview(_id: ID!): Movie!
  }
`;
