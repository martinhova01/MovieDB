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
    adult: Boolean!
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
  }

  type Query {
    movie(id: Int): Movie
    movies(skip: Int, limit: Int): [Movie!]!
  }
`;
