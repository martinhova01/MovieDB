import { Button } from "../shadcn/components/ui/button";
import { Accordion } from "../shadcn/components/ui/accordion";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../shadcn/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import FilterSection from "./FilterSection";
import SortSection from "./SortSection";
import { all_filters, SortingType } from "../utils/sortAndFilter";

interface SortAndFilterPanelInterface {
    handleFilterChange: (
        filters: { [key: string]: string[] },
        sortOption: SortingType
    ) => void;
    handleSortChange: (sortOption: SortingType) => void;
}

const SortAndFilterPanel: React.FC<SortAndFilterPanelInterface> = ({
    handleFilterChange,
    handleSortChange,
}) => {
    const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
    const [sortOption, setSortOption] = useState<SortingType>(SortingType.NEWEST_FIRST);

    useEffect(() => {
        const storedFilters = sessionStorage.getItem("filters");
        const parsedFilters: { [key: string]: string[] } = storedFilters ? JSON.parse(storedFilters) : {};
        const storedSortOption = sessionStorage.getItem("sort_option")
        const parsedSortOption: SortingType = storedSortOption ? (storedSortOption as SortingType) : SortingType.NEWEST_FIRST;

        setFilters(parsedFilters);
        setSortOption(parsedSortOption);

        if (storedFilters) {
            handleFilterChange(parsedFilters, parsedSortOption);
        } else {
            handleSortChange(parsedSortOption);
        }

        // Ignoring the ESLint warning here because we want this to run only when
        // the component mounts to restore filters and sorting from sessionStorage.
        // Including `handleFilterChange` and `handleSortChange` would make this useEffect re-run
        // every time those functions change, which we don't want since this logic only is
        // for initial setup.

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const updateFilters = (category: string, filter: string) => {
        let newFilters: string[] = [...(filters[category] || [])];
        if (newFilters.includes(filter)) {
            newFilters = newFilters.filter((e) => e != filter);
        } else {
            newFilters.push(filter);
        }
        const updatedFilters = { ...filters, [category]: newFilters };
        sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
        setFilters(updatedFilters);
        handleFilterChange(updatedFilters, sortOption);
    };

    const updateSortOption = (option: SortingType) => {
        sessionStorage.setItem("sort_option", option);
        setSortOption(option);
        handleSortChange(option);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 gap-1 m-3">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Sort & Filter
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full overflow-y-auto">
                <SheetHeader className="mb-5">
                    <SheetTitle>Sort & Filter</SheetTitle>
                    <SheetDescription>
                        Use the tools below to refine your results
                    </SheetDescription>
                </SheetHeader>
                <Accordion type="single" collapsible className="w-full">
                    <SortSection
                        sortOption={sortOption}
                        sortOptions={Object.values(SortingType)}
                        updateSortOption={updateSortOption}
                    />
                    {Object.entries(all_filters).map(
                        ([category, filter_list]) => (
                            <FilterSection
                                key={category}
                                category={category}
                                all_filters={filter_list}
                                applied_filters={filters[category] ?? []}
                                updateFilters={updateFilters}
                            />
                        )
                    )}
                </Accordion>
                <SheetFooter className="mt-5">
                    <SheetClose asChild>
                        <Button type="submit">Apply</Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default SortAndFilterPanel;
