import { searchVar } from "@/utils/cache";
import { Input } from "@/shadcn/components/ui/input";
import React, { useEffect, useRef } from "react";
import { useDebouncedCallback } from "use-debounce";

const SearchBar: React.FC = () => {
    const searchInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = (searchString: string) => {
        searchString = searchString.trim();
        sessionStorage.setItem("search", searchString);
        searchVar(searchString);
    };

    const debouncedHandleSearch = useDebouncedCallback(handleSearch, 510);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    useEffect(() => {
        const search = sessionStorage.getItem("search");
        if (search && searchInputRef.current) {
            searchInputRef.current.value = search;
        }
    }, []);

    return (
        <section className="flex flex-grow flex-row gap-2">
            <Input
                id="searchbar"
                name="searchbar"
                type="search"
                placeholder="Search..."
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                ref={searchInputRef}
                aria-label="Search for movies"
                maxLength={100}
            />
        </section>
    );
};

export default SearchBar;
