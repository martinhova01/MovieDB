import { Filters, FiltersInput } from "@/types/__generated__/types";

export function getFiltersAsInput(filters: Filters): FiltersInput {
    return {
        Decade: filters.Decade.map((filter) => filter.name),
        Genre: filters.Genre.map((filter) => filter.name),
        Rating: filters.Rating.map((filter) => filter.name),
        Status: filters.Status.map((filter) => filter.name),
        Runtime: filters.Runtime.map((filter) => filter.name),
    };
}
