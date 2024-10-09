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

interface SortSectionInterface {
    sortOption: string;
    sortOptions: string[];
    updateSortOption: (option: string) => void;
}

const SortSection: React.FC<SortSectionInterface> = ({
    sortOption,
    sortOptions,
    updateSortOption,
}) => {
    return (
        <AccordionItem value={`Sort item`}>
            <AccordionTrigger>Sort by ({sortOption})</AccordionTrigger>
            <AccordionContent>
                <RadioGroup value={sortOption} onValueChange={updateSortOption}>
                    <ul className="grid gap-2">
                        {sortOptions.map((option) => (
                            <li
                                key={option}
                                className="flex items-center space-x-2"
                            >
                                <RadioGroupItem value={option} id={option} />
                                <Label htmlFor={option}>{option}</Label>
                            </li>
                        ))}
                    </ul>
                </RadioGroup>
            </AccordionContent>
        </AccordionItem>
    );
};

export default SortSection;
