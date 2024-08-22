import React, { FC } from "react";
import { Episode } from "./types";

export const Article: FC<Episode> = ({
  _id,
  title,
  date,
  notes,
  url,
  episode_no,
  guests,
  top_5_comparison_year,
}) => {
  return (
    <article
      key={_id}
      className="group relative flex flex-col items-start mb-10"
    >
      <h2 className="text-base font-semibold tracking-tight text-zinc-800 dark:text-zinc-100">
        <div className="absolute -inset-x-4 -inset-y-6 z-0 scale-95 bg-zinc-50 opacity-0 transition group-hover:scale-100 group-hover:opacity-100 sm:-inset-x-6 sm:rounded-2xl dark:bg-zinc-800/50"></div>
        <a href={`${url}`}>
          <span className="absolute -inset-x-4 -inset-y-6 z-20 sm:-inset-x-6 sm:rounded-2xl"></span>
          <div className="relative z-10 flex flex-row justify-between">
            <span className="mr-2">Episode {episode_no}: </span>
            {/* <span className="mx-1.5"></span> */}
            <span>{title}</span>
            {/* Introducing Animaginary: High performance web animations */}
          </div>
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
        {date}
      </time>
      <p className="relative z-10 mt-2 text-sm text-zinc-600 dark:text-zinc-400 text-left">
        {notes}
        {/* When you’re building a website for a company as ambitious as
                Planetaria, you need to make an impression. I wanted people to
                visit our website and see animations that looked more realistic
                than reality itself. */}
      </p>

      <div className="mt-2.5 relative z-10 text-sm text-zinc-600">
        <span className="font-bold mr-1.5">Top 5 Year Comparison:</span>
        {top_5_comparison_year}
      </div>

      {guests.length > 0 && (
        <div className="mt-2.5 relative z-10">
          <span className="text-sm text-zinc-600 font-bold">Guests: </span>
          {guests.map((guest, idx) => (
            <span
              className={`text-xs pill rounded-full bg-orange-600 px-2.5 py-1.5 text-white ${
                idx > 0 ? "mx-1" : "mr-1"
              }`}
            >
              {guest}
            </span>
          ))}
        </div>
      )}

      <div
        aria-hidden="true"
        className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
      >
        <a title={title} href={url}>
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
  );
};

export default Article;
