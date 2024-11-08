import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MovieCardDetailed from "../components/MovieCardDetailed";
import { all_movies } from "./mock/util";
import { getImageUrl, ImageType } from "@/utils/imageUrl/imageUrl";

const mockMovie = all_movies[18]; // Joker

describe("MovieCardDetailed", () => {
    it("displays movie title, release year, runtime and genres", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(await screen.findByText("Joker")).toBeInTheDocument();
        expect(
            await screen.findByText("2019 • 2h 2m • Crime, Thriller, Drama")
        ).toBeInTheDocument();
    });

    it("does not display genres if there are none", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    genres: [],
                }}
            />
        );
        expect(await screen.findByText("2019 • 2h 2m")).toBeInTheDocument();
    });

    it("displays movie rating", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(await screen.findByTitle("4.08")).toBeInTheDocument();
    });

    it("displays movie poster", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);

        const poster = await screen.findByAltText("Poster of Joker");
        expect(poster).toBeInTheDocument();

        const expectedPosterUrl = getImageUrl(
            ImageType.POSTER,
            mockMovie.poster_path,
            "w500"
        );
        expect(poster).toHaveAttribute("src", expectedPosterUrl);
    });

    it("displays deafult poster when poster path is missing", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    poster_path: null,
                }}
            />
        );

        const poster = await screen.findByAltText("Poster of Joker");
        expect(poster).toBeInTheDocument();

        const defaultPosterUrl = getImageUrl(ImageType.POSTER, null, "w500");
        expect(poster).toHaveAttribute("src", defaultPosterUrl);
    });

    it("displays movie tagline and overview", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(
            await screen.findByText("Put on a happy face.")
        ).toBeInTheDocument();
        expect(await screen.findByText(mockMovie.overview)).toBeInTheDocument();
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

    it("displays movie details", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        expect(await screen.findByText("Released")).toBeInTheDocument();
        expect(await screen.findByText("$55 000 000")).toBeInTheDocument();
        expect(await screen.findByText("$1 074 458 282")).toBeInTheDocument();
        expect(
            await screen.findByText(
                "Warner Bros. Pictures, Joint Effort, Village Roadshow Pictures, Bron Studios, DC Films"
            )
        ).toBeInTheDocument();
        expect(
            await screen.findByText("Canada, United States of America")
        ).toBeInTheDocument();
        expect(await screen.findByText("English")).toBeInTheDocument();
    });

    it("displays N/A if budget is 0", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    budget: 0,
                }}
            />
        );
        expect(await screen.findByText("N/A")).toBeInTheDocument();
    });

    it("displays N/A if revenue is 0", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    revenue: 0,
                }}
            />
        );
        expect(await screen.findByText("N/A")).toBeInTheDocument();
    });

    it("displays N/A if there are no production companies", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    production_companies: [],
                }}
            />
        );
        expect(await screen.findByText("N/A")).toBeInTheDocument();
    });

    it("displays N/A if there are no production countries", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    production_countries: [],
                }}
            />
        );
        expect(await screen.findByText("N/A")).toBeInTheDocument();
    });

    it("displays N/A if there are no spoken languages", async () => {
        render(
            <MovieCardDetailed
                movie={{
                    ...mockMovie,
                    spoken_languages: [],
                }}
            />
        );
        expect(await screen.findByText("N/A")).toBeInTheDocument();
    });

    it("displays 'Visit Homepage' button with link", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);
        const homepageButton = await screen.findByRole("link", {
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

    it("renders background image correctly", async () => {
        render(<MovieCardDetailed movie={mockMovie} />);

        const backdropUrl = getImageUrl(
            ImageType.BACKDROP,
            mockMovie.backdrop_path
        );
        const detailedMovieCard =
            await screen.findByTestId("detailedMovieCard");
        expect(detailedMovieCard).toHaveStyle(
            `background-image: url(${backdropUrl})`
        );
    });

    it("handles missing backdrop path", async () => {
        render(
            <MovieCardDetailed movie={{ ...mockMovie, backdrop_path: null }} />
        );

        const backdropUrl = getImageUrl(ImageType.BACKDROP, null);
        const detailedMovieCard =
            await screen.findByTestId("detailedMovieCard");
        expect(detailedMovieCard).toHaveStyle(
            `background-image: url(${backdropUrl})`
        );
    });
});
