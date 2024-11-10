import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MockedProvider } from "@apollo/client/testing";
import userEvent from "@testing-library/user-event";
import MovieReviews from "../components/MovieReviews";
import {
    ADD_REVIEW,
    GET_LATEST_REVIEWS,
    GET_USER_REVIEWS,
} from "@/api/queries";
import { Review } from "@/types/__generated__/types";
import { usernameVar } from "@/utils/cache";
import { all_movies } from "./mock/util";

const mockMovie = {
    ...all_movies[18],
    reviews: [
        {
            _id: "1",
            username: "testuser1",
            rating: 4,
            comment: "Great movie!",
            date: new Date(),
            movie: {
                _id: 475557,
                title: "Joker",
                poster_path: "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
            },
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
                _id: 475557,
                vote_average: 4.2,
                vote_count: 6,
                reviews: [
                    ...mockMovie.reviews,
                    {
                        _id: "2",
                        username: "testuser",
                        rating: 5,
                        comment: "Excellent movie!",
                        date: new Date(),
                    },
                ],
            },
        },
    },
};

const mockLatestReviewsQuery = {
    request: {
        query: GET_LATEST_REVIEWS,
        variables: { skip: 0, limit: 20 },
    },
    result: {
        data: {
            latestReviews: [],
        },
    },
};

const mockUserReviewsQuery = {
    request: {
        query: GET_USER_REVIEWS,
        variables: { username: "testuser", skip: 0, limit: 20 },
    },
    result: {
        data: {
            userReviews: [],
        },
    },
};

const errorMock = {
    request: {
        query: ADD_REVIEW,
        variables: {
            movieId: 475557,
            username: "testuser",
            rating: 5,
            comment: "Excellent movie!",
        },
    },
    error: new Error("Failed to submit review"),
};

describe("MovieReviews", () => {
    it("renders existing reviews", async () => {
        render(
            <MockedProvider mocks={[]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        await waitFor(() => {
            expect(screen.getByText("Reviews")).toBeInTheDocument();
            expect(screen.getByText("Great movie!")).toBeInTheDocument();
            expect(screen.getByText("testuser1")).toBeInTheDocument();
        });
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

        const ratingStars = screen.getAllByRole("input");
        await userEvent.click(ratingStars[4]);

        expect(
            screen.getByRole("button", { name: "Submit Review" })
        ).toBeEnabled();
    });

    it("successfully submits a review", async () => {
        usernameVar("testuser");

        render(
            <MockedProvider
                mocks={[
                    mockAddReviewMutation,
                    mockLatestReviewsQuery,
                    mockUserReviewsQuery,
                ]}
                addTypename={false}
            >
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        const ratingStars = screen.getAllByRole("input");
        await userEvent.click(ratingStars[4]);
        await userEvent.type(
            screen.getByPlaceholderText("Write your review (optional)"),
            "Excellent movie!"
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Submit Review" })
        );

        await waitFor(() => {
            expect(screen.getByText("Excellent movie!")).toBeInTheDocument();
        });

        expect(
            screen.getByPlaceholderText("Write your review (optional)")
        ).toHaveValue("");
    });

    it("displays error message when review submission fails", async () => {
        usernameVar("testuser");

        render(
            <MockedProvider mocks={[errorMock]} addTypename={false}>
                <MovieReviews movie={mockMovie} />
            </MockedProvider>
        );

        const ratingStars = screen.getAllByRole("input");
        await userEvent.click(ratingStars[4]);
        await userEvent.type(
            screen.getByPlaceholderText("Write your review (optional)"),
            "Excellent movie!"
        );

        await userEvent.click(
            screen.getByRole("button", { name: "Submit Review" })
        );
        await waitFor(() => {
            expect(
                screen.getByText("Something went wrong when adding reviews")
            ).toBeInTheDocument();
            expect(screen.getByText("Try to refresh")).toBeInTheDocument();
        });
    });
});
