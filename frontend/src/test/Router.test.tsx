import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routerConfig from "@/utils/routerConfig";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { Filters, FiltersInput } from "@/types/__generated__/types";
import { all_movies } from "./mock/util";
import { GET_FILTERS, GET_MOVIE, GET_MOVIES } from "@/api/queries";
import { defaultSortOption } from "@/utils/sortOptionUtil";

const mocks = [
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
                movies: [...all_movies]
                    .sort(
                        (a, b) =>
                            b.release_date.getTime() - a.release_date.getTime()
                    )
                    .slice(0, 20),
            },
        },
    },
    {
        request: {
            query: GET_FILTERS,
        },
        result: {
            data: {
                filters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                } as Filters,
            },
        },
    },
    {
        request: {
            query: GET_MOVIE,
            variables: {
                movieId: 475557,
            },
        },
        result: {
            data: {
                movie: all_movies[18], // Joker
            },
        },
    },
];

describe("Router", () => {
    it("successfully renders Navbar", async () => {
        const router = createMemoryRouter(routerConfig);
        render(
            <MockedProvider mocks={mocks}>
                <RouterProvider router={router} />
            </MockedProvider>
        );
        expect(await screen.findByText("MovieDB")).toBeInTheDocument();
    });

    it("successfully renders Home Page", async () => {
        const router = createMemoryRouter(routerConfig);
        render(
            <MockedProvider mocks={mocks}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        expect(await screen.findByAltText("Joker")).toBeInTheDocument();
    });

    it("successfully renders MovieDetailPage", async () => {
        const router = createMemoryRouter(routerConfig);
        render(
            <MockedProvider mocks={mocks}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        userEvent.click(await screen.findByAltText("Joker"));
        expect(
            await screen.findByText("Put on a happy face.")
        ).toBeInTheDocument();
    });

    it("successfully renders NotFoundPage", async () => {
        const entries = ["/invalidPath"];
        const router = createMemoryRouter(routerConfig, {
            initialEntries: entries,
        });
        render(
            <MockedProvider mocks={mocks}>
                <RouterProvider router={router} />
            </MockedProvider>
        );
        expect(await screen.findByText("404 - Not Found")).toBeInTheDocument();
    });
});
