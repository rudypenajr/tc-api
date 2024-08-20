import React, { useEffect, useState } from "react";

import "./App.css";

import { TextField } from "@mui/material";
import axios from "axios";
import { Episode, SearchResponse } from "./types";
function App() {
  const [query, setQuery] = useState<string>("");
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const [data, setData] = useState<Episode[]>([]);

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
    <div className="App">
      <TextField
        id="standard-basic"
        label="Standard"
        variant="standard"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
          setQuery(event.target.value);
        }}
      />

      {data.length > 0 && (
        <ul>
          {data.map((item, idx) => (
            <li id={`episode-${idx}`}>
              <a
                title={item.title}
                href={item.url}
                rel="noreferrer"
                target="_blank"
              >
                <h2>{item.title}</h2>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
