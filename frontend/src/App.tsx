import { useState } from "react";

import { Episode } from "./types";
import Input from "./Input";

import "./App.css";
import Article from "./components/article/Article";
import Layout from "./Layout";

function App() {
  const [data, setData] = useState<Episode[]>([]);

  return (
    <Layout>
      <div className="lg:px-8">
        <div className="lg:max-w-4xl">
          {/* mx-auto */}
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            <Input hasResults={data.length > 0} setData={setData} />
          </div>
        </div>
      </div>

      {data.length > 0 && (
        <div className="divide-y divide-slate-100 sm:mt-4 lg:mt-8 lg:border-t lg:border-slate-100">
          {data.map((item, idx) => (
            <Article
              key={item._id}
              _id={item._id}
              title={item.title}
              date={item.date}
              notes={item.notes}
              url={item.url}
              episode_no={item.episode_no}
              guests={item.guests}
              top_5_comparison_year={item.top_5_comparison_year}
            />
          ))}
        </div>
      )}

      <div className="lg:px-8">
        <div className="lg:max-w-4xl">
          <div className="mx-auto px-4 sm:px-6 md:max-w-2xl md:px-4 lg:px-0">
            {/* inline-flex items-center gap-2 justify-center group w-full */}
            <button className="mr-4 rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70 mt-6">
              Next
            </button>
            <button className="rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-zinc-50 font-medium text-zinc-900 hover:bg-zinc-100 active:bg-zinc-100 active:text-zinc-900/60 dark:bg-zinc-800/50 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50 dark:active:bg-zinc-800/50 dark:active:text-zinc-50/70 mt-6 ">
              Prev
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default App;
