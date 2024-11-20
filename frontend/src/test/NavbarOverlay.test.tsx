import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { NavbarProps } from "@/components/Navbar";
import NavbarOverlay from "@/components/NavbarOverlay";

describe("NavbarOverlay", () => {
    it("successfully renders NavbarOverlay with links", async () => {
        const mockLinks: NavbarProps = [
            { name: "Home", href: "/" },
            { name: "About", href: "/about" },
            { name: "Contact", href: "/contact" },
        ];
        render(
            <MemoryRouter>
                <NavbarOverlay links={mockLinks} />
            </MemoryRouter>
        );

        expect(screen.getByText("Toggle navigation menu")).toBeInTheDocument();

        // Opens sheeet
        await userEvent.click(screen.getByText("Toggle navigation menu"));
        expect(screen.getByText("Home")).toBeInTheDocument();
        expect(screen.getByText("About")).toBeInTheDocument();
        expect(screen.getByText("Contact")).toBeInTheDocument();

        mockLinks.forEach((link) => {
            expect(screen.getByText(link.name)).toBeInTheDocument();
            expect(
                screen.getByRole("link", { name: link.name })
            ).toHaveAttribute("href", link.href);
        });

        // Closes sheet
        expect(screen.getByText("Close")).toBeInTheDocument();
        await userEvent.click(screen.getByText("Close"));
        expect(screen.queryByText("Home")).toBeNull();
        expect(screen.queryByText("About")).toBeNull();
        expect(screen.queryByText("Contact")).toBeNull();
    });

    // Does not happen in practice, but nice to check the component can still handle it
    it("successfully renders NavbarOverlay without links", async () => {
        const mockLinks: NavbarProps = [];
        render(
            <MemoryRouter>
                <NavbarOverlay links={mockLinks} />
            </MemoryRouter>
        );
        expect(screen.getByText("Toggle navigation menu")).toBeInTheDocument();
        await userEvent.click(screen.getByText("Toggle navigation menu"));
        expect(screen.getByText("Close")).toBeInTheDocument();
        await userEvent.click(screen.getByText("Close"));
        expect(screen.queryByText("Close")).toBeNull();
    });
});
