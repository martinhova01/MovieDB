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
import { sortOptionVar } from "@/utils/cache";
import { useReactiveVar } from "@apollo/client";
import { getSortOptionDisplayName } from "@/utils/sortOptionUtil";
import { SortingType } from "@/types/__generated__/types";

interface SortSectionInterface {
    loading: boolean;
}

const SortSection: React.FC<SortSectionInterface> = ({ loading }) => {
    const sortOption = useReactiveVar(sortOptionVar);

    const updateSortOption = (option: SortingType) => {
        sessionStorage.setItem("sort_option", option);
        sortOptionVar(option);
    };

    return (
        <AccordionItem value={`Sort item`}>
            <AccordionTrigger>
                <p>
                    Sort by{" "}
                    <span className="opacity-60">
                        ({getSortOptionDisplayName(sortOption)})
                    </span>
                </p>
            </AccordionTrigger>
            <AccordionContent>
                <RadioGroup value={sortOption} onValueChange={updateSortOption}>
                    <ul className="grid gap-2">
                        {Object.values(SortingType).map((option) => (
                            <li
                                key={option}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem
                                    value={option}
                                    id={option}
                                    disabled={loading}
                                    aria-label={option}
                                />
                                <Label
                                    htmlFor={option}
                                    className="hover:cursor-pointer"
                                >
                                    {getSortOptionDisplayName(option)}
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
