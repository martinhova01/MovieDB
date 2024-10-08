import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../shadcn/components/ui/accordion";
import { Checkbox } from "../shadcn/components/ui/checkbox";

interface FilterSectionInterface {
    category: string;
    all_filters: string[];
    applied_filters: string[];
    updateFilters: (category: string, filter: string) => void;
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
                {applied_filters.length ? ` (${applied_filters.length})` : ""}
            </AccordionTrigger>
            <AccordionContent>
                <ul>
                    {all_filters.map((filter) => (
                        <li
                            key={filter}
                            className="flex items-center space-x-2 mb-2"
                        >
                            <Checkbox
                                id={filter}
                                checked={applied_filters.includes(filter)}
                                onCheckedChange={() =>
                                    updateFilters(category, filter)
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
    );
};

export default FilterSection;
