import { Filter, FiltersInput } from "@/types/__generated__/types";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../shadcn/components/ui/accordion";
import { Checkbox } from "../shadcn/components/ui/checkbox";
import { formatNumber } from "@/utils/formatUtil";

interface FilterSectionInterface {
    category: keyof FiltersInput;
    all_filters: Filter[];
    applied_filters: string[];
    updateFilters: (category: keyof FiltersInput, filter: string) => void;
    loading: boolean;
}

const FilterSection: React.FC<FilterSectionInterface> = ({
    category,
    all_filters,
    applied_filters,
    updateFilters,
    loading,
}) => {
    return (
        <AccordionItem value={`${category} item`}>
            <AccordionTrigger>
                <p>
                    {category}
                    {applied_filters.length > 0 && (
                        <span className="opacity-60">
                            {" "}
                            ({applied_filters.length} applied)
                        </span>
                    )}
                </p>
            </AccordionTrigger>
            <AccordionContent>
                <ul>
                    {all_filters.map(
                        (filter) =>
                            filter.hits > 0 && (
                                <li
                                    key={filter.name}
                                    className="mb-2 flex items-center space-x-2"
                                >
                                    <Checkbox
                                        id={filter.name}
                                        checked={applied_filters.includes(
                                            filter.name
                                        )}
                                        disabled={loading}
                                        onCheckedChange={() =>
                                            updateFilters(category, filter.name)
                                        }
                                    />
                                    <label
                                        htmlFor={filter.name}
                                        className="text-sm font-medium leading-none hover:cursor-pointer"
                                    >
                                        {filter.name}{" "}
                                        <span className="opacity-60">
                                            ({formatNumber(filter.hits)})
                                        </span>
                                    </label>
                                </li>
                            )
                    )}
                </ul>
            </AccordionContent>
        </AccordionItem>
    );
};

export default FilterSection;
