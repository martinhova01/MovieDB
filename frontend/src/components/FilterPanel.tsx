import { Button } from "@/shadcn/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../shadcn/components/ui/accordion";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../shadcn/components/ui/sheet";
import { SlidersHorizontal } from "lucide-react";
import { Checkbox } from "@/shadcn/components/ui/checkbox";
import { useEffect, useState } from "react";
import { all_genres, all_languages } from "@/mock/util";
import { Status } from "@/types/movieTypes";

const FilterPanel = () => {
    const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

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

    return (
        <Sheet>
            <SheetTrigger>
                <Button variant="outline" size="sm" className="h-7 gap-1">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                        Filters
                    </span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full overflow-y-auto">
                <SheetHeader className="mb-5">
                    <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <Accordion type="single" collapsible className="w-full">
                    {Object.entries(all_filters).map(
                        ([category, filter_list]) => (
                            <AccordionItem key={category} value={`${category} item`}>
                                <AccordionTrigger>
                                    {category}
                                    {filters[category]?.length
                                        ? ` (${filters[category].length})`
                                        : ""}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul>
                                        {filter_list.map((filter) => (
                                            <li
                                                key={filter}
                                                className="flex items-center space-x-2 mb-2"
                                            >
                                                <Checkbox
                                                    id={filter}
                                                    checked={filters[
                                                        category
                                                    ]?.includes(filter)}
                                                    onCheckedChange={() =>
                                                        updateFilters(
                                                            category,
                                                            filter
                                                        )
                                                    }
                                                />
                                                <label
                                                    htmlFor={filter}
                                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                >
                                                    {filter}
                                                </label>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
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
