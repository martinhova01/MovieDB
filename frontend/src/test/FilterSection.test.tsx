import { vi } from "vitest";
import { render, screen } from "@testing-library/react";
import FilterSection from "@/components/FilterSection";
import { FiltersInput } from "@/types/__generated__/types";
import { Accordion } from "@/shadcn/components/ui/accordion";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

vi.mock("@/utils/formatUtil", () => ({
    formatNumber: (n: number) => n.toLocaleString("no-NO"),
}));

const mockUpdateFilters = vi.fn();

const defaultProps = {
    category: "Genre" as keyof FiltersInput,
    all_filters: [
        { name: "Action", hits: 150 },
        { name: "Comedy", hits: 100 },
        { name: "Drama", hits: 120 },
        { name: "Sciende Fiction", hits: 0 },
        { name: "Thriller", hits: 90 },
    ],
    applied_filters: ["Action"],
    updateFilters: mockUpdateFilters,
    loading: false,
};

describe("FilterSection", () => {
    const renderFilterSection = async (props: {
        category: keyof FiltersInput;
        all_filters: { name: string; hits: number }[];
        applied_filters: string[];
        updateFilters: (category: keyof FiltersInput, filter: string) => void;
        loading: boolean;
    }) => {
        render(
            <Accordion type="single" collapsible className="w-full">
                <FilterSection {...props} />
            </Accordion>
        );

        await userEvent.click(screen.getByRole("button"));
    };

    it("renders the category name correctly", () => {
        renderFilterSection(defaultProps);
        expect(screen.getByText("Genre")).toBeInTheDocument();
    });

    it("shows the number of applied filters", () => {
        renderFilterSection(defaultProps);
        expect(screen.getByText("(1 applied)")).toBeInTheDocument();
    });

    it("does not show applied filters count when none are applied", () => {
        renderFilterSection({ ...defaultProps, applied_filters: [] });
        expect(screen.queryByText("(0 applied)")).not.toBeInTheDocument();
    });

    it("only renders filters with hits greater than 0", async () => {
        await renderFilterSection(defaultProps);

        expect(screen.getByText("Action")).toBeInTheDocument();
        expect(screen.getByText("Comedy")).toBeInTheDocument();
        expect(screen.getByText("Drama")).toBeInTheDocument();
        expect(screen.getByText("Thriller")).toBeInTheDocument();
        expect(screen.queryByText("Science Fiction")).not.toBeInTheDocument();
    });

    it("shows the correct number of hits for each filter", async () => {
        await renderFilterSection(defaultProps);

        expect(screen.getByText("(150)")).toBeInTheDocument();
        expect(screen.getByText("(100)")).toBeInTheDocument();
        expect(screen.getByText("(120)")).toBeInTheDocument();
        expect(screen.getByText("(90)")).toBeInTheDocument();
    });

    it("checks the checkbox only for applied filters", async () => {
        await renderFilterSection(defaultProps);

        const checkboxes = screen.getAllByRole("checkbox");
        checkboxes.forEach((checkbox) => {
            if (checkbox.id === "Action") {
                expect(checkbox).toBeChecked();
                return;
            }
            expect(checkbox).not.toBeChecked();
        });
    });

    it("calls updateFilters with correct arguments when checkbox is clicked", async () => {
        await renderFilterSection(defaultProps);

        const comedyCheckbox = screen.getByRole("checkbox", {
            name: /Comedy/,
        });
        await userEvent.click(comedyCheckbox);
        expect(mockUpdateFilters).toHaveBeenCalledWith("Genre", "Comedy");
    });

    it("disables checkboxes when loading is true", async () => {
        await renderFilterSection({ ...defaultProps, loading: true });

        const checkboxes = screen.getAllByRole("checkbox");
        checkboxes.forEach((checkbox) => {
            expect(checkbox).toBeDisabled();
        });
    });

    it("enables checkboxes when loading is false", async () => {
        await renderFilterSection(defaultProps);

        const checkboxes = screen.getAllByRole("checkbox");
        checkboxes.forEach((checkbox) => {
            expect(checkbox).not.toBeDisabled();
        });
    });
});
