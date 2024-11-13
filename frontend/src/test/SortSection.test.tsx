import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { useReactiveVar } from "@apollo/client";
import { sortOptionVar } from "@/utils/cache";
import { SortingType } from "@/types/__generated__/types";
import SortSection from "@/components/SortSection";
import { Accordion } from "@/shadcn/components/ui/accordion";
import "@testing-library/jest-dom";

vi.mock("@apollo/client", () => ({
    ...vi.importActual("@apollo/client"),
    useReactiveVar: vi.fn(),
}));

vi.mock("@/utils/cache", () => ({
    sortOptionVar: vi.fn(),
}));

vi.mock("@/utils/sortOptionUtil", () => ({
    getSortOptionDisplayName: vi.fn((option) => `Display name ${option}`),
}));

describe("SortSection Component", () => {
    const mockSortOption = SortingType.MOST_POPULAR;
    const mockUpdateSortOption = vi.fn();

    const renderSortSection = (loading = false) => {
        return render(
            <Accordion type="single" collapsible className="w-full">
                <SortSection loading={loading} />
            </Accordion>
        );
    };

    beforeEach(() => {
        vi.mocked(useReactiveVar).mockReturnValue(mockSortOption);
        vi.mocked(sortOptionVar).mockImplementation(mockUpdateSortOption);
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it("renders with correct default sort option", () => {
        renderSortSection();

        expect(screen.getByText("Sort by")).toBeInTheDocument();
        expect(
            screen.getByText(`(Display name ${mockSortOption})`)
        ).toBeInTheDocument();
    });

    it("displays all sorting options when expanded", async () => {
        renderSortSection();
        await userEvent.click(screen.getByRole("button"));

        const radioButtons = screen.getAllByRole("radio");
        expect(radioButtons).toHaveLength(Object.values(SortingType).length);

        Object.values(SortingType).forEach((option) => {
            const radioLabel = screen.getByText(`Display name ${option}`);
            expect(radioLabel).toBeInTheDocument();
            expect(radioLabel).not.toBeDisabled();
        });
    });

    it("updates sort option on selection", async () => {
        renderSortSection();
        await userEvent.click(screen.getByRole("button"));

        const newOption = SortingType.NEWEST_FIRST;
        const radioLabel = screen.getByText(`Display name ${newOption}`);
        await userEvent.click(radioLabel);

        expect(mockUpdateSortOption).toHaveBeenCalledWith(newOption);
        expect(sessionStorage.getItem("sort_option")).toBe(newOption);
    });

    it("disables radio buttons when loading", async () => {
        renderSortSection(true);
        await userEvent.click(screen.getByRole("button"));

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            expect(radio).toBeDisabled();
        });
    });

    it("reflects initial sort option from sessionStorage", async () => {
        const initialSortOption = SortingType.BEST_RATED;
        vi.mocked(useReactiveVar).mockReturnValue(initialSortOption);
        sessionStorage.setItem("sort_option", initialSortOption);

        renderSortSection();
        await userEvent.click(screen.getByRole("button"));

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            if (radio.id === initialSortOption) {
                expect(radio).toBeChecked();
                return;
            }
            expect(radio).not.toBeChecked();
        });

        expect(
            screen.getByText(`(Display name ${initialSortOption})`)
        ).toBeInTheDocument();
    });
});
