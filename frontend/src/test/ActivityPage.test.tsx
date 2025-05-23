import { GET_LATEST_REVIEWS } from "@/api/queries";
import { all_reviews } from "./mock/util";
import "@testing-library/jest-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import ActivityPage from "@/pages/ActivityPage";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

vi.mock("../components/ReviewCard", () => ({
    default: vi.fn(() => <div data-testid="review-card" />),
}));

vi.mock("../components/Loader", () => ({
    default: vi.fn(() => <div data-testid="loader" />),
}));

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
        return render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <ActivityPage />
                </MemoryRouter>
            </MockedProvider>
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("matches snapshot when loading", () => {
        const { asFragment } = renderComponent(mockLatestReviewsEmpty);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when latest reviews are loaded", async () => {
        const { asFragment } = renderComponent(mockLatestReviews);
        await screen.findByText("Latest Activity");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when no reviews are available", async () => {
        const { asFragment } = renderComponent(mockLatestReviewsEmpty);
        await screen.findByText("No reviews have been added yet");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when there is an error", async () => {
        const { asFragment } = renderComponent(mockLatestReviewsError);
        await screen.findByText("Something went wrong!");
        expect(asFragment()).toMatchSnapshot();
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
        await waitFor(() =>
            expect(screen.getAllByTestId("review-card")).toHaveLength(20)
        );
    });
});
