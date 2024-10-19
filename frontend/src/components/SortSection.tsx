import {
    RadioGroup,
    RadioGroupItem,
} from "../shadcn/components/ui/radio-group";
import {
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "../shadcn/components/ui/accordion";
import { Label } from "../shadcn/components/ui/label";
import { SortingType } from "../utils/searchSortAndFilter";
import { sortOptionVar } from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";

const SortSection: React.FC = () => {
    const sortOption = useReactiveVar(sortOptionVar);

    const updateSortOption = (option: SortingType) => {
        sessionStorage.setItem("sort_option", option);
        sortOptionVar(option);
    };

    return (
        <AccordionItem value={`Sort item`}>
            <AccordionTrigger>Sort by ({sortOption})</AccordionTrigger>
            <AccordionContent>
                <RadioGroup value={sortOption} onValueChange={updateSortOption}>
                    <ul className="grid gap-2">
                        {Object.values(SortingType).map((option) => (
                            <li
                                key={option}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem value={option} id={option} />
                                <Label
                                    htmlFor={option}
                                    className="hover:cursor-pointer"
                                >
                                    {option}
                                </Label>
                            </li>
                        ))}
                    </ul>
                </RadioGroup>
            </AccordionContent>
        </AccordionItem>
    );
};

export default SortSection;
