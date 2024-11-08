import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { GET_MOVIE } from "@/api/queries";
import MovieDetailPage from "@/pages/MovieDetailPage";
import { all_movies } from "./mock/util";

const movieMock = [
    {
        request: {
            query: GET_MOVIE,
            variables: {
                movieId: 475557,
            },
        },
        result: {
            data: {
                movie: all_movies[18],
            },
        },
    },
];

describe("MovieDetailPage", () => {
    it("displays loading message initially", () => {
        const router = createMemoryRouter(
            [{ path: "/movie/:movieId", element: <MovieDetailPage /> }],
            {
                initialEntries: ["/movie/475557"],
            }
        );

        render(
            <MockedProvider mocks={movieMock} addTypename={false}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("displays movie details when data is successfully loaded", async () => {
        const router = createMemoryRouter(
            [{ path: "/movie/:movieId", element: <MovieDetailPage /> }],
            {
                initialEntries: ["/movie/475557"],
            }
        );

        render(
            <MockedProvider mocks={movieMock} addTypename={false}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        expect(await screen.findByText("Joker")).toBeInTheDocument();
    });

    it("displays error message if there is a query error", async () => {
        const errorMock = [
            {
                request: {
                    query: GET_MOVIE,
                    variables: { movieId: 475557 },
                },
                error: new Error("Error fetching movie"),
            },
        ];

        const router = createMemoryRouter(
            [{ path: "/movie/:movieId", element: <MovieDetailPage /> }],
            {
                initialEntries: ["/movie/475557"],
            }
        );

        render(
            <MockedProvider mocks={errorMock} addTypename={false}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        expect(
            await screen.findByText("Something went wrong!")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Return to home page")
        ).toBeInTheDocument();
    });

    it("displays 'Could not find movie!' message if movie is not found", async () => {
        const noMovieMock = [
            {
                request: {
                    query: GET_MOVIE,
                    variables: { movieId: 475557 },
                },
                result: { data: { movie: null } },
            },
        ];

        const router = createMemoryRouter(
            [{ path: "/movie/:movieId", element: <MovieDetailPage /> }],
            {
                initialEntries: ["/movie/475557"],
            }
        );

        render(
            <MockedProvider mocks={noMovieMock} addTypename={false}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        expect(
            await screen.findByText("Could not find movie!")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Return to home page")
        ).toBeInTheDocument();
    });
});
