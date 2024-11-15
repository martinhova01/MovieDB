import { aliasQuery } from "../utils/graphql-test-utils";
import { MoviePoster } from "../../../types/movieTypes";

describe("Homepage - filtering, sorting and search", () => {
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
            movieTitles.forEach((title) => {
                expect(title.toLowerCase()).to.include('harry pot');
            })
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
            const movies = response.body.data.movies;
            const sortedMovies = [...movies].sort((a, b) => b.vote_average - a.vote_average);
            expect(movies).to.deep.equal(sortedMovies);
            
            cy.get('a[href*="movie"] img').then(($posters) => {
                const movieTitles = Cypress._.map($posters, 'title');
                expect(movieTitles).to.deep.equal(sortedMovies.map(m => m.title));
            });
        });

        cy.get("label").contains("Newest first").click();

        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            const movies = response.body.data.movies;
            const sortedMovies = [...movies].sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
            expect(movies).to.deep.equal(sortedMovies);
            
            cy.get('a[href*="movie"] img').then(($posters) => {
                const movieTitles = Cypress._.map($posters, 'title');
                expect(movieTitles).to.deep.equal(sortedMovies.map(m => m.title));
            });
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

        const checkDecades = (movies: MoviePoster[], decadeFilter: string) => {
            return movies.every(movie => {
                const year = new Date(movie.release_date).getFullYear();
                const decade = Math.floor(year / 10) * 10;
                const decadeString = `${decade}s`;
                return decadeString === decadeFilter;
            });
        }
        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            const movies: MoviePoster[] = response.body.data.movies;
            expect(checkDecades(movies, "2000s")).to.be.true;
            
            cy.get('a[href*="movie"] img').then(($posters) => {
                const movieTitles = Cypress._.map($posters, 'title');
                expect(movieTitles).to.deep.equal(movies.map(m => m.title));
            });
        });

        cy.get("button").contains("Runtime").click();
        cy.get("label").contains("Less than 1 hour").click();
        cy.wait('@gqlGetMoviesQuery').then(({ response }) => {
            const movies: MoviePoster[] = response.body.data.movies;
            expect(checkDecades(movies, "2000s")).to.be.true;
            expect(movies.every((movie) => movie.runtime < 60)).to.be.true;
            
            cy.get('a[href*="movie"] img').then(($posters) => {
                const movieTitles = Cypress._.map($posters, 'title');
                expect(movieTitles).to.deep.equal(movies.map(m => m.title));
            });
        });
    });
});
