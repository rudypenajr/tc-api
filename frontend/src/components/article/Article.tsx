import { FC } from "react";
import { Episode } from "../../types";
import Group from "./Group";
import Top5 from "./Top5";

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
    <article key={_id} className={`py-10 sm:py-12`}>
      <div className="lg:px-8">
        <div className="lg:max-w-4xl">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <div className="flex flex-col items-start">
              <h2
                id="episode-5-title"
                className="mt-2 text-lg font-bold text-slate-900 decoration-pink-500"
              >
                <a
                  title={`Link to Episode ${episode_no}, titled ${title}`}
                  href={`${url}`}
                  className="decoration-pink-500"
                >
                  Episode {episode_no}: {title}
                </a>
              </h2>

              <time
                dateTime={date}
                className="order-first font-mono text-sm leading-7 text-slate-500"
              >
                {date}
              </time>

              <p className="mt-1 text-base leading-7 text-slate-700">{notes}</p>

              <Group guests={guests} />

              <Top5 top_5_comparison_year={top_5_comparison_year} />

              <div
                aria-hidden="true"
                className="relative z-10 mt-4 flex items-center text-sm font-medium text-teal-500"
              >
                <a
                  title={title}
                  target="_blank"
                  rel="noreferrer"
                  href={`https://the-time-crisis-universe.fandom.com/wiki/Episode_${episode_no}`}
                  className="underline-offset-8 underline decoration-pink-500"
                >
                  See within wiki.
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
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Article;
