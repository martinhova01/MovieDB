import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import MovieCard from "@/components/MovieCard";
import { MoviePoster } from "@/types/movieTypes";
import { getImageUrl, ImageType } from "@/utils/imageUrl/imageUrl";
import { all_movies } from "./mock/util";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/utils/imageUrl/imageUrl", () => ({
    getImageUrl: vi.fn(),
    ImageType: {
        POSTER: "poster",
    },
}));

const mockMovie = all_movies[18] as MoviePoster; // Joker

describe("MovieCard", () => {
    const renderMovieCard = () => {
        render(
            <MemoryRouter>
                <MovieCard movie={mockMovie} />
            </MemoryRouter>
        );
    };

    afterEach(() => {
        vi.clearAllMocks();
    });

    it("matches snapshot", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <MovieCard movie={mockMovie} />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("renders movie card with correct link", () => {
        renderMovieCard();

        expect(screen.getByRole("link")).toHaveAttribute(
            "href",
            "/movie/475557"
        );
    });

    it("renders movie poster with correct attributes", () => {
        vi.mocked(getImageUrl).mockReturnValue("mocked-image-url");

        renderMovieCard();

        const image = screen.getByRole("img");
        expect(image).toHaveAttribute("src", "mocked-image-url");
        expect(image).toHaveAttribute("alt", "Joker");
        expect(image).toHaveAttribute("title", "Joker");

        expect(getImageUrl).toHaveBeenCalledWith(
            ImageType.POSTER,
            "/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg",
            "w342"
        );
    });

    it("displays correct release year and runtime", () => {
        render(
            <MemoryRouter>
                <MovieCard movie={mockMovie} />
            </MemoryRouter>
        );

        expect(screen.getByText("2019")).toBeInTheDocument();
        expect(screen.getByText("2h 2m")).toBeInTheDocument();
    });

    it("renders rating component with correct value", () => {
        renderMovieCard();

        expect(screen.getByTitle("4.08")).toBeInTheDocument();
    });

    it("handles missing poster path", () => {
        const movieWithoutPoster = {
            ...mockMovie,
            poster_path: "",
        };

        render(
            <MemoryRouter>
                <MovieCard movie={movieWithoutPoster} />
            </MemoryRouter>
        );

        expect(getImageUrl).toHaveBeenCalledWith(ImageType.POSTER, "", "w342");
    });
});
