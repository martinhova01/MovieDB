import { GET_USER_REVIEWS } from "@/api/queries";
import { all_reviews } from "./mock/util";
import "@testing-library/jest-dom";
import { usernameVar } from "@/utils/cache";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { render, screen, waitFor } from "@testing-library/react";
import MyReviewsPage from "@/pages/MyReviewsPage";

const mockUserReviews = [
    {
        request: {
            query: GET_USER_REVIEWS,
            variables: {
                username: "other_user",
                skip: 0,
                limit: 20,
            },
        },
        result: {
            data: {
                userReviews: [],
            },
        },
    },
    {
        request: {
            query: GET_USER_REVIEWS,
            variables: {
                username: "test_user",
                skip: 0,
                limit: 20,
            },
        },
        result: {
            data: {
                userReviews: all_reviews.slice(0, 20),
            },
        },
    },
];

const mockUserReviewsError = [
    {
        request: {
            query: GET_USER_REVIEWS,
            variables: {
                username: "test_user",
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
            [{ path: "/myReviews", element: <MyReviewsPage /> }],
            {
                initialEntries: ["/myReviews"],
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

    it("displays 'You have not added any reviews yet' on empty reviews", async () => {
        usernameVar("other_user");
        renderComponent(mockUserReviews);
        await waitFor(() =>
            expect(
                screen.getByText("You have not added any reviews yet")
            ).toBeInTheDocument()
        );
    });

    it("displays 'Something went wrong!' on error", async () => {
        usernameVar("test_user");
        renderComponent(mockUserReviewsError);
        await waitFor(() =>
            expect(
                screen.getByText("Something went wrong!")
            ).toBeInTheDocument()
        );
    });

    it("renders 20 reviews", async () => {
        usernameVar("test_user");
        renderComponent(mockUserReviews);
        //All reviews have username 'test_user'
        await waitFor(() =>
            expect(screen.getAllByText("test_user")).toHaveLength(20)
        );
    });
});
