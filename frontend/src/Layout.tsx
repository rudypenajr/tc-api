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

      {children}
    </div>
  );
};

export default Layout;
