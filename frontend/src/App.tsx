import { useState } from "react";

import { Episode } from "./types";
import Input from "./Input";

import "./App.css";

function App() {
  const [data, setData] = useState<Episode[]>([]);

  return (
    <div className="App">
      <main
        className={`min-h-screen flex flex-col items-center justify-center`}
      >
        <div
          className={`mx-auto max-w-4xl text-5xl text-slate-900 sm:text-7xl md:w-96 ${
            data.length > 0 ? "-translate-y-8" : "translate-y-0"
          }`}
        >
          <Input hasResults={data.length > 0} setData={setData} />
        </div>
        {JSON.stringify(data)}
        {data.length > 0 && (
          <div>
            {data.map((item, idx) => (
              <article
                key={item._id}
                className="group relative flex flex-col items-start mb-10"
              >
                <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
                  <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50"></div>
                  <a href="/articles/introducing-animaginary">
                    <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
                    <span className="relative z-10">
                      {item.title}
                      {/* Introducing Animaginary: High performance web animations */}
                    </span>
                  </a>
                </h2>
                <time
                  className="relative z-10 order-first mb-3 flex items-center text-sm text-zinc-400 dark:text-zinc-500 pl-3.5"
                  // datetime="2022-09-02"
                >
                  <span
                    className="absolute inset-y-0 left-0 flex items-center"
                    aria-hidden="true"
                  >
                    <span className="h-4 w-0.5 rounded-full bg-zinc-200 dark:bg-zinc-500"></span>
                  </span>
                  {item.date}
                </time>
                <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {item.notes}
                  {/* When you’re building a website for a company as ambitious as
                Planetaria, you need to make an impression. I wanted people to
                visit our website and see animations that looked more realistic
                than reality itself. */}
                </p>
                <div
                  aria-hidden="true"
                  className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
                >
                  <a title={item.title} href={item.url}>
                    See full details.
                  </a>
                  <svg
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden="true"
                    className="ml-1 h-4 w-4 stroke-current"
                  >
                    <path
                      d="M6.75 5.75 9.25 8l-2.5 2.25"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
