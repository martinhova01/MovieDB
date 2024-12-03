import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { vi } from "vitest";
import { usernameVar } from "@/utils/cache";

vi.mock("../components/UserDropdown", () => ({
    default: vi.fn(() => <div data-testid="user-dropdown" />),
}));

vi.mock("../components/NavbarOverlay", () => ({
    default: vi.fn(() => <div data-testid="navbar-overlay" />),
}));

vi.mock("@/utils/cache", () => ({
    usernameVar: vi.fn(),
}));

vi.mock("@apollo/client", async () => {
    const original = await vi.importActual("@apollo/client");
    return {
        ...original,
        useReactiveVar: vi.fn().mockImplementation((varFn) => varFn()),
    };
});

describe("Navbar", () => {
    it("matches snapshot for default Navbar", () => {
        const { asFragment } = render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );
        expect(asFragment()).toMatchSnapshot();
    });

    it("successfully renders Navbar", async () => {
        vi.mocked(usernameVar).mockReturnValue("Guest");
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByAltText("logo")).toBeInTheDocument();
        expect(screen.getByText("MovieDB")).toBeInTheDocument();
        expect(screen.getByText("MovieDB")).toHaveAttribute("href", "/");

        expect(screen.getByText("Activity")).toBeInTheDocument();
        expect(screen.getByText("Activity")).toHaveAttribute(
            "href",
            "/activity"
        );

        expect(screen.queryByText("My Reviews")).toBeNull();

        expect(screen.getByTestId("user-dropdown")).toBeInTheDocument();
        expect(screen.getByTestId("navbar-overlay")).toBeInTheDocument();
    });

    it("shows 'My Reviews' for logged in users", async () => {
        vi.mocked(usernameVar).mockReturnValue("test_user");
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.getByText("My Reviews")).toBeInTheDocument();
        expect(screen.getByText("My Reviews")).toHaveAttribute(
            "href",
            "/myReviews"
        );
    });
});
