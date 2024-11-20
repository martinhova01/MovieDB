import "@testing-library/jest-dom";
import { render, screen } from "@testing-library/react";
import HomePage from "../pages/HomePage";
import { vi } from "vitest";

vi.mock("../components/SortAndFilterPanel", () => ({
    default: vi.fn(() => <div data-testid="sort-and-filter-panel" />),
}));

vi.mock("../components/SearchBar", () => ({
    default: vi.fn(() => <div data-testid="search-bar" />),
}));

vi.mock("../components/MovieList", () => ({
    default: vi.fn(() => <div data-testid="movie-list" />),
}));

describe("HomePage Snapshots", () => {
    it("matches snapshot", () => {
        const { asFragment } = render(<HomePage />);
        expect(asFragment()).toMatchSnapshot();
    });
});

describe("HomePage", () => {
    it("renders SortAndFilterPanel, SearchBar, and MovieList", () => {
        render(<HomePage />);

        const sortAndFilterPanel = screen.getByTestId("sort-and-filter-panel");
        const searchBar = screen.getByTestId("search-bar");
        const movieList = screen.getByTestId("movie-list");

        expect(sortAndFilterPanel).toBeInTheDocument();
        expect(searchBar).toBeInTheDocument();
        expect(movieList).toBeInTheDocument();
    });
});
