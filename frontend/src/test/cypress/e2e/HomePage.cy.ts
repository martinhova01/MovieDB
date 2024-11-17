import { aliasQuery } from "../utils/graphql-test-utils";
import { MoviePoster } from "../../../types/movieTypes";
import { seedDatabase } from "../utils/seedDatabase";

describe(
    "Homepage - filtering, sorting and search",
    {
        env: {
            mongodb: {
                uri: "mongodb://127.0.0.1:28017/",
                database: "test",
            },
        },
    },
    () => {
        /**
         * Checks whether rendered posters correspond to recieved data (ordering etc.)
         *
         * As the API tests checks for correct filtering/sorting/searching, we don't
         * need to check this again here
         *
         * @param responseMovies movies from query response
         */
        const checkMoviePosters = (responseMovies: MoviePoster[]) => {
            cy.get('a[href*="movie"] img').then(($posters) => {
                const movieTitles = Cypress._.map($posters, "title");
                expect(movieTitles).to.deep.equal(
                    responseMovies.map((movie) => movie.title)
                );
            });
        };

        beforeEach(() => {
            seedDatabase();
        });

        it("searches correctly", () => {
            cy.intercept("POST", "http://localhost:3001/", (req) => {
                aliasQuery(req, "GetMovies");
                aliasQuery(req, "GetMovie");
            });
            cy.visit("/");

            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get('a[href*="movie"]').should("have.length", 20);
            cy.get("#searchbar").type("blue beet");

            cy.wait("@gqlGetMoviesQuery");

            cy.get('a[href*="movie"] img').then(($posters) => {
                const movieTitles = Cypress._.map($posters, "title");
                expect(movieTitles).to.have.length(1);
            });

            cy.get("#searchbar").clear();
            cy.get('a[href*="movie"]').should("have.length", 20);
        });

        it("sorts correctly", () => {
            cy.intercept("POST", "http://localhost:3001/", (req) => {
                aliasQuery(req, "GetMovies");
            });

            cy.visit("/");

            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get("button").contains("Sort & Filter").click();
            cy.get("button").contains("Sort by").click();
            cy.get("label").contains("Best rated").click();

            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });

            cy.get("label").contains("Newest first").click();

            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });
        });

        it("filters correctly", () => {
            cy.intercept("POST", "http://localhost:3001/", (req) => {
                aliasQuery(req, "GetMovies");
            });

            cy.visit("/");

            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get("button").contains("Sort & Filter").click();

            cy.get("button").contains("Rating").click();
            cy.get("label").contains("3").click();
            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });

            cy.get("button").contains("Decade").click();
            cy.get("label").contains("2010s").click();
            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });
        });

        it("handles filtering, sorting and search combined", () => {
            cy.intercept("POST", "http://localhost:3001/", (req) => {
                aliasQuery(req, "GetMovies");
            });

            cy.visit("/");

            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get("button").contains("Sort & Filter").click();
            cy.get("button").contains("Sort by").click();
            cy.get("label").contains("Best rated").click();

            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });

            cy.get("button").contains("Genre").click();
            cy.get("label").contains("Adventure").click();
            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });

            cy.get("button").contains("Runtime").click();
            cy.get("label").contains("1 - 2 hours").click();
            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });

            cy.contains("Close").click();
            cy.get("#searchbar").type("mario");
            cy.wait("@gqlGetMoviesQuery").then(({ response }) => {
                checkMoviePosters(response.body.data.movies as MoviePoster[]);
            });
        });
    }
);
