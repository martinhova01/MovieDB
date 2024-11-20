import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import Navbar from "@/components/Navbar";

describe("Navbar", () => {
    it("successfully renders Navbar", async () => {
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

        expect(screen.getByText("Guest")).toBeInTheDocument();
        expect(screen.getByText("Toggle navigation menu")).toBeInTheDocument();
    });

    it("successfully shows 'My Reviews' only for logged in users (not Guests)", async () => {
        render(
            <MemoryRouter>
                <Navbar />
            </MemoryRouter>
        );

        expect(screen.queryByText("My Reviews")).toBeNull();

        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Change username"));

        const input = screen.getByPlaceholderText("Enter new username");
        const newUsername = "TestUser";
        await userEvent.type(input, newUsername);
        await userEvent.click(
            screen.getByRole("button", { name: "Change username" })
        );
        expect(screen.getByText("My Reviews")).toBeInTheDocument();
        expect(screen.getByText("My Reviews")).toHaveAttribute(
            "href",
            "/myReviews"
        );

        await userEvent.click(screen.getByText("TestUser"));
        await userEvent.click(screen.getByText("Sign out"));
        expect(screen.queryByText("My Reviews")).toBeNull();
    });
});
