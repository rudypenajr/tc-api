import React from "react";

export const AboutComponent = () => {
  return (
    <div className="relative z-10 mx-auto px-4 pb-4 pt-10 sm:px-6 md:max-w-2xl md:px-4 lg:min-h-full lg:flex-auto lg:border-x lg:border-slate-200 lg:px-8 lg:py-12 xl:px-12">
      <section className="mt-12 hidden lg:block">
        <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
          <svg aria-hidden="true" viewBox="0 0 10 10" className="h-2.5 w-2.5">
            <path
              d="M0 5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v4a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V5Z"
              className="fill-violet-300"
            ></path>
            <path
              d="M6 1a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V1Z"
              className="fill-pink-300"
            ></path>
          </svg>
          <span className="ml-2.5">About</span>
        </h2>
        <p className="mt-2 text-base leading-7 text-slate-700 lg:line-clamp-4">
          👋 Hello! My name is Rudy!
        </p>
        <p className="mt-2 text-base leading-7 text-slate-700 lg:line-clamp-4">
          I built this application as a means to easily search the{" "}
          <a
            title="Link to Time Crisis Wiki"
            className="underline-offset-8 underline decoration-pink-500"
            href="https://the-time-crisis-universe.fandom.com/wiki/The_Time_Crisis_Universe_Wiki"
          >
            Time Crisis Wiki
          </a>
          . This project in no means replaces{" "}
          <a
            title="Link to Time Crisis Wiki"
            className="underline-offset-8 underline decoration-pink-500"
            href="https://the-time-crisis-universe.fandom.com/wiki/The_Time_Crisis_Universe_Wiki"
          >
            their wiki
          </a>
          . It is a great resource and, it itself, has a great search!
        </p>

        <p className="mt-2 text-base leading-7 text-slate-700 lg:line-clamp-4">
          I am big fan of Vampire Weekend and one of the best Radio Shows out
          there there,{" "}
          <a
            title="Link to Time Crisis on Apple Music"
            className="underline-offset-8 underline decoration-pink-500"
            href="https://music.apple.com/us/curator/time-crisis/993269786"
          >
            Time Crisis
          </a>
          ! I am just Software Engineer and wanted to learn and build an
          application of some sort using React and Golang.
        </p>

        <p></p>

        {/* <button
              type="button"
              className="mt-2 hidden text-sm font-bold leading-6 text-pink-500 hover:text-pink-700 active:text-pink-900 lg:inline-block"
            >
              Show more
            </button> */}
      </section>

      <section className="mt-12 hidden lg:block">
        <h2 className="flex items-center font-mono text-sm font-medium leading-7 text-slate-900">
          🚧
          <span className="ml-2.5">Heads Up</span>
        </h2>

        <p className="mt-2 text-base leading-7 text-slate-700 lg:line-clamp-4">
          This being a passion project, I'm still iterating on the UI, how
          search functions, etc. Thanks for y'alls patience
        </p>
      </section>
    </div>
  );
};

export default AboutComponent;
