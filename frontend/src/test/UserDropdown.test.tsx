import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import UserDropdown from "@/components/UserDropdown";
import { vi } from "vitest";
import { validateUsername } from "@/utils/userInputValidation";

vi.mock("@/utils/userInputValidation", () => ({
    validateUsername: vi.fn(),
}));

describe("UserDropdown", () => {
    beforeEach(() => {
        vi.mocked(validateUsername).mockReturnValue(true);
    });

    afterEach(() => {
        vi.clearAllMocks();
        localStorage.clear();
    });

    it("matches snapshot", () => {
        const { asFragment } = render(<UserDropdown />);
        expect(asFragment()).toMatchSnapshot();
    });

    it("successfully renders UserDropdown", async () => {
        render(<UserDropdown />);
        expect(screen.getByText("Guest")).toBeInTheDocument();
    });

    it("successfully opens UserDropdown", async () => {
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        expect(screen.getByText("My Account")).toBeInTheDocument();
        expect(screen.getAllByText("Guest")).toHaveLength(2); // In dropdown button and menu
        expect(screen.getByText("Change username")).toBeInTheDocument();
        expect(screen.getByText("Sign out")).toBeInTheDocument();
    });

    it("successfully closes dropdown on sign out as guest", async () => {
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Sign out"));
        expect(screen.queryByText("My Account")).toBeNull();
    });

    it("successfully opens dialog on change username", async () => {
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Change username"));
        expect(screen.getByText("New username")).toBeInTheDocument();
    });

    it("successfully changes username and signs out", async () => {
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Change username"));

        const input = screen.getByPlaceholderText("Enter new username");
        const newUsername = "TestUser";
        await userEvent.type(input, newUsername);
        await userEvent.click(
            screen.getByRole("button", { name: "Change username" })
        );

        expect(screen.queryByText("New username")).toBeNull(); // Should close dialog
        expect(screen.queryByText("My Account")).toBeNull(); // Should close menu
        expect(screen.getByText(newUsername)).toBeInTheDocument(); // In dropdown button

        await userEvent.click(screen.getByText("TestUser"));
        await userEvent.click(screen.getByText("Sign out"));
        expect(screen.getByText("Guest")).toBeInTheDocument();
        expect(screen.queryByText("My Account")).toBeNull();
    });

    it("successfully handles enter click for username change", async () => {
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Change username"));

        const input = screen.getByPlaceholderText("Enter new username");
        const newUsername = "TestUser";
        await userEvent.type(input, `${newUsername}{enter}`);

        expect(screen.queryByText("New username")).toBeNull(); // Should close dialog
        expect(screen.queryByText("My Account")).toBeNull(); // Should close menu
        expect(screen.getByText(newUsername)).toBeInTheDocument(); // In dropdown button

        await userEvent.click(screen.getByText("TestUser"));
        await userEvent.click(screen.getByText("Sign out"));
    });

    it("successfully handles empty string as new username", async () => {
        vi.mocked(validateUsername).mockReturnValue(false);
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Change username"));

        const input = screen.getByPlaceholderText("Enter new username");
        const newUsername = "";
        await userEvent.type(input, `${newUsername}{enter}`);

        expect(screen.getByText("New username")).toBeInTheDocument(); // Should not close dialog
    });

    it("successfully clears new username string", async () => {
        render(<UserDropdown />);
        await userEvent.click(screen.getByText("Guest"));
        await userEvent.click(screen.getByText("Change username"));

        const input = screen.getByPlaceholderText("Enter new username");
        const newUsername = "TestUser";
        await userEvent.type(input, newUsername);
        await userEvent.click(screen.getByText("Close"));

        expect(screen.queryByText("New username")).toBeNull(); // Should close dialog
        await userEvent.click(screen.getByText("Change username"));
        expect(screen.queryByText("TestUser")).toBeNull();
    });
});
