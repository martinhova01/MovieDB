import { Review } from "@/types/__generated__/types";
import { all_reviews } from "./mock/util";
import { usernameVar } from "@/utils/cache";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewCard from "@/components/ReviewCard";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { formatDate } from "@/utils/formatUtil";
import { DELETE_REVIEW } from "@/api/queries";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useReactiveVar } from "@apollo/client";

const mockReview: Review = all_reviews[0];

const mockDeleteReview = [
    {
        request: {
            query: DELETE_REVIEW,
            variables: {
                id: "67345815fd0434382c87e27d",
            },
        },
        result: {
            data: {
                deleteReview: {
                    ...all_reviews[0],
                },
            },
        },
    },
];

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

vi.mock("@/utils/formatUtil", () => ({
    formatDate: (date: Date) =>
        date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }),
}));

vi.mock("@/utils/imageUrl/imageUrl", () => ({
    getImageUrl: vi.fn(),
    ImageType: {
        POSTER: "poster",
    },
}));

vi.mock("../components/Loader", () => ({
    default: vi.fn(() => <div data-testid="loader" />),
}));

describe("ReviewCard", () => {
    const renderComponent = (review: Review, showPoster = false) => {
        return render(
            <MemoryRouter>
                <MockedProvider mocks={mockDeleteReview} addTypename={false}>
                    <ReviewCard review={review} showPoster={showPoster} />
                </MockedProvider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        vi.mocked(usernameVar).mockReturnValue("test_user");
        vi.mocked(useReactiveVar).mockImplementation((varFn) => varFn());
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("matches snapshot for review card without poster", () => {
        const { asFragment } = renderComponent(mockReview);
        expect(asFragment()).toMatchSnapshot();
    });

    it("matches snapshot for review card with poster", () => {
        const { asFragment } = renderComponent(mockReview, true);
        expect(asFragment()).toMatchSnapshot();
    });

    it("displays username, data and comment", async () => {
        renderComponent(mockReview);
        expect(screen.getByText("test_user")).toBeInTheDocument();
        expect(screen.getByText("good movie!")).toBeInTheDocument();
        expect(
            screen.getByText(new RegExp(formatDate(mockReview.date)))
        ).toBeInTheDocument();
    });

    it("does not render poster if showPoster is false", async () => {
        renderComponent(mockReview);
        expect(
            screen.queryByAltText("Interstellar poster")
        ).not.toBeInTheDocument();
    });

    it("renders poster if showPoster is true", async () => {
        renderComponent(mockReview, true);
        expect(
            screen.queryByAltText("Interstellar poster")
        ).toBeInTheDocument();
    });

    it("shows delete button for user's own review", () => {
        renderComponent(mockReview);
        expect(
            screen.getByRole("button", { name: /delete/i })
        ).toBeInTheDocument();
    });

    it("does not show delete button for other users review", () => {
        vi.mocked(usernameVar).mockReturnValue("other_user");
        renderComponent(mockReview);
        expect(
            screen.queryByRole("button", { name: /delete/i })
        ).not.toBeInTheDocument();
    });

    it("shows dialog box when 'delete' is clicked", async () => {
        renderComponent(mockReview);

        const deleteButton = screen.getByRole("button", { name: /delete/i });
        await userEvent.click(deleteButton);
        //AlertDialog opens
        expect(
            screen.getByText("Are you sure you want to delete this review?")
        ).toBeInTheDocument();

        const continuButton = screen.getByRole("button", { name: /continue/i });
        await userEvent.click(continuButton);
        //AlertDialog closes
        expect(
            screen.queryByText("Are you sure you want to delete this review?")
        ).not.toBeInTheDocument();
    });
});
