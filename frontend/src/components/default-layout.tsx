import React from "react";
import MainNav from "@/components/main-nav";
import Window from "@/components/window";
import { useState } from "react";
import SceneModelsList from "./windows/SceneModelsList";
import TopBar from "./windows/TopBar";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [openedWindow, setOpenedWindow] = useState<string | null>(null);

  const handleOpenedWindow = (windowName: string) => {
    setOpenedWindow((prevWindow) =>
      prevWindow === windowName ? null : windowName
    );
  };

  return (
    <div className="relative h-screen overflow-hidden flex">
      <main className="flex-1 overflow-hidden">{children}</main>
      <SceneModelsList />
      <TopBar />
      <MainNav onButtonClick={handleOpenedWindow} />
      <Window position="right" windowTag={openedWindow} />
      <div className="absolute bottom-4 left-7 text-white">
        <a href="https://www.netlify.com">
          <img
            src="/netlify-dark.svg"
            alt="Deploys by Netlify"
            className="h-auto w-auto"
          />
        </a>
      </div>
    </div>
  );
};

export default DefaultLayout;
