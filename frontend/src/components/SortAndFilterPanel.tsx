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
import FilterSection from "./FilterSection";
import SortSection from "./SortSection";
import { all_filters, SortingType } from "../utils/searchSortAndFilter";
import { filtersVar, sortOptionVar } from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";

const SortAndFilterPanel: React.FC = () => {
    const filters = useReactiveVar(filtersVar);

    const updateFilters = (category: string, filter: string) => {
        let newFilters: string[] = [...(filters[category] || [])];
        if (newFilters.includes(filter)) {
            newFilters = newFilters.filter((e) => e != filter);
        } else {
            newFilters.push(filter);
        }
        const updatedFilters = { ...filters, [category]: newFilters };
        sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
        filtersVar(updatedFilters);
    };

    const clearAll = () => {
        sessionStorage.setItem("filters", JSON.stringify({}));
        sessionStorage.setItem("sort_option", SortingType.NEWEST_FIRST);
        filtersVar({});
        sortOptionVar(SortingType.NEWEST_FIRST);
    };

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="outline" size="default" className="space-x-2">
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
                    <SortSection />
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
                    <Button type="reset" onClick={clearAll}>
                        Clear All
                    </Button>
                    <SheetClose asChild>
                        <Button type="submit" className="mb-2">
                            Apply
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
};

export default SortAndFilterPanel;
