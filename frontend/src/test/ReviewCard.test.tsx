import { Review } from "@/types/__generated__/types";
import { mock_review } from "./mock/util";
import { usernameVar } from "@/utils/cache";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ReviewCard from "@/components/ReviewCard";
import { MockedProvider } from "@apollo/client/testing";
import { MemoryRouter } from "react-router-dom";
import { formatDate } from "@/utils/formatUtil";

const mockReview: Review = mock_review;

describe("ReviewCard", () => {
    const renderComponent = (review: Review, showPoster = false) => {
        return render(
            <MemoryRouter>
                <MockedProvider mocks={[]} addTypename={false}>
                    <ReviewCard review={review} showPoster={showPoster} />
                </MockedProvider>
            </MemoryRouter>
        );
    };

    afterAll(() => {
        usernameVar("Guest");
    });

    it("displays username, data and comment", async () => {
        renderComponent(mockReview);
        expect(screen.getByText("cosmic_dreamer")).toBeInTheDocument();
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
        usernameVar("cosmic_dreamer");
        renderComponent(mockReview);
        expect(
            screen.getByRole("button", { name: /delete/i })
        ).toBeInTheDocument();
    });

    it("does not show delete button for other users review", () => {
        usernameVar("other_user");
        renderComponent(mockReview);
        expect(
            screen.queryByRole("button", { name: /delete/i })
        ).not.toBeInTheDocument();
    });
});
