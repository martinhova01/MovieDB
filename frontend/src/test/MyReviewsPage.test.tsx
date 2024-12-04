import { GET_USER_REVIEWS } from "@/api/queries";
import { all_reviews } from "./mock/util";
import "@testing-library/jest-dom";
import { usernameVar } from "@/utils/cache";
import { MemoryRouter } from "react-router-dom";
import { MockedProvider, MockedResponse } from "@apollo/client/testing";
import { act, render, screen, waitFor } from "@testing-library/react";
import MyReviewsPage from "@/pages/MyReviewsPage";
import { vi } from "vitest";
import { Review } from "@/types/__generated__/types";
import { useReactiveVar } from "@apollo/client";

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

vi.mock("../components/ReviewCard", () => ({
    default: vi.fn(({ review }: { review: Review }) => (
        <div data-testid="review-card">
            <span data-testid="review-username">{review.username}</span>
            <span data-testid="review-rating">{review.rating}</span>
            <span data-testid="review-comment">{review.comment}</span>
        </div>
    )),
}));

vi.mock("../components/Loader", () => ({
    default: vi.fn(() => <div data-testid="loader" />),
}));

vi.mock("@/utils/cache", () => ({
    usernameVar: vi.fn(),
}));

vi.mock("@apollo/client", async () => {
    const original = await vi.importActual("@apollo/client");
    return {
        ...original,
        useReactiveVar: vi.fn(),
    };
});

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
    const actualModule = await vi.importActual("react-router-dom");
    return {
        ...actualModule,
        useNavigate: () => mockNavigate,
    };
});

describe("ActivityPage", () => {
    const renderComponent = (mocks: MockedResponse[] | undefined) => {
        return render(
            <MockedProvider mocks={mocks} addTypename={false}>
                <MemoryRouter>
                    <MyReviewsPage />
                </MemoryRouter>
            </MockedProvider>
        );
    };

    beforeEach(() => {
        vi.mocked(usernameVar).mockReturnValue("test_user");
        vi.mocked(useReactiveVar).mockImplementation((varFn) => varFn());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("matches snapshot when loading", () => {
        const { asFragment } = renderComponent(mockUserReviews);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when user reviews are loaded", async () => {
        const { asFragment } = renderComponent(mockUserReviews);
        await screen.findByText("My Reviews");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot when user has no reviews", async () => {
        vi.mocked(usernameVar).mockReturnValue("other_user");
        const { asFragment } = renderComponent(mockUserReviews);
        await screen.findByText("You have not added any reviews yet");
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot on error", async () => {
        const { asFragment } = renderComponent(mockUserReviewsError);
        await screen.findByText("Something went wrong!");
        expect(asFragment()).toMatchSnapshot();
    });

    it("displays 'You have not added any reviews yet' on empty reviews", async () => {
        vi.mocked(usernameVar).mockReturnValue("other_user");
        renderComponent(mockUserReviews);
        await waitFor(() =>
            expect(
                screen.getByText("You have not added any reviews yet")
            ).toBeInTheDocument()
        );
    });

    it("displays 'Something went wrong!' on error", async () => {
        renderComponent(mockUserReviewsError);
        await waitFor(() =>
            expect(
                screen.getByText("Something went wrong!")
            ).toBeInTheDocument()
        );
    });

    it("renders 20 reviews", async () => {
        renderComponent(mockUserReviews);
        //All reviews have username 'test_user'
        await waitFor(() =>
            expect(screen.getAllByText("test_user")).toHaveLength(20)
        );
    });

    it("redirects to homepage on logout", async () => {
        mockNavigate.mockClear();
        renderComponent(mockUserReviews);
        act(() => vi.mocked(usernameVar).mockReturnValue("Guest"));
        await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/"));
    });

    it("does not redirect to homepage on user change", async () => {
        mockNavigate.mockClear();
        renderComponent(mockUserReviews);
        act(() => vi.mocked(usernameVar).mockReturnValue("other_user"));
        await waitFor(() => expect(mockNavigate).not.toHaveBeenCalled());
    });
});
