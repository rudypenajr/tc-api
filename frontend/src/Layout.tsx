import React, { FC, ReactNode } from "react";
import HostedByComponent from "./components/layout/HostedByComponent";
import AboutComponent from "./components/layout/AboutComponent";

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <div className="w-full">
      <header className="bg-slate-50 lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-112 lg:items-start lg:overflow-y-auto xl:w-120">
        <HostedByComponent />
        <AboutComponent />
      </header>

      <main className="border-t border-slate-200 lg:relative lg:mb-28 lg:ml-112 lg:border-t-0 xl:ml-120">
        <div className="relative">
          <div className="pb-12 pt-16 sm:pb-4 lg:pt-12">{children}</div>
        </div>
      </main>
    </div>
  );
};

export default Layout;
