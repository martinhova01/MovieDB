import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

interface SearchBarInterface {
    handleSearchChange: (searchString: string) => void;
}

const SearchBar: React.FC<SearchBarInterface> = ({ handleSearchChange }) => {
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        const storedSearch = sessionStorage.getItem("search");
        if (storedSearch) {
            setSearch(storedSearch);
            // Initial loading of the movie list is handled in SortAndFilterPanel
        }
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (!e.target.value) {
            handleSearchChange(e.target.value.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (e.key === "Enter" && target.value.trim()) {
            handleSearchChange(target.value.trim());
        }
    };

    return (
        <section className="flex flex-row flex-grow gap-2">
            <Input
                id="searchbar"
                name="searchbar"
                type="search"
                placeholder="Search..."
                value={search}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                aria-label="Search for movies"
            />
            <Button
                type="submit"
                onClick={() => handleSearchChange(search.trim())}
                aria-label="Search"
            >
                <Search />
            </Button>
        </section>
    );
};

export default SearchBar;
