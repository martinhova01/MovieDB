import { GET_LATEST_REVIEWS } from "@/api/queries";
import { all_reviews } from "./mock/util";
import "@testing-library/jest-dom";
import { usernameVar } from "@/utils/cache";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import ActivityPage from "@/pages/ActivityPage";
import { render, screen, waitFor } from "@testing-library/react";

const mockLatestReviewsEmpty = [
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
                latestReviews: [],
            },
        },
    },
];

const mockLatestReviews = [
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
                latestReviews: all_reviews.slice(0, 20),
            },
        },
    },
    {
        request: {
            query: GET_LATEST_REVIEWS,
            variables: {
                skip: 20,
                limit: 20,
            },
        },
        result: {
            data: {
                latestReviews: all_reviews,
            },
        },
    },
];

const mockLatestReviewsError = [
    {
        request: {
            query: GET_LATEST_REVIEWS,
            variables: {
                skip: 0,
                limit: 20,
            },
        },
        error: new Error("Error fetching movie"),
    },
];

describe("ActivityPage", () => {
    const renderComponent = (mocks: MockedResponse[] | undefined) => {
        const router = createMemoryRouter(
            [{ path: "/activity", element: <ActivityPage /> }],
            {
                initialEntries: ["/activity"],
            }
        );

        return render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <RouterProvider router={router} />
            </MockedProvider>
        );
    };

    afterAll(() => {
        usernameVar("Guest");
    });

    it("displays 'No reviews have been added yet' on empty reviews", async () => {
        renderComponent(mockLatestReviewsEmpty);
        await waitFor(() =>
            expect(
                screen.getByText("No reviews have been added yet")
            ).toBeInTheDocument()
        );
    });

    it("displays 'Something went wrong!' on error", async () => {
        renderComponent(mockLatestReviewsError);
        await waitFor(() =>
            expect(
                screen.getByText("Something went wrong!")
            ).toBeInTheDocument()
        );
    });

    it("renders 20 reviews", async () => {
        renderComponent(mockLatestReviews);
        //All reviews have username 'test_user'
        await waitFor(() =>
            expect(screen.getAllByText("test_user")).toHaveLength(20)
        );
    });
});
