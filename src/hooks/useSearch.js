import { useState } from "react";
import { useDebounce } from "./useDebounce";

export function useSearch(initial = "") {
  const [search, setSearch] = useState(initial);
  const debouncedSearch = useDebounce(search, 300);
  return { search, setSearch, debouncedSearch };
}
