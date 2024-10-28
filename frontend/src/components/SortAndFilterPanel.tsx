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
import { useQuery, useReactiveVar } from "@apollo/client";
import { Filters, SortingType } from "@/types/__generated__/types";
import { GET_FILTERS } from "@/api/queries";

const SortAndFilterPanel: React.FC = () => {
    const filters = useReactiveVar(filtersVar);

    const { data, loading, error } = useQuery(GET_FILTERS);

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

        sessionStorage.setItem("sort_option", SortingType.NewestFirst);
        sortOptionVar(SortingType.NewestFirst);
    };

    const renderFilterSections = () => {
        return Object.entries(data?.filters as Filters).map(
            ([category, filter_list]) => {
                if (category === "__typename") {
                    return null;
                }
                const all_filters = filter_list as string[];
                const applied_filters = filters[category as keyof Filters] as
                    | string[]
                    | undefined;
                return (
                    <FilterSection
                        key={category}
                        category={category as keyof Filters}
                        all_filters={all_filters}
                        applied_filters={applied_filters ?? []}
                        updateFilters={updateFilters}
                    />
                );
            }
        );
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
                {!loading && !error && data?.filters && (
                    <section>
                        <Accordion type="single" collapsible className="w-full">
                            <SortSection />
                            {renderFilterSections()}
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
                )}
            </SheetContent>
        </Sheet>
    );
};

export default SortAndFilterPanel;
