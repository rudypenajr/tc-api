import React, { FC } from "react";

export const Top5: FC<{ top_5_comparison_year: string }> = ({
  top_5_comparison_year,
}) => {
  return (
    <div className="mt-5">
      <h2 className="sr-only flex items-center font-mono text-sm font-medium leading-7 text-slate-900 lg:not-sr-only">
        <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5">
          <path
            d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z"
            className="fill-indigo-300"
          ></path>
          <path
            d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"
            className="fill-blue-300"
          ></path>
        </svg>
        <span className="ml-2.5">Top 5 Year Comparison</span>
      </h2>

      <div className="mt-2.5 relative z-10 text-sm text-zinc-600">
        {top_5_comparison_year}
      </div>
    </div>
  );
};

export default Top5;
