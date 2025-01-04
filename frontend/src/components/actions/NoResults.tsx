import React, { ComponentType } from "react";

const NoResults: ComponentType<{ query: string }> = ({ query }) => {
  return (
    <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
      <article className={`py-10 sm:py-12`}>
        <div className="lg:px-8">
          <div className="lg:max-w-4xl">
            <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
              No results for <strong>{query}</strong>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};

export default NoResults;
