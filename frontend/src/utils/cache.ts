import { Filters, SortingType } from "@/types/__generated__/types";
import { makeVar } from "@apollo/client";
import { defaultSortOption } from "./sortOptionUtil";

export const sortOptionVar = makeVar<SortingType>(
    (sessionStorage.getItem("sort_option") as SortingType) ?? defaultSortOption
);

const storedFilters = sessionStorage.getItem("filters");
const initialFilters: Filters = storedFilters
    ? JSON.parse(storedFilters)
    : {
          Genre: [],
          Rating: [],
          Decade: [],
          Status: [],
          Runtime: [],
      };
export const filtersVar = makeVar<Filters>(initialFilters);

export const searchVar = makeVar<string>(
    sessionStorage.getItem("search") ?? ""
);

export const usernameVar = makeVar<string>(
    localStorage.getItem("username") ?? "Guest"
);
