import React from "react";
import MainNav from "@/components/main-nav";
import Window from "@/components/window";
import { useState, useEffect } from "react";
import TopBar from "./windows/TopBar";
import { Toaster } from "./ui/toaster";
import { observer } from "mobx-react-lite";
import { sceneStore } from "@/stores/scene-store";
import { HelpDialog } from "./ui/help-dialog";

const DefaultLayout: React.FC<{ children: React.ReactNode }> = observer(
  ({ children }) => {
    const [openedWindow, setOpenedWindow] = useState<string | null>(null);

    // Show properties panel when an object is selected
    useEffect(() => {
      if (sceneStore.selectedItemId) {
        setOpenedWindow("properties");
      } else {
        setOpenedWindow(null);
      }
    }, [sceneStore.selectedItemId]);

    const handleOpenedWindow = (windowName: string) => {
      if (windowName === "properties" && !sceneStore.selectedItemId) {
        return; // Don't open properties panel if no object is selected
      }
      setOpenedWindow((prevWindow) =>
        prevWindow === windowName ? null : windowName
      );
    };

    return (
      <div className="relative h-screen overflow-hidden flex">
        <main className="flex-1 overflow-hidden">{children}</main>
        <TopBar />
        <MainNav onButtonClick={handleOpenedWindow} />
        <Window position="right" windowTag={openedWindow} />
        <Toaster />
        <div className="absolute bottom-4 left-7 text-white">
          <a href="https://www.netlify.com">
            <img
              src="/netlify-dark.svg"
              alt="Deploys by Netlify"
              className="h-auto w-auto"
            />
          </a>
        </div>
        {/* Help Dialog */}
        <HelpDialog />
      </div>
    );
  }
);

export default DefaultLayout;
