import { FiltersInput, SortingType } from "@/types/__generated__/types";
import { makeVar } from "@apollo/client";
import { defaultSortOption } from "./sortOptionUtil";

export const sortOptionVar = makeVar<SortingType>(
    (sessionStorage.getItem("sort_option") as SortingType) ?? defaultSortOption
);

const storedFilters = sessionStorage.getItem("filters");
const initialFilters: FiltersInput = storedFilters
    ? JSON.parse(storedFilters)
    : {
          Genre: [],
          Rating: [],
          Decade: [],
          Status: [],
          Runtime: [],
      };
export const filtersVar = makeVar<FiltersInput>(initialFilters);

export const searchVar = makeVar<string>(
    sessionStorage.getItem("search") ?? ""
);

export const usernameVar = makeVar<string>(
    localStorage.getItem("username") ?? "Guest"
);

export const totalHitsVar = makeVar<number>(0);
