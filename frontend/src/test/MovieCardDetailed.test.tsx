import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieCardDetailed from "../components/MovieCardDetailed";
import { all_movies } from "./mock/util";
import { vi } from "vitest";

vi.mock("@/utils/formatUtil", () => ({
    formatCurrency: (value: number) =>
        value.toLocaleString("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
        }),
}));

vi.mock("@/utils/imageUrl/imageUrl", () => ({
    ImageType: {
        POSTER: "poster",
        BACKDROP: "backdrop",
    },
    getImageUrl: vi.fn((type, path, size) => {
        return type === "poster"
            ? `mocked_poster_url/${size}${path}`
            : `mocked_backdrop_url/original${path}`;
    }),
}));

const mockMovie = all_movies[18]; // Joker

describe("MovieCardDetailed", () => {
    it("displays movie title, release year, runtime and genres", () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(screen.getByText("Joker")).toBeInTheDocument();
        expect(
            screen.getByText("2019 • 2h 2m • Crime, Thriller, Drama")
        ).toBeInTheDocument();
    });

    it("does not display genres if there are none", () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    genres: [],
                }}
            />
        );
        expect(screen.getByText("2019 • 2h 2m")).toBeInTheDocument();
    });

    it("displays movie rating", () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(screen.getByTitle("4.08")).toBeInTheDocument();
    });

    it("displays movie poster", () => {
        render(<MovieCardDetailed movie={mockMovie} />);

        const poster = screen.getByAltText("Poster of Joker");
        expect(poster).toBeInTheDocument();

        expect(poster).toHaveAttribute(
            "src",
            "mocked_poster_url/w500/udDclJoHjfjb8Ekgsd4FDteOkCU.jpg"
        );
    });

    it("displays movie tagline and overview", () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(screen.getByText("Put on a happy face.")).toBeInTheDocument();
        expect(screen.getByText(mockMovie.overview)).toBeInTheDocument();
    });

    it("does not display movie tagline if it is missing", () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    tagline: null,
                }}
            />
        );
        expect(
            screen.queryByText("Put on a happy face.")
        ).not.toBeInTheDocument();
    });

    it("displays movie details", () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(screen.getByText("Released")).toBeInTheDocument();
        expect(screen.getByText("$55,000,000")).toBeInTheDocument();
        expect(screen.getByText("$1,074,458,282")).toBeInTheDocument();
        expect(
            screen.getByText(
                "Warner Bros. Pictures, Joint Effort, Village Roadshow Pictures, Bron Studios, DC Films"
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText("Canada, United States of America")
        ).toBeInTheDocument();
        expect(screen.getByText("English")).toBeInTheDocument();
    });

    it("displays N/A for missing fields", () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    budget: 0,
                    revenue: 0,
                    production_companies: [],
                    production_countries: [],
                    spoken_languages: [],
                }}
            />
        );
        expect(screen.getAllByText("N/A")).toHaveLength(5);
    });

    it("displays 'Visit Homepage' button with link", () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        const homepageButton = screen.getByRole("link", {
            name: "Visit Homepage",
        });
        expect(homepageButton).toBeInTheDocument();
        expect(homepageButton).toHaveAttribute("href", mockMovie.homepage);
    });

    it("does not display 'Visit Homepage' button if homepage is missing", () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    homepage: null,
                }}
            />
        );
        const homepageButton = screen.queryByRole("link", {
            name: "Visit Homepage",
        });
        expect(homepageButton).not.toBeInTheDocument();
    });

    it("renders background image correctly", () => {
        render(<MovieCardDetailed movie={mockMovie} />);

        expect(screen.getByTestId("detailedMovieCard")).toHaveStyle(
            `background-image: url(mocked_backdrop_url/original/hO7KbdvGOtDdeg0W4Y5nKEHeDDh.jpg)`
        );
    });
});
