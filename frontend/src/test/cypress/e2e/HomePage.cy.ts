import { aliasQuery } from "../utils/graphql-test-utils";
import { MoviePoster } from "../../../types/movieTypes";

describe("Homepage - filtering, sorting and search", () => {

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
            const movieTitles = Cypress._.map($posters, 'title');
            expect(movieTitles).to.deep.equal(responseMovies.map(movie => movie.title));
        });
    }

    it("searches correctly", () => {
        cy.intercept('POST', 'http://localhost:3001/', (req) => {
            aliasQuery(req, 'GetMovies')
            aliasQuery(req, 'GetMovie')
        });
        cy.visit("/");

        // Wait for the initial GetMovies query to complete
        cy.wait("@gqlGetMoviesQuery");

        cy.get('a[href*="movie"]').should("have.length", 20);
        cy.get("#searchbar").type("harry pot");

        cy.wait("@gqlGetMoviesQuery");

        cy.get('a[href*="movie"] img').then(($posters) => {
            const movieTitles = Cypress._.map($posters, 'title');
            expect(movieTitles).to.have.length(10);
        });

        cy.get("#searchbar").clear();
        cy.get('a[href*="movie"]').should("have.length", 20);
    });

    it("sorts correctly", () => {
        cy.intercept('POST', 'http://localhost:3001/', (req) => {
            aliasQuery(req, 'GetMovies')
        });

        cy.visit("/");

        // Wait for the initial GetMovies query to complete
        cy.wait('@gqlGetMoviesQuery');

        cy.get("button").contains("Sort & Filter").click();
        cy.get("button").contains("Sort by").click();
        cy.get("label").contains("Best rated").click();

        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])           
        });

        cy.get("label").contains("Newest first").click();

        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])  
        });
    });

    it("filters correctly", () => {
        cy.intercept('POST', 'http://localhost:3001/', (req) => {
            aliasQuery(req, 'GetMovies')
        });

        cy.visit("/");

        // Wait for the initial GetMovies query to complete
        cy.wait('@gqlGetMoviesQuery');

        cy.get("button").contains("Sort & Filter").click();
        cy.get("button").contains("Decade").click();
        cy.get("label").contains("2000s").click();

        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])  
        });

        cy.get("button").contains("Runtime").click();
        cy.get("label").contains("Less than 1 hour").click();
        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])  
        });
    });

    it("handles filtering, sorting and search combined", () => {
        cy.intercept('POST', 'http://localhost:3001/', (req) => {
            aliasQuery(req, 'GetMovies')
        });

        cy.visit("/");

        // Wait for the initial GetMovies query to complete
        cy.wait('@gqlGetMoviesQuery');

        cy.get("#searchbar").type("batman");
        cy.wait("@gqlGetMoviesQuery");

        cy.get("button").contains("Sort & Filter").click();
        cy.get("button").contains("Sort by").click();
        cy.get("label").contains("Best rated").click();

        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])           
        });

        cy.get("button").contains("Genre").click();
        cy.get("label").contains("Animation").click();
        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])  
        });

        cy.get("button").contains("Runtime").click();
        cy.get("label").contains("1 - 2 hours").click();
        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            checkMoviePosters(response.body.data.movies as MoviePoster[])  
        });
    });
});
