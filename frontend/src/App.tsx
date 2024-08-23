import { useState } from "react";

import { Episode } from "./types";
import Input from "./Input";

import "./App.css";
import Article from "./Article";
import Layout from "./Layout";

function App() {
  const [data, setData] = useState<Episode[]>([]);

  return (
    <Layout>
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

          {data.length > 0 && (
            <div className="md:w-2/4">
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

              <button>Next</button>
              <button>Prev</button>
            </div>
          )}
        </main>
      </div>
    </Layout>
  );
}

export default App;
