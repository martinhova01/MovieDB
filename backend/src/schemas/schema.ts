export const typeDefs = `#graphql
  # Date is defined in resolvers.ts
  scalar Date

  type Movie {
    _id: Int!
    title: String!
    vote_average: Float!
    vote_count: Int!
    status: String!
    release_date: Date!
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
    date: Date!
  }

  input MovieFilters {
    genre: [String!]!
    rating: [String!]!
    releaseYear: [String!]!
    language: [String!]!
    status: [String!]!
    runtime: [String!]!
  }

  input MovieFilters {
    genre: [String!]!
    rating: [String!]!
    releaseYear: [String!]!
    language: [String!]!
    status: [String!]!
    runtime: [String!]!
  }

  type Query {
    movie(id: Int!): Movie
    movies(skip: Int, limit: Int, filters: MovieFilters): [Movie!]!
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
