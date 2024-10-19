import { makeVar } from "@apollo/client";
import { SortingType } from "./utils/searchSortAndFilter";

export const sortOptionVar = makeVar<SortingType>(
    (sessionStorage.getItem("sort_option") as SortingType) ??
        SortingType.NEWEST_FIRST
);

export const filtersVar = makeVar<{ [key: string]: string[] }>(
    JSON.parse(sessionStorage.getItem("filters") ?? "{}")
);

export const searchVar = makeVar<string>(
    sessionStorage.getItem("search") ?? ""
);

export const usernameVar = makeVar<string>(
    localStorage.getItem("username") ?? "Guest"
);
