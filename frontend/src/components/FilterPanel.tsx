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
    SheetDescription,
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

    const decades: string[] = [
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
    ];
    const ratings: string[] = ["5", "4", "3", "2", "1"];
    const runtimes: string[] = [
        "Less than 1 hour",
        "1 - 2 hours",
        "More than 2 hours",
    ];

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
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            Genre
                            {filters["genre"]?.length
                                ? ` (${filters["genre"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {all_genres.map((genre) => (
                                    <li
                                        key={genre.name}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={genre.name}
                                            checked={filters["genre"]?.includes(
                                                genre.name
                                            )}
                                            onCheckedChange={() =>
                                                updateFilters(
                                                    "genre",
                                                    genre.name
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor={genre.name}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {genre.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            Rating
                            {filters["rating"]?.length
                                ? ` (${filters["rating"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {ratings.map((rating) => (
                                    <li
                                        key={rating}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={rating}
                                            checked={filters[
                                                "rating"
                                            ]?.includes(rating)}
                                            onCheckedChange={() =>
                                                updateFilters("rating", rating)
                                            }
                                        />
                                        <label
                                            htmlFor={rating}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {rating}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            Release year
                            {filters["decade"]?.length
                                ? ` (${filters["decade"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {decades.map((decade) => (
                                    <li
                                        key={decade}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={decade}
                                            checked={filters[
                                                "decade"
                                            ]?.includes(decade)}
                                            onCheckedChange={() =>
                                                updateFilters("decade", decade)
                                            }
                                        />
                                        <label
                                            htmlFor={decade}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {decade}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-4">
                        <AccordionTrigger>
                            Language
                            {filters["language"]?.length
                                ? ` (${filters["language"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {all_languages.map((language) => (
                                    <li
                                        key={language.name}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={language.name}
                                            checked={filters[
                                                "language"
                                            ]?.includes(language.name)}
                                            onCheckedChange={() =>
                                                updateFilters(
                                                    "language",
                                                    language.name
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor={language.name}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {language.name}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-5">
                        <AccordionTrigger>
                            Status
                            {filters["status"]?.length
                                ? ` (${filters["status"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {Object.values(Status).map((status) => (
                                    <li
                                        key={status}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={status}
                                            checked={filters[
                                                "status"
                                            ]?.includes(status)}
                                            onCheckedChange={() =>
                                                updateFilters("status", status)
                                            }
                                        />
                                        <label
                                            htmlFor={status}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {status}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-6">
                        <AccordionTrigger>
                            Runtime
                            {filters["runtime"]?.length
                                ? ` (${filters["runtime"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {runtimes.map((runtime) => (
                                    <li
                                        key={runtime}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={runtime}
                                            checked={filters[
                                                "runtime"
                                            ]?.includes(runtime)}
                                            onCheckedChange={() =>
                                                updateFilters(
                                                    "runtime",
                                                    runtime
                                                )
                                            }
                                        />
                                        <label
                                            htmlFor={runtime}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {runtime}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
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
