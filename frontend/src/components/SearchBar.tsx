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

    // Debounce the search input to avoid making too many requests
    // 510ms is a nice balance between responsiveness and avoiding too many requests
    // (500ms is the default timeout when holding a key in most systems,
    //  so 510ms wound send request while a key is held)
    const debouncedHandleSearch = useDebouncedCallback(handleSearch, 510);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        // (Re)start the countdown for the debounced search
        debouncedHandleSearch(e.target.value);
        if (!e.target.value) {
            // Immediately execute the search if the input is empty
            debouncedHandleSearch.flush();
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (e.key === "Enter" && target.value.trim()) {
            // Immediately execute the search if the user presses Enter
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
