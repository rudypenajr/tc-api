import React from "react";

export const HostedByComponent = () => {
  return (
    <div className="hidden lg:sticky lg:top-0 lg:flex lg:w-16 lg:flex-none lg:items-center lg:whitespace-nowrap lg:py-12 lg:text-sm lg:leading-7 lg:[writing-mode:vertical-rl]">
      <span className="font-mono text-slate-500">Hosted by</span>

      <span className="mt-6 flex gap-6 font-bold text-slate-900">
        Rudy Pena
        {/* <span aria-hidden="true" className="text-slate-400">/</span>Wes Mantooth */}
      </span>
    </div>
  );
};

export default HostedByComponent;
