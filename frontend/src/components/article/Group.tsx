import React, { FC } from "react";

export const Group: FC<{ guests: string[] }> = ({ guests }) => {
  return (
    <div className="mt-3">
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
        <span className="ml-2.5">Guests</span>
      </h2>

      {guests.length > 0 && (
        <div className="mt-2.5 relative z-10">
          {guests.map((guest, idx) => (
            <span
              className={`text-xs pill rounded-full bg-pink-500 px-2.5 py-1.5 text-white ${
                idx > 0 ? "mx-1" : "mr-1"
              }`}
            >
              {guest}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default Group;
