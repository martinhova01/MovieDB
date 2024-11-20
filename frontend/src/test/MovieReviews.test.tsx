import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import MovieReviews from "../components/MovieReviews";
import { ADD_REVIEW } from "@/api/queries";
import { Review } from "@/types/__generated__/types";
import { usernameVar } from "@/utils/cache";
import { all_movies } from "./mock/util";

const mockDate = new Date("2024-01-01T12:00:00Z");

const mockMovie = {
    ...all_movies[18],
    reviews: [
        {
            _id: "1",
            username: "testuser",
            rating: 4,
            comment: "Great movie!",
            date: mockDate,
        },
    ] as Review[],
};

const mockAddReviewMutation = {
    request: {
        query: ADD_REVIEW,
        variables: {
            movieId: 475557,
            username: "testuser",
            rating: 5,
            comment: "Excellent movie!",
        },
    },
    result: {
        data: {
            addReview: {
                _id: "2",
                username: "testuser",
                rating: 5,
                comment: "Excellent movie!",
                date: mockDate,
                movie: {
                    _id: 475557,
                    vote_average: 4.5,
                    vote_count: 2,
                },
            },
        },
    },
};

const mockNullAddReviewMutation = {
    request: {
        query: ADD_REVIEW,
        variables: {
            movieId: 475557,
            username: "testuser",
            rating: 5,
            comment: "Excellent movie!",
        },
    },
    result: {
        data: {
            addReview: null,
        },
    },
};

describe("MovieReviews", () => {
    beforeAll(() => {
        usernameVar("testuser");
    });

    afterAll(() => {
        usernameVar("Guest");
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MockedProvider mocks={[]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders existing reviews", async () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        expect(screen.getByText("Reviews")).toBeInTheDocument();
        expect(screen.getByText("Great movie!")).toBeInTheDocument();
        expect(screen.getByText("testuser")).toBeInTheDocument();
    });

    it("displays review submission form", async () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        expect(screen.getByText("Submit review")).toBeInTheDocument();
        expect(
            screen.getByRole("button", { name: "Submit Review" })
        ).toBeDisabled();
        expect(
            screen.getByPlaceholderText("Write your review (optional)")
        ).toBeInTheDocument();
    });

    it("enables submit button when rating is selected", async () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        const ratingStars = screen.getAllByRole("radio");
        await userEvent.click(ratingStars[4]);

        expect(
            screen.getByRole("button", { name: "Submit Review" })
        ).toBeEnabled();
    });

    it("resets review submission form on successful submission", async () => {
        render(
            <MockedProvider mocks={[mockAddReviewMutation]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        const ratingStars = screen.getAllByRole("radio");
        await userEvent.click(ratingStars[4]);
        await userEvent.type(
            screen.getByPlaceholderText("Write your review (optional)"),
            "Excellent movie!"
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Submit Review" })
        );

        expect(
            screen.getByPlaceholderText("Write your review (optional)")
        ).toHaveValue("");
    });

    it("does not reset review submission form on null response", async () => {
        render(
            <MockedProvider
                mocks={[mockNullAddReviewMutation]}
                addTypename={false}
            >
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        const ratingStars = screen.getAllByRole("radio");
        await userEvent.click(ratingStars[4]);
        await userEvent.type(
            screen.getByPlaceholderText("Write your review (optional)"),
            "Excellent movie!"
        );
        await userEvent.click(
            screen.getByRole("button", { name: "Submit Review" })
        );

        expect(
            screen.getByPlaceholderText("Write your review (optional)")
        ).toHaveValue("Excellent movie!");
    });
});
