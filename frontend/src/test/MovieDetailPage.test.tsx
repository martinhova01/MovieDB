import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { GET_MOVIE } from "@/api/queries";
import MovieDetailPage from "@/pages/MovieDetailPage";
import { all_movies } from "./mock/util";
import { vi } from "vitest";

vi.mock("../components/MovieCardDetailed", () => ({
    default: vi.fn(({ movie }: { movie: { title: string } }) => (
        <div data-testid="movie-card-detailed">{movie.title}</div>
    )),
}));

vi.mock("../components/MovieReviews", () => ({
    default: vi.fn(() => <div data-testid="movie-reviews" />),
}));

vi.mock("../components/Loader", () => ({
    default: vi.fn(() => <div data-testid="loader" />),
}));

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

const errorMock = [
    {
        request: {
            query: GET_MOVIE,
            variables: { movieId: 475557 },
        },
        error: new Error("Error fetching movie"),
    },
];

const noMovieMock = [
    {
        request: {
            query: GET_MOVIE,
            variables: { movieId: 475557 },
        },
        result: { data: { movie: null } },
    },
];

describe("MovieDetailPage", () => {
    const renderComponent = (mocks: MockedResponse[] | undefined) => {
        const router = createMemoryRouter(
            [{ path: "/movie/:movieId", element: <MovieDetailPage /> }],
            {
                initialEntries: ["/movie/475557"],
            }
        );

        return render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RouterProvider router={router} />
            </MockedProvider>
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("matches snapshot when loading", () => {
        const { asFragment } = renderComponent(movieMock);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when data is loaded", async () => {
        const { asFragment } = renderComponent(movieMock);
        await screen.findByText("Joker");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when no movie is found", async () => {
        const { asFragment } = renderComponent(noMovieMock);
        await screen.findByText("Could not find movie!");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot on error", async () => {
        const { asFragment } = renderComponent(errorMock);
        await screen.findByText("Something went wrong!");
        expect(asFragment()).toMatchSnapshot();
    });

    it("displays loading message initially", () => {
        renderComponent(movieMock);
        expect(screen.getByTestId("loader")).toBeInTheDocument();
    });

    it("displays movie details when data is successfully loaded", async () => {
        renderComponent(movieMock);
        expect(
            await screen.findByTestId("movie-card-detailed")
        ).toHaveTextContent("Joker");
    });

    it("displays error message if there is a query error", async () => {
        renderComponent(errorMock);
        expect(
            await screen.findByText("Something went wrong!")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Return to home page")
        ).toBeInTheDocument();
    });

    it("displays 'Could not find movie!' message if movie is not found", async () => {
        renderComponent(noMovieMock);
        expect(
            await screen.findByText("Could not find movie!")
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Return to home page")
        ).toBeInTheDocument();
    });
});
