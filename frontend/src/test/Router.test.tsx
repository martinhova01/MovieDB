import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routerConfig from "@/utils/routerConfig";
import userEvent from "@testing-library/user-event";
import { MockedProvider } from "@apollo/client/testing";
import { Filters, FiltersInput, Review } from "@/types/__generated__/types";
import { all_movies } from "./mock/util";
import {
    GET_FILTERS,
    GET_LATEST_REVIEWS,
    GET_MOVIE,
    GET_MOVIES,
    GET_USER_REVIEWS,
} from "@/api/queries";
import { defaultSortOption } from "@/utils/sortOptionUtil";
import { usernameVar } from "@/utils/cache";

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
            variables: {
                appliedFilters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                },
                search: "",
            },
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
    {
        request: {
            query: GET_LATEST_REVIEWS,
            variables: {
                skip: 0,
                limit: 20,
            },
        },
        result: {
            data: {
                latestReviews: [
                    {
                        _id: "672df775d1cb18323855b4aa",
                        username: "TestUser",
                        rating: 3,
                        comment: "It is ok",
                        date: new Date(),
                        movie: {
                            _id: 678512,
                            title: "Sound of Freedom",
                            poster_path: "/kSf9svfL2WrKeuK8W08xeR5lTn8.jpg",
                        },
                    },
                ] as Review[],
            },
        },
    },
    {
        request: {
            query: GET_USER_REVIEWS,
            variables: {
                username: "TestUser",
                skip: 0,
                limit: 20,
            },
        },
        result: {
            data: {
                userReviews: [
                    {
                        _id: "672df775d1cb18323855b4aa",
                        username: "TestUser",
                        rating: 3,
                        comment: "It is ok",
                        date: new Date(),
                        movie: {
                            _id: 678512,
                            title: "Sound of Freedom",
                            poster_path: "/kSf9svfL2WrKeuK8W08xeR5lTn8.jpg",
                        },
                    },
                ] as Review[],
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

    it("successfully renders ActivityPage", async () => {
        const router = createMemoryRouter(routerConfig);
        render(
            <MockedProvider mocks={mocks}>
                <RouterProvider router={router} />
            </MockedProvider>
        );

        userEvent.click(await screen.findByText("Activity"));
        expect(await screen.findByText("Latest Activity")).toBeInTheDocument();
        expect(await screen.findByText("TestUser")).toBeInTheDocument();
        expect(await screen.findByText("It is ok")).toBeInTheDocument();
    });

    it("successfully renders MyReviewsPage", async () => {
        usernameVar("TestUser");
        const router = createMemoryRouter(routerConfig);
        render(
            <MockedProvider mocks={mocks}>
                <RouterProvider router={router} />
            </MockedProvider>
        );
        await userEvent.click(screen.getByText("My Reviews"));
        expect(await screen.findAllByText("My Reviews")).toHaveLength(2); // Title and tab
        expect(await screen.findAllByText("TestUser")).toHaveLength(2); // Review and UserDropdown
        expect(await screen.findByText("It is ok")).toBeInTheDocument();
        await userEvent.click(screen.getByText("MovieDB"));
        usernameVar("Guest");
    });
});
