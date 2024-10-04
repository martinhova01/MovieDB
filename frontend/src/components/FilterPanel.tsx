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

const FilterPanel = () => {
    const [filters, setFilters] = useState<{ [key: string]: string[] }>({});

    const genres = ["Action", "Fantasy", "Mystery", "Comedy", "Drama"];
    const decades = [
        "2020",
        "2010",
        "2000",
        "1990",
        "1980",
        "1970",
        "1960",
        "1950",
        "1940",
        "1930",
    ];
    const ratings = ["5", "4", "3", "2", "1"];

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
                    <SheetDescription>Apply desiered fitlers</SheetDescription>
                </SheetHeader>
                <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                        <AccordionTrigger>
                            Genre{" "}
                            {filters["genre"]?.length
                                ? `(${filters["genre"].length})`
                                : ""}
                        </AccordionTrigger>
                        <AccordionContent>
                            <ul>
                                {genres.map((genre) => (
                                    <li
                                        key={genre}
                                        className="flex items-center space-x-2 mb-2"
                                    >
                                        <Checkbox
                                            id={genre}
                                            checked={filters["genre"]?.includes(
                                                genre
                                            )}
                                            onCheckedChange={() =>
                                                updateFilters("genre", genre)
                                            }
                                        />
                                        <label
                                            htmlFor={genre}
                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        >
                                            {genre}
                                        </label>
                                    </li>
                                ))}
                            </ul>
                        </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                        <AccordionTrigger>
                            Decade{" "}
                            {filters["decade"]?.length
                                ? `(${filters["decade"].length})`
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
                    <AccordionItem value="item-3">
                        <AccordionTrigger>
                            Rating{" "}
                            {filters["rating"]?.length
                                ? `(${filters["rating"].length})`
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
