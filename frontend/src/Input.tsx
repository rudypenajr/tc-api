import React, { FC, useEffect, useState } from "react";

import axios from "axios";

import { Episode, SearchResponse } from "./types";

import config from "./config";

export const Input: FC<{
  hasResults: boolean;
  setData: React.Dispatch<React.SetStateAction<Episode[]>>;
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setNoResults: React.Dispatch<React.SetStateAction<boolean>>;
}> = ({ hasResults, setData, query, setQuery, setIsLoading, setNoResults }) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

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
      setIsLoading(true);
      // Replace with your API call logic
      // console.log("Fetching results for:", debouncedQuery);
      // Assuming your API is running on localhost:8080

      // We were using /search before introduction of vector based search.
      // .get(`${config.apiUrl}/search?q=${query}`) // .get(`http://localhost:8080/search?q=${query}`)

      axios
        .post(`${config.apiUrl}/search-chat}`, {
          query: query,
        })
        .then((response) => {
          setIsLoading(false);
          setNoResults(false);
          setData((response.data as SearchResponse).results);
        })
        .catch((error) => {
          // Current API in GO retuns 404 when MongoDB has no results.
          console.error("Error fetching data:", error);
          setIsLoading(false);
          setNoResults(true);
          setData([]);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  return (
    // flex flex-row items-end content-end
    <div className="">
      <label
        htmlFor="search"
        className="text-base font-medium leading-6 text-gray-900 mr-5"
      >
        Search Time Crisis Wiki
      </label>
      <div className="relative mt-2 rounded-md shadow-sm">
        <input
          type="text"
          name="search"
          id="search"
          className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          placeholder="Tell me about episode 1"
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setQuery(event.target.value);
          }}
        />
      </div>
    </div>
  );
};

export default Input;
