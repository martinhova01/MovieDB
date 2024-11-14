import { render, screen, waitFor } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import { describe, it, expect, vi } from "vitest";
import MovieList from "@/components/MovieList";
import { GET_MOVIES } from "@/api/queries";
import { FiltersInput, SortingType } from "@/types/__generated__/types";
import { all_movies } from "./mock/util";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import { defaultSortOption } from "@/utils/sortOptionUtil";
import {
    filtersVar,
    searchVar,
    sortOptionVar,
    totalHitsVar,
} from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";

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

const mockMovies = all_movies.slice(0, 20);

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
                sortOption: defaultSortOption,
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
                sortOption: defaultSortOption,
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
                sortOption: defaultSortOption,
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
    beforeEach(() => {
        vi.mocked(filtersVar).mockReturnValue({
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        });
        vi.mocked(searchVar).mockReturnValue("");
        vi.mocked(sortOptionVar).mockReturnValue(SortingType.MOST_POPULAR);
        vi.mocked(totalHitsVar).mockReturnValue(50);
        vi.mocked(useReactiveVar).mockImplementation((varFn) => varFn());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("renders loading state initially", () => {
        render(
            <MockedProvider mocks={mockGetMoviesQuery} addTypename={false}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </MockedProvider>
        );

        expect(screen.getAllByTestId("movie-card-skeleton")).toHaveLength(20);
    });

    it("renders movies after loading", async () => {
        render(
            <MockedProvider mocks={mockGetMoviesQuery} addTypename={false}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Total Hits: 50")).toBeInTheDocument();
            expect(screen.getAllByTestId("movie-card")).toHaveLength(20);
            mockMovies.map((movie) =>
                expect(screen.getByAltText(movie.title)).toBeInTheDocument()
            );
        });
    });

    it("shows error message when query fails", async () => {
        render(
            <MockedProvider mocks={errorMock} addTypename={false}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(
                screen.getByText("Something went wrong!")
            ).toBeInTheDocument();
            expect(screen.getByText("Try to refresh")).toBeInTheDocument;
        });
    });

    it("shows no movies found message when results are empty", async () => {
        render(
            <MockedProvider mocks={emptyMock} addTypename={false}>
                <MemoryRouter>
                    <MovieList />
                </MemoryRouter>
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("No movies found")).toBeInTheDocument();
            expect(
                screen.getByText("Please refine your search")
            ).toBeInTheDocument();
        });
    });
});
