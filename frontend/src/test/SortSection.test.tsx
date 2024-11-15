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

const mockDefaultSortOption = SortingType.MOST_POPULAR;

describe("SortSection", () => {
    const renderSortSection = async (loading = false) => {
        render(
            <Accordion type="single" collapsible className="w-full">
                <SortSection loading={loading} />
            </Accordion>
        );
        await userEvent.click(screen.getByRole("button"));
    };

    beforeEach(() => {
        vi.mocked(sortOptionVar).mockReturnValue(mockDefaultSortOption);
        vi.mocked(useReactiveVar).mockImplementation((varFn) => varFn());
    });

    afterEach(() => {
        sessionStorage.clear();
        vi.clearAllMocks();
    });

    it("renders with correct default sort option", () => {
        renderSortSection();

        expect(screen.getByText("Sort by")).toBeInTheDocument();
        expect(
            screen.getByText(`(Display name ${mockDefaultSortOption})`)
        ).toBeInTheDocument();
    });

    it("displays all sorting options when expanded", async () => {
        await renderSortSection();

        const radioButtons = screen.getAllByRole("radio");
        expect(radioButtons).toHaveLength(Object.values(SortingType).length);
        Object.values(SortingType).forEach((option) => {
            const radioLabel = screen.getByText(`Display name ${option}`);
            expect(radioLabel).toBeInTheDocument();
            expect(radioLabel).not.toBeDisabled();
        });
    });

    it("updates sort option on selection", async () => {
        await renderSortSection();

        const newOption = SortingType.NEWEST_FIRST;
        const radioLabel = screen.getByText(`Display name ${newOption}`);
        await userEvent.click(radioLabel);

        expect(sortOptionVar).toHaveBeenCalledWith(newOption);
        expect(sessionStorage.getItem("sort_option")).toBe(newOption);
    });

    it("disables radio buttons when loading", async () => {
        await renderSortSection(true);

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            expect(radio).toBeDisabled();
        });
    });

    it("reflects initial sort option from sessionStorage", async () => {
        const initialSortOption = SortingType.BEST_RATED;
        vi.mocked(useReactiveVar).mockReturnValue(initialSortOption);
        sessionStorage.setItem("sort_option", initialSortOption);

        await renderSortSection();

        const radioButtons = screen.getAllByRole("radio");
        radioButtons.forEach((radio) => {
            if (radio.id === initialSortOption) {
                expect(radio).toBeChecked();
                return;
            }
            expect(radio).not.toBeChecked();
        });
    });
});
