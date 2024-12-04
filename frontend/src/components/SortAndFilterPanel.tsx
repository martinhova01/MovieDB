import { Button } from "../shadcn/components/ui/button";
import { Accordion } from "../shadcn/components/ui/accordion";
import {
    Sheet,
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
import {
    filtersVar,
    searchVar,
    sortOptionVar,
    totalHitsVar,
} from "@/utils/cache";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Filter, Filters, FiltersInput } from "@/types/__generated__/types";
import { GET_FILTERS } from "@/api/queries";
import { defaultSortOption } from "@/utils/sortOptionUtil";
import Loader from "./Loader";
import { useState } from "react";

const SortAndFilterPanel: React.FC = () => {
    const filters = useReactiveVar(filtersVar);
    const search = useReactiveVar(searchVar);
    const [fetchedFilters, setFetchedFilters] = useState<Filters>({
        Genre: [],
        Rating: [],
        Decade: [],
        Status: [],
        Runtime: [],
    });

    const { loading, error } = useQuery(GET_FILTERS, {
        variables: {
            appliedFilters: filters,
            search: search,
        },
        onCompleted: (data) => {
            let totalHits: number;
            // Find the total number of hits
            if (filtersVar().Status.length == 0) {
                // Since Status is union based, we can sum all its hits when no Status is applied
                totalHits = data.filters.Status.map(
                    (s: Filter) => s.hits
                ).reduce((acc, curr) => acc + curr, 0);
            } else {
                // Otherwise, sum only the hits of the applied Status filters
                totalHits = data.filters.Status.filter((s: Filter) =>
                    filtersVar().Status.includes(s.name)
                )
                    .map((s: Filter) => s.hits)
                    .reduce((acc, curr) => acc + curr, 0);
            }
            totalHitsVar(totalHits);

            setFetchedFilters(data.filters);
        },
    });

    const updateFilters = (category: keyof FiltersInput, filter: string) => {
        let newFilters: string[] = [...(filters[category] || [])];
        if (newFilters.includes(filter)) {
            // If the filter is already applied, remove it
            newFilters = newFilters.filter((e) => e != filter);
        } else {
            // Otherwise, add it
            newFilters.push(filter);
        }
        // Update the changed filter category
        const updatedFilters: FiltersInput = {
            ...filters,
            [category]: newFilters,
        };
        sessionStorage.setItem("filters", JSON.stringify(updatedFilters));
        filtersVar(updatedFilters);
    };

    const clearAll = () => {
        const emptyFilters: FiltersInput = {
            Genre: [],
            Rating: [],
            Decade: [],
            Status: [],
            Runtime: [],
        };
        sessionStorage.setItem("filters", JSON.stringify(emptyFilters));
        filtersVar(emptyFilters);

        sessionStorage.setItem("sort_option", defaultSortOption);
        sortOptionVar(defaultSortOption);
    };

    const renderFilterSections = () => {
        return Object.entries(fetchedFilters).map(([category, filter_list]) => {
            if (category === "__typename" || filter_list === "Filters") {
                return null;
            }
            const all_filters = filter_list as Filter[];
            const applied_filters = filters[category as keyof FiltersInput] as
                | string[]
                | undefined;
            return (
                <FilterSection
                    key={category}
                    category={category as keyof FiltersInput}
                    all_filters={all_filters}
                    applied_filters={applied_filters ?? []}
                    updateFilters={updateFilters}
                    loading={loading}
                />
            );
        });
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
                        Adding filters or changing sorting order will
                        automatically update the results.
                    </SheetDescription>
                </SheetHeader>

                {error ? (
                    <section className="text-center">
                        <p>Something went wrong!</p>
                        <p className="text-primary">Try to refresh</p>
                    </section>
                ) : (
                    <section>
                        <Accordion type="single" collapsible className="w-full">
                            <SortSection loading={loading} />
                            {renderFilterSections()}
                        </Accordion>
                        <SheetFooter className="mt-5">
                            <Button type="reset" onClick={clearAll}>
                                Clear All
                            </Button>
                        </SheetFooter>
                    </section>
                )}
                {loading && (
                    <Loader size="sm">
                        <p>Updating filters...</p>
                    </Loader>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default SortAndFilterPanel;
