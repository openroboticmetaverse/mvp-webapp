import MainNav from "@/components/main-nav.tsx";
import Window from "@/components/window.tsx";
import { useState } from "react";

const DefaultLayout = () => {
  const [openedWindow, setOpenedWindow] = useState<string | null>(null);
  const handleOpenedWindow = (windowName: string) => {
    setOpenedWindow(windowName === openedWindow ? null : windowName);
  };
  return (
    <div>
      <div className="absolute top-2 right-5 text-white"> mvp v0.4</div>
      <MainNav onButtonClick={handleOpenedWindow} />
      <Window position="right" windowTag={openedWindow} />
    </div>
  );
};

export default DefaultLayout;
