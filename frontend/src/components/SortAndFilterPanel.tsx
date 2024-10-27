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
import { filtersVar, sortOptionVar } from "@/utils/cache";
import { gql, useQuery, useReactiveVar } from "@apollo/client";
import { Filters, SortingType } from "@/types/movieTypes";

const GET_FILTERS = gql`
    query GetFilters {
        filters {
            Genre
            Rating
            Decade
            Status
            Runtime
        }
    }
`;

interface GetFiltersQueryResult {
    filters: Filters
}

const SortAndFilterPanel: React.FC = () => {
    const filters = useReactiveVar(filtersVar);

    const { data, loading, error } = useQuery<GetFiltersQueryResult>(GET_FILTERS);

    const updateFilters = (category: keyof Filters, filter: string) => {
        let newFilters: string[] = [...(filters[category] || [])];
        if (newFilters.includes(filter)) {
            newFilters = newFilters.filter((e) => e != filter);
        } else {
            newFilters.push(filter);
        }
        const updatedFilters: Filters = { ...filters, [category]: newFilters };
        sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
        filtersVar(updatedFilters);
    };

    const clearAll = () => {
        const emptyFilters: Filters = {
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        };
        sessionStorage.setItem("filters", JSON.stringify(emptyFilters));
        filtersVar(emptyFilters);

        sessionStorage.setItem("sort_option", SortingType.NEWEST_FIRST);
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
                {loading && (
                    <section className="text-center">
                        <p>Loading...</p>
                    </section>
                )}
                {error && (
                    <section className="text-center">
                        <p>Something went wrong!</p>
                        <p className="text-primary">Try to refresh</p>
                    </section>
                )}
                {!loading && !error && data && 
                    <section>
                        <Accordion type="single" collapsible className="w-full">
                            <SortSection />
                            {(Object.entries(data.filters) as [keyof Filters, string[]][]).map(
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
                    </section>
                }
            </SheetContent>
        </Sheet>
    );
};

export default SortAndFilterPanel;
