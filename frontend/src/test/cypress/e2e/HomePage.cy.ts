import { aliasQuery } from "../utils/graphql-test-utils";
import { MoviePoster } from "../../../types/movieTypes";
import { FiltersInput, SortingType } from "../../../types/__generated__/types";

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
        const emptyVariables = {
            skip: 0,
            limit: 20,
            filters: {
                Decade: [],
                Genre: [],
                Rating: [],
                Runtime: [],
                Status: [],
            } as FiltersInput,
            sortOption: SortingType.MOST_POPULAR,
            search: "",
        };

        beforeEach(() => {
            cy.seedDatabase();
            cy.intercept("POST", "http://localhost:3001/", (req) => {
                aliasQuery(req, "GetMovies");
                aliasQuery(req, "GetMovie");
            });
            cy.visit("/");
        });

        it("searches correctly", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal(emptyVariables);

                const initialMovies = response.body.data
                    .movies as MoviePoster[];
                cy.checkMoviePosters(initialMovies);
                cy.wrap(initialMovies).as("initialMovies");
            });
            cy.get('a[href*="movie"]').should("have.length", 20);

            cy.get("#searchbar").type("the");
            cy.get("#searchbar").should("have.value", "the");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    15
                );
            });

            cy.get("#searchbar").type(" nun");
            cy.get("#searchbar").should("have.value", "the nun");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    search: "the nun",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    2
                );
            });

            // Check that we get the same initial movies when clearing search bar (cached result)
            cy.get("#searchbar").clear();
            cy.get("#searchbar").should("have.value", "");
            cy.get('a[href*="movie"]').should("have.length", 20);
            cy.get<MoviePoster[]>("@initialMovies").then((initialMovies) => {
                cy.checkMoviePosters(initialMovies);
            });
        });

        it("sorts correctly", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal(emptyVariables);

                const initialMovies = response.body.data
                    .movies as MoviePoster[];
                cy.checkMoviePosters(initialMovies);
                cy.wrap(initialMovies).as("initialMovies");
            });
            cy.get('a[href*="movie"]').should("have.length", 20);

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Sort by").click();
            cy.get("#MOST_POPULAR").should(
                "have.attr",
                "data-state",
                "checked"
            );

            cy.get("#BEST_RATED").should("be.enabled").click();
            cy.get("#BEST_RATED").should("have.attr", "data-state", "checked");
            cy.get("#MOST_POPULAR").should(
                "have.attr",
                "data-state",
                "unchecked"
            );

            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    sortOption: SortingType.BEST_RATED,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            cy.get("#NEWEST_FIRST").should("be.enabled").click();
            cy.get("#NEWEST_FIRST").should(
                "have.attr",
                "data-state",
                "checked"
            );
            cy.get("#BEST_RATED").should(
                "have.attr",
                "data-state",
                "unchecked"
            );

            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    sortOption: SortingType.NEWEST_FIRST,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            // Check that we get the same initial movies when resetting sortOption (cached result)
            cy.get("#MOST_POPULAR").should("be.enabled").click();
            cy.get("#MOST_POPULAR").should(
                "have.attr",
                "data-state",
                "checked"
            );
            cy.get("#NEWEST_FIRST").should(
                "have.attr",
                "data-state",
                "unchecked"
            );
            cy.get<MoviePoster[]>("@initialMovies").then((initialMovies) => {
                cy.checkMoviePosters(initialMovies);
            });
        });

        it("filters correctly", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal(emptyVariables);

                const initialMovies = response.body.data
                    .movies as MoviePoster[];
                cy.checkMoviePosters(initialMovies);
                cy.wrap(initialMovies).as("initialMovies");
            });
            cy.get('a[href*="movie"]').should("have.length", 20);

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Rating").click();
            cy.get("#3").should("be.enabled").click();
            cy.get("#3").should("have.attr", "data-state", "checked");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Rating: ["3"],
                    },
                });

                const filterMovies = response.body.data.movies as MoviePoster[];
                cy.checkMoviePosters(filterMovies);
                cy.wrap(filterMovies).as("filterMovies");
            });

            cy.contains("Decade").click();
            cy.get("#2010s").should("be.enabled").click();
            cy.get("#2010s").should("have.attr", "data-state", "checked");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Decade: ["2010s"],
                        Rating: ["3"],
                    },
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    1
                );
            });

            // Check that we get the same movies when unapplying filters (cached result)
            cy.get("#2010s").should("be.enabled").click();
            cy.get("#2010s").should("have.attr", "data-state", "unchecked");
            cy.get<MoviePoster[]>("@filterMovies").then((filterMovies) => {
                cy.checkMoviePosters(filterMovies);
            });

            cy.contains("Rating").click();
            cy.get("#3").should("be.enabled").click();
            cy.get("#3").should("have.attr", "data-state", "unchecked");
            cy.get('a[href*="movie"]').should("have.length", 20);
            cy.get<MoviePoster[]>("@initialMovies").then((initialMovies) => {
                cy.checkMoviePosters(initialMovies);
            });
        });

        it("handles filtering, sorting and search combined", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Sort by").click();
            cy.get("#BEST_RATED").should("be.enabled").click();

            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    sortOption: SortingType.BEST_RATED,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            cy.contains("Genre").click();
            cy.get("#Adventure").should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Genre: ["Adventure"],
                    },
                    sortOption: SortingType.BEST_RATED,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    18
                );
            });

            cy.contains("Runtime").click();
            cy.get('[id="1 - 2 hours"]').should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Genre: ["Adventure"],
                        Runtime: ["1 - 2 hours"],
                    },
                    sortOption: SortingType.BEST_RATED,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    6
                );
            });

            cy.contains("Close").click();
            cy.contains("Sort by").should("not.be.visible");
            cy.get("#searchbar").type("mario");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Genre: ["Adventure"],
                        Runtime: ["1 - 2 hours"],
                    },
                    sortOption: SortingType.BEST_RATED,
                    search: "mario",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    1
                );
            });
        });

        it("handles filtering, sorting and search combined and remembers when returning to page", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get("#searchbar").type("the");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    15
                );
            });

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Rating").click();
            cy.get("#4").should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Rating: ["4"],
                    },
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    6
                );
            });

            cy.contains("Sort by").click();
            cy.get("#SHORTEST_RUNTIME").should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Rating: ["4"],
                    },
                    sortOption: SortingType.SHORTEST_RUNTIME,
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    6
                );
            });

            cy.contains("Rating").click();
            cy.get("#3").should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Rating: ["4", "3"],
                    },
                    sortOption: SortingType.SHORTEST_RUNTIME,
                    search: "the",
                });
                const filterMovies = response.body.data.movies as MoviePoster[];
                cy.checkMoviePosters(filterMovies, 14);
                cy.wrap(filterMovies).as("filterMovies");
            });

            // Visit movie page and go back, everything should still be the same
            cy.contains("Close").click();
            cy.contains("Sort by").should("not.be.visible");
            cy.get('a[href*="movie"]').first().click();
            cy.url().should("include", "movie");
            cy.wait("@gqlGetMovieQuery");

            cy.contains("MovieDB").click();
            cy.url().should("not.include", "movie");
            cy.get<MoviePoster[]>("@filterMovies").then((filterMovies) => {
                cy.checkMoviePosters(filterMovies, 14);
            });

            cy.get("#searchbar").should("have.value", "the");

            cy.contains("Sort & Filter").click();
            cy.contains("Sort by").click();
            cy.get("#SHORTEST_RUNTIME").should(
                "have.attr",
                "data-state",
                "checked"
            );
            cy.contains("Rating").click();
            cy.get("#4").should("have.attr", "data-state", "checked");
            cy.get("#3").should("have.attr", "data-state", "checked");
        });

        it("handles clear all correctly", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal(emptyVariables);

                const initialhMovies = response.body.data
                    .movies as MoviePoster[];
                cy.wrap(initialhMovies).as("initialhMovies");
            });

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Sort by").click();
            cy.get("#SHORTEST_RUNTIME").should("be.enabled").click();
            cy.get("#SHORTEST_RUNTIME").should(
                "have.attr",
                "data-state",
                "checked"
            );
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    sortOption: SortingType.SHORTEST_RUNTIME,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            cy.contains("Status").click();
            cy.get("#Released").should("be.enabled").click();
            cy.get("#Released").should("have.attr", "data-state", "checked");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Status: ["Released"],
                    },
                    sortOption: SortingType.SHORTEST_RUNTIME,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            cy.contains("Genre").click();
            cy.get("#Thriller").should("be.enabled").click();
            cy.get("#Thriller").should("have.attr", "data-state", "checked");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Status: ["Released"],
                        Genre: ["Thriller"],
                    },
                    sortOption: SortingType.SHORTEST_RUNTIME,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            // Checks that "Clear All" resets everyting
            cy.contains("Clear All").click();
            cy.get<MoviePoster[]>("@initialhMovies").then((initialMovies) => {
                cy.checkMoviePosters(initialMovies);
            });

            cy.contains("Sort by").click();
            cy.get("#SHORTEST_RUNTIME").should(
                "have.attr",
                "data-state",
                "unchecked"
            );
            cy.contains("Status").click();
            cy.get("#Released").should("have.attr", "data-state", "unchecked");
            cy.contains("Genre").click();
            cy.get("#Thriller").should("have.attr", "data-state", "unchecked");
        });

        it("handles clear all with search correctly", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");

            cy.get("#searchbar").type("the");
            cy.get("#searchbar").should("have.value", "the");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    search: "the",
                });
                const searchMovies = response.body.data.movies as MoviePoster[];
                cy.checkMoviePosters(searchMovies, 15);
                cy.wrap(searchMovies).as("searchMovies");
            });

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Sort by").click();
            cy.get("#SHORTEST_RUNTIME").should("be.enabled").click();
            cy.get("#SHORTEST_RUNTIME").should(
                "have.attr",
                "data-state",
                "checked"
            );
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    sortOption: SortingType.SHORTEST_RUNTIME,
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    15
                );
            });

            cy.contains("Status").click();
            cy.get("#Released").should("be.enabled").click();
            cy.get("#Released").should("have.attr", "data-state", "checked");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Status: ["Released"],
                    },
                    sortOption: SortingType.SHORTEST_RUNTIME,
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    14
                );
            });

            cy.contains("Genre").click();
            cy.get("#Thriller").should("be.enabled").click();
            cy.get("#Thriller").should("have.attr", "data-state", "checked");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Status: ["Released"],
                        Genre: ["Thriller"],
                    },
                    sortOption: SortingType.SHORTEST_RUNTIME,
                    search: "the",
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[],
                    6
                );
            });

            // Checks that "Clear All" resets everyting
            cy.contains("Clear All").click();
            cy.get<MoviePoster[]>("@searchMovies").then((searchMovies) => {
                cy.checkMoviePosters(searchMovies, 15);
            });

            cy.contains("Sort by").click();
            cy.get("#SHORTEST_RUNTIME").should(
                "have.attr",
                "data-state",
                "unchecked"
            );
            cy.contains("Status").click();
            cy.get("#Released").should("have.attr", "data-state", "unchecked");
            cy.contains("Genre").click();
            cy.get("#Thriller").should("have.attr", "data-state", "unchecked");

            cy.contains("Close").click();
            cy.contains("Sort by").should("not.be.visible");
            cy.get("#searchbar").should("have.value", "the");
        });

        it("handles loading more correctly", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");
            cy.get('a[href*="movie"] img').should("have.length", 20);

            cy.window().scrollTo("bottom");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    skip: 20,
                });

                const responseMovies = response.body.data
                    .movies as MoviePoster[];

                // Check that new page is placed correctly in the list
                cy.checkMoviePosters(responseMovies, 40, 20);
            });

            cy.window().scrollTo("bottom");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    skip: 40,
                });

                const responseMovies = response.body.data
                    .movies as MoviePoster[];

                // Check that new page is placed correctly in the list
                cy.checkMoviePosters(responseMovies, 50, 40);
            });
        });

        it("handles loading more correctly when filtering", () => {
            // Wait for the initial GetMovies query to complete
            cy.wait("@gqlGetMoviesQuery");
            cy.get('a[href*="movie"] img').should("have.length", 20);

            cy.window().scrollTo("bottom");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    skip: 20,
                });
                const responseMovies = response.body.data
                    .movies as MoviePoster[];

                // Check that new page is placed correctly in the list
                cy.checkMoviePosters(responseMovies, 40, 20);
                cy.wrap(responseMovies).as("initialLoadMoreMovies");
            });

            cy.get("button").contains("Sort & Filter").click();
            cy.contains("Sort by").click();
            cy.get("#OLDEST_FIRST").should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    sortOption: SortingType.OLDEST_FIRST,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            cy.contains("Rating").click();
            cy.get("#4").should("be.enabled").click();
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    filters: {
                        ...emptyVariables.filters,
                        Rating: ["4"],
                    },
                    sortOption: SortingType.OLDEST_FIRST,
                });
                cy.checkMoviePosters(
                    response.body.data.movies as MoviePoster[]
                );
            });

            cy.window().scrollTo("bottom");
            cy.wait("@gqlGetMoviesQuery").then(({ request, response }) => {
                expect(request.body.variables).to.deep.equal({
                    ...emptyVariables,
                    skip: 20,
                    filters: {
                        ...emptyVariables.filters,
                        Rating: ["4"],
                    },
                    sortOption: SortingType.OLDEST_FIRST,
                });
                const responseMovies = response.body.data
                    .movies as MoviePoster[];

                // Check that new page is placed correctly in the list
                cy.checkMoviePosters(responseMovies, 26, 20);
            });

            cy.contains("Clear All").click();
            cy.get<MoviePoster[]>("@initialLoadMoreMovies").then(
                (initialLoadMoreMovies) => {
                    cy.checkMoviePosters(initialLoadMoreMovies, 40, 20);
                }
            );
        });
    }
);
