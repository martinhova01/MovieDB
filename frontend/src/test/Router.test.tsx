import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routerConfig from "@/utils/routerConfig";
import userEvent from "@testing-library/user-event";

describe("Router", () => {
    it("successfully renders Navbar", async () => {
        const router = createMemoryRouter(routerConfig);
        render(<RouterProvider router={router} />);
        expect(await screen.findByText("MovieDB")).toBeInTheDocument();
    });

    it("successfully renders Home Page", async () => {
        const router = createMemoryRouter(routerConfig);
        render(<RouterProvider router={router} />);

        //We will need to mock the movies here when backend is used.
        expect(await screen.findByAltText("Joker")).toBeInTheDocument();
    });

    it("successfully renders MovieDetailPage", async () => {
        const router = createMemoryRouter(routerConfig);
        render(<RouterProvider router={router} />);

        //We will need to mock the movies here when backend is used.
        userEvent.click(await screen.findByAltText("Joker"));
        expect(
            await screen.findByText("Put on a happy face.")
        ).toBeInTheDocument();
    });

    it("successfully renders NotFoundPage", async () => {
        const entries = ["/invalidPath"];
        const router = createMemoryRouter(routerConfig, {
            initialEntries: entries,
        });
        render(<RouterProvider router={router} />);
        expect(await screen.findByText("404 - Not Found")).toBeInTheDocument();
    });
});
