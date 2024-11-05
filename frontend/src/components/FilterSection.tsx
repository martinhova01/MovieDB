import { Filter, Filters } from "@/types/__generated__/types";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../shadcn/components/ui/accordion";
import { Checkbox } from "../shadcn/components/ui/checkbox";

interface FilterSectionInterface {
    category: keyof Filters;
    all_filters: Filter[];
    applied_filters: Filter[];
    updateFilters: (category: keyof Filters, filter: Filter) => void;
}

const FilterSection: React.FC<FilterSectionInterface> = ({
    category,
    all_filters,
    applied_filters,
    updateFilters,
}) => {
    return (
        <AccordionItem value={`${category} item`}>
            <AccordionTrigger>
                {category}
                {` (${applied_filters.map((e) => e.hits).reduce((acc, current) => acc + current, 0)})`}
            </AccordionTrigger>
            <AccordionContent>
                <ul>
                    {all_filters.map((filter) => (
                        <li
                            key={filter.name}
                            className="mb-2 flex items-center space-x-2"
                        >
                            <Checkbox
                                id={filter.name}
                                checked={applied_filters
                                    .map((e) => e.name)
                                    .includes(filter.name)}
                                onCheckedChange={() =>
                                    updateFilters(category, filter)
                                }
                            />
                            <label
                                htmlFor={filter.name}
                                className="text-sm font-medium leading-none hover:cursor-pointer"
                            >
                                {filter.name}({filter.hits})
                            </label>
                        </li>
                    ))}
                </ul>
            </AccordionContent>
        </AccordionItem>
    );
};

export default FilterSection;
