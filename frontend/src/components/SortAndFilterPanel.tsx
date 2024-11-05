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
import { filtersVar, searchVar, sortOptionVar } from "@/utils/cache";
import { useQuery, useReactiveVar } from "@apollo/client";
import { Filter, Filters } from "@/types/__generated__/types";
import { GET_FILTERS } from "@/api/queries";
import { defaultSortOption } from "@/utils/sortOptionUtil";
import Loader from "./Loader";
import { getFiltersAsInput } from "@/utils/filterUtils";

const SortAndFilterPanel: React.FC = () => {
    const filters = useReactiveVar(filtersVar);
    const search = useReactiveVar(searchVar);

    const { data, loading, error } = useQuery(GET_FILTERS, {
        variables: {
            appliedFilters: getFiltersAsInput(filters),
            search: search,
        },
    });

    const updateFilters = (category: keyof Filters, filter: Filter) => {
        //category will never be "__typename" so we just ignore that case.
        if (category === "__typename") {
            return;
        }
        let newFilters: Filter[] = [...(filters[category] || [])];
        if (newFilters.map((e) => e.name).includes(filter.name)) {
            newFilters = newFilters.filter((e) => e.name != filter.name);
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

        sessionStorage.setItem("sort_option", defaultSortOption);
        sortOptionVar(defaultSortOption);
    };

    const renderFilterSections = () => {
        return Object.entries(data?.filters as Filters).map(
            ([category, filter_list]) => {
                if (category === "__typename" || filter_list === "Filters") {
                    return null;
                }
                const filter_names = filter_list as Filter[];
                const applied_filters = filters[category as keyof Filters] as
                    | Filter[]
                    | undefined;
                return (
                    <FilterSection
                        key={category}
                        category={category as keyof Filters}
                        all_filters={filter_names}
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
                    <Loader>
                        <p>Loading...</p>
                    </Loader>
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
                        </SheetFooter>
                    </section>
                )}
            </SheetContent>
        </Sheet>
    );
};

export default SortAndFilterPanel;
