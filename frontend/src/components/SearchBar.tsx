import { searchVar } from "@/cache";
import { Button } from "@/shadcn/components/ui/button";
import { Input } from "@/shadcn/components/ui/input";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";

const SearchBar: React.FC = () => {
    const [search, setSearch] = useState<string>("");

    useEffect(() => {
        setSearch(searchVar());
    }, []);

    const handleSearch = (searchString: string) => {
        sessionStorage.setItem("search", searchString);
        searchVar(searchString);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        if (!e.target.value) {
            handleSearch(e.target.value.trim());
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        if (e.key === "Enter" && target.value.trim()) {
            handleSearch(target.value.trim());
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
                onClick={() => handleSearch(search.trim())}
                aria-label="Search"
            >
                <Search />
            </Button>
        </section>
    );
};

export default SearchBar;
