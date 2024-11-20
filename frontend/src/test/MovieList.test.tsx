import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { vi } from "vitest";
import MovieList from "@/components/MovieList";
import { GET_MOVIES } from "@/api/queries";
import { FiltersInput, SortingType } from "@/types/__generated__/types";
import { all_movies } from "./mock/util";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import {
    filtersVar,
    searchVar,
    sortOptionVar,
    totalHitsVar,
} from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";

vi.mock("@/utils/formatUtil", () => ({
    formatNumber: (n: number) => n.toLocaleString("no-NO"),
}));

vi.mock("@/utils/cache", () => ({
    filtersVar: vi.fn(),
    searchVar: vi.fn(),
    sortOptionVar: vi.fn(),
    totalHitsVar: vi.fn(),
}));

vi.mock("@apollo/client", async () => {
    const original = await vi.importActual("@apollo/client");
    return {
        ...original,
        useReactiveVar: vi.fn(),
    };
});

vi.mock("../components/MovieCard", () => ({
    default: vi.fn(({ movie }: { movie: { title: string } }) => (
        <div data-testid="movie-card">{movie.title}</div>
    )),
}));

vi.mock("../components/MovieCardSkeleton", () => ({
    default: vi.fn(() => <div data-testid="movie-card-skeleton" />),
}));

vi.mock("../components/Loader", () => ({
    default: vi.fn(() => <div data-testid="loader" />),
}));

const mockMovies = all_movies.slice(0, 20);
const mockDefaultSortOption = SortingType.MOST_POPULAR;

const mockGetMoviesQuery = [
    {
        request: {
            query: GET_MOVIES,
            variables: {
                skip: 0,
                limit: 20,
                filters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                } as FiltersInput,
                sortOption: mockDefaultSortOption,
                search: "",
            },
        },
        result: {
            data: {
                movies: mockMovies,
            },
        },
    },
];

const errorMock = [
    {
        request: {
            query: GET_MOVIES,
            variables: {
                skip: 0,
                limit: 20,
                filters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                } as FiltersInput,
                sortOption: mockDefaultSortOption,
                search: "",
            },
        },
        error: new Error("An error occurred"),
    },
];

const emptyMock = [
    {
        request: {
            query: GET_MOVIES,
            variables: {
                skip: 0,
                limit: 20,
                filters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                } as FiltersInput,
                sortOption: mockDefaultSortOption,
                search: "",
            },
        },
        result: {
            data: {
                movies: [],
            },
        },
    },
];

describe("MovieList", () => {
    const renderMovieList = (mocks: MockedResponse[] | undefined) => {
        return render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </MockedProvider>
        );
    };

    beforeEach(() => {
        vi.mocked(filtersVar).mockReturnValue({
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        });
        vi.mocked(searchVar).mockReturnValue("");
        vi.mocked(sortOptionVar).mockReturnValue(mockDefaultSortOption);
        vi.mocked(totalHitsVar).mockReturnValue(50);
        vi.mocked(useReactiveVar).mockImplementation((varFn) => varFn());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("matches snapshot when loading", () => {
        const { asFragment } = renderMovieList(mockGetMoviesQuery);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot after loading", async () => {
        const { asFragment } = renderMovieList(mockGetMoviesQuery);
        await screen.findAllByTestId("movie-card");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot on error", async () => {
        const { asFragment } = renderMovieList(errorMock);
        await screen.findByText("Something went wrong!");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot with no movies found", async () => {
        const { asFragment } = renderMovieList(emptyMock);
        await screen.findByText("No movies found");
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders loading state initially", () => {
        renderMovieList(mockGetMoviesQuery);

        expect(screen.getAllByTestId("movie-card-skeleton")).toHaveLength(20);
    });

    it("renders movies after loading", async () => {
        renderMovieList(mockGetMoviesQuery);

        await waitFor(() => {
            expect(screen.getByText("Total Hits: 50")).toBeInTheDocument();
            expect(screen.getAllByTestId("movie-card")).toHaveLength(
                mockMovies.length
            );
            mockMovies.map((movie) =>
                expect(screen.getByText(movie.title)).toBeInTheDocument()
            );
        });
    });

    it("shows error message when query fails", async () => {
        renderMovieList(errorMock);

        await waitFor(() => {
            expect(
                screen.getByText("Something went wrong!")
            ).toBeInTheDocument();
            expect(screen.getByText("Try to refresh")).toBeInTheDocument();
        });
    });

    it("shows no movies found message when results are empty", async () => {
        renderMovieList(emptyMock);

        await waitFor(() => {
            expect(screen.getByText("No movies found")).toBeInTheDocument();
            expect(
                screen.getByText("Please refine your search")
            ).toBeInTheDocument();
        });
    });
});
