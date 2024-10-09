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
import { all_genres, all_languages } from "../mock/util";
import { Status } from "../types/movieTypes";
import FilterSection from "./FilterSection";
import SortSection from "./SortSection";

const FilterPanel = () => {
    const [filters, setFilters] = useState<{ [key: string]: string[] }>({});
    const [sortOption, setSortOption] = useState<string>("Newest first");

    const sort_options: string[] = [
        "Newest first",
        "Oldest first",
        "Title A-Z",
        "Title Z-A",
        "Best rated",
        "Worst rated",
        "Longest runtime",
        "Shortest runtime",
    ];

    const all_filters: { [key: string]: string[] } = {
        Genre: all_genres.map((genre) => genre.name),
        Rating: ["5", "4", "3", "2", "1"],
        "Release Year": [
            "2020s",
            "2010s",
            "2000s",
            "1990s",
            "1980s",
            "1970s",
            "1960s",
            "1950s",
            "1940s",
            "1930s",
            "1920s",
            "1910s",
            "1900s",
            "1890s",
            "1880s",
            "1870s",
        ],
        Language: all_languages.map((language) => language.name),
        Status: Object.values(Status) as string[],
        Runtime: ["Less than 1 hour", "1 - 2 hours", "More than 2 hours"],
    };

    useEffect(() => {
        const storedFilters = sessionStorage.getItem("filters");
        if (storedFilters) {
            setFilters(JSON.parse(storedFilters));
        }

        const storedSortOption = sessionStorage.getItem("sort_option");
        if (storedSortOption) {
            setSortOption(storedSortOption);
        }
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
    };

    const updateSortOption = (option: string) => {
        if (sort_options.includes(option)) {
            sessionStorage.setItem("sort_option", option);
            setSortOption(option);
        }
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
                        sortOptions={sort_options}
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

export default FilterPanel;
