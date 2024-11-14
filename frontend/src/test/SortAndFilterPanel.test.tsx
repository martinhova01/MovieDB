import { render, screen } from "@testing-library/react";
import { MockedProvider } from "@apollo/client/testing";
import SortAndFilterPanel from "@/components/SortAndFilterPanel";
import { GET_FILTERS } from "@/api/queries";
import {
    filtersVar,
    searchVar,
    sortOptionVar,
    totalHitsVar,
} from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import { SortingType } from "@/types/__generated__/types";
import "@testing-library/jest-dom";

vi.mock("@/utils/cache", () => ({
    filtersVar: vi.fn(),
    searchVar: vi.fn(),
    sortOptionVar: vi.fn(),
    totalHitsVar: vi.fn(),
}));

vi.mock("@apollo/client", async () => {
    const original = await vi.importActual("@apollo/client");
    return {
        ...original,
        useReactiveVar: vi.fn(),
    };
});

const mockGetFiltersQuery = [
    {
        request: {
            query: GET_FILTERS,
            variables: {
                appliedFilters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                },
                search: "",
            },
        },
        result: {
            data: {
                filters: {
                    Genre: [{ name: "Action", hits: 5 }],
                    Rating: [{ name: "4", hits: 10 }],
                    Decade: [{ name: "2010s", hits: 12 }],
                    Status: [{ name: "Released", hits: 15 }],
                    Runtime: [{ name: "1 - 2 hours", hits: 6 }],
                },
            },
        },
    },
    {
        request: {
            query: GET_FILTERS,
            variables: {
                appliedFilters: {
                    Genre: ["Action"],
                    Rating: ["5"],
                    Decade: ["2010s"],
                    Status: ["Released"],
                    Runtime: ["1 - 2 hours"],
                },
                search: "",
            },
        },
        result: {
            data: {
                filters: {
                    Genre: [{ name: "Action", hits: 5 }],
                    Rating: [{ name: "4", hits: 10 }],
                    Decade: [{ name: "2010s", hits: 12 }],
                    Status: [{ name: "Released", hits: 15 }],
                    Runtime: [{ name: "1 - 2 hours", hits: 6 }],
                },
            },
        },
    },
];

const errorMock = [
    {
        request: {
            query: GET_FILTERS,
            variables: {
                appliedFilters: {
                    Genre: [],
                    Rating: [],
                    Decade: [],
                    Status: [],
                    Runtime: [],
                },
                search: "",
            },
        },
        error: new Error("Query error"),
    },
];

describe("SortAndFilterPanel", () => {
    beforeEach(() => {
        vi.mocked(filtersVar).mockReturnValue({
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        });
        vi.mocked(searchVar).mockReturnValue("");
        vi.mocked(sortOptionVar).mockReturnValue(SortingType.MOST_POPULAR);
        vi.mocked(totalHitsVar).mockReturnValue(50);
        vi.mocked(useReactiveVar).mockImplementation((varFn) => varFn());
    });

    afterEach(() => {
        vi.clearAllMocks();
        sessionStorage.clear();
    });

    it("renders Sort & Filter button", () => {
        render(
            <MockedProvider mocks={mockGetFiltersQuery} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );
        expect(
            screen.getByRole("button", { name: /Sort & Filter/i })
        ).toBeInTheDocument();
    });

    /*
    it("opens the panel and displays loading state", async () => {
        render(
            <MockedProvider mocks={mockGetFiltersQuery} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );

        userEvent.click(screen.getByRole("button", { name: /Sort & Filter/i }));

        expect(screen.getByText("Updating filters...")).toBeInTheDocument();
    });
    */

    it("displays filter sections and Clear All button", async () => {
        render(
            <MockedProvider mocks={mockGetFiltersQuery} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /Sort & Filter/i })
        );

        expect(screen.getByText(/Genre/i)).toBeInTheDocument();
        expect(screen.getByText(/Rating/i)).toBeInTheDocument();
        expect(screen.getByText(/Decade/i)).toBeInTheDocument();
        expect(screen.getByText(/Status/i)).toBeInTheDocument();
        expect(screen.getByText(/Runtime/i)).toBeInTheDocument();

        expect(screen.getByText(/Clear All/i)).toBeInTheDocument();
    });

    it("adds filter when an option is clicked", async () => {
        render(
            <MockedProvider mocks={mockGetFiltersQuery} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /Sort & Filter/i })
        );

        await userEvent.click(screen.getByRole("button", { name: /Genre/i }));

        await userEvent.click(
            screen.getByRole("checkbox", { name: /Action/i })
        );
        expect(filtersVar).toHaveBeenCalledWith(
            expect.objectContaining({
                Genre: expect.arrayContaining(["Action"]),
            })
        );
    });

    it("removes filter when an option is clicked", async () => {
        vi.mocked(filtersVar).mockReturnValue({
            Genre: ["Action"],
            Rating: ["5"],
            Decade: ["2010s"],
            Status: ["Released"],
            Runtime: ["1 - 2 hours"],
        });

        render(
            <MockedProvider mocks={mockGetFiltersQuery} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /Sort & Filter/i })
        );

        await userEvent.click(screen.getByRole("button", { name: /Genre/i }));

        await userEvent.click(
            screen.getByRole("checkbox", { name: /Action/i })
        );

        expect(filtersVar).toHaveBeenCalledWith(
            expect.objectContaining({
                Genre: expect.not.arrayContaining(["Action"]),
            })
        );
    });

    it("clears all filters when Clear All button is clicked", async () => {
        vi.mocked(filtersVar).mockReturnValue({
            Genre: ["Action"],
            Rating: ["5"],
            Decade: ["2010s"],
            Status: ["Released"],
            Runtime: ["1 - 2 hours"],
        });

        render(
            <MockedProvider mocks={mockGetFiltersQuery} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /Sort & Filter/i })
        );

        await userEvent.click(screen.getByText(/Clear All/i));

        expect(filtersVar).toHaveBeenCalledWith({
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        });
        expect(sortOptionVar).toHaveBeenCalledWith(SortingType.MOST_POPULAR);
    });

    it("displays an error message if query fails", async () => {
        render(
            <MockedProvider mocks={errorMock} addTypename={false}>
                <SortAndFilterPanel />
            </MockedProvider>
        );

        await userEvent.click(
            screen.getByRole("button", { name: /Sort & Filter/i })
        );

        expect(screen.getByText(/Something went wrong!/i)).toBeInTheDocument();
        expect(screen.getByText(/Try to refresh/i)).toBeInTheDocument();
    });
});
