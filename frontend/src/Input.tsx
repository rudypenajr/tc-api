import axios from "axios";
import React, { FC, SetStateAction, useEffect, useState } from "react";
import { Episode, SearchResponse } from "./types";

export const Input: FC<{
  setData: React.Dispatch<React.SetStateAction<Episode[]>>;
}> = ({ setData }) => {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  //   const [data, setData] = useState<Episode[]>([]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      // Replace with your API call logic
      console.log("Fetching results for:", debouncedQuery);
      // Assuming your API is running on localhost:8080
      axios
        .get(`http://localhost:8080/search?q=${query}`)
        .then((response) => setData((response.data as SearchResponse).results))
        .catch((error) => console.error("Error fetching data:", error));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    <div>
      <label
        htmlFor="search"
        className="block text-sm font-medium leading-6 text-gray-900"
      >
        Search Time Crisis Wiki
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder=""
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Input;
