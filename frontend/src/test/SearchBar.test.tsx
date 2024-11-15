import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { searchVar } from "@/utils/cache";
import SearchBar from "@/components/SearchBar";
import { vi } from "vitest";
import "@testing-library/jest-dom";

vi.mock("@/utils/cache", () => ({
    searchVar: vi.fn(),
}));

describe("SearchBar", () => {
    afterEach(() => {
        sessionStorage.clear();
    });

    it("renders the search input", () => {
        render(<SearchBar />);

        expect(screen.getByRole("searchbox")).toBeInTheDocument();
    });

    it("updates searchVar and sessionStorage when typing in the input field", async () => {
        render(<SearchBar />);

        const input = screen.getByRole("searchbox");
        await userEvent.type(input, "Inception");
        await new Promise((r) => setTimeout(r, 520));

        expect(searchVar).toHaveBeenCalledWith("Inception");
        expect(sessionStorage.getItem("search")).toBe("Inception");
    });

    it("trims input before setting searchVar and sessionStorage", async () => {
        render(<SearchBar />);

        const input = screen.getByRole("searchbox");
        await userEvent.type(input, " Inception   ");
        await new Promise((r) => setTimeout(r, 520));

        expect(searchVar).toHaveBeenCalledWith("Inception");
        expect(sessionStorage.getItem("search")).toBe("Inception");
    });

    it("flushes debounce and triggers search on Enter key", async () => {
        render(<SearchBar />);

        const input = screen.getByRole("searchbox");
        await userEvent.type(input, "Interstellar{enter}");

        expect(searchVar).toHaveBeenCalledWith("Interstellar");
        expect(sessionStorage.getItem("search")).toBe("Interstellar");
    });

    it("loads the initial search value from sessionStorage", () => {
        sessionStorage.setItem("search", "Avatar");

        render(<SearchBar />);

        expect(screen.getByRole("searchbox")).toHaveValue("Avatar");
    });

    it("clears search on empty input", async () => {
        render(<SearchBar />);

        const input = screen.getByRole("searchbox");
        await userEvent.type(input, "Dunkirk");
        await new Promise((r) => setTimeout(r, 520));

        await userEvent.clear(input);
        await new Promise((r) => setTimeout(r, 520));

        expect(searchVar).toHaveBeenCalledWith("");
        expect(sessionStorage.getItem("search")).toBe("");
    });
});
