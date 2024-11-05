import { searchVar } from "@/utils/cache";
import { Input } from "@/shadcn/components/ui/input";
import React, { useState } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchBar: React.FC = () => {
    const [search, setSearch] = useState<string>(searchVar());

    const handleSearch = (searchString: string) => {
        searchString = searchString.trim();
        sessionStorage.setItem("search", searchString);
        searchVar(searchString);
    };

    const debouncedHandleSearch = useDebouncedCallback(handleSearch, 510);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        debouncedHandleSearch(e.target.value);
        if (!e.target.value) {
            debouncedHandleSearch.flush();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (e.key === "Enter" && target.value.trim()) {
            debouncedHandleSearch.flush();
        }
    };

    return (
        <section className="flex flex-grow flex-row gap-2">
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
        </section>
    );
};

export default SearchBar;
