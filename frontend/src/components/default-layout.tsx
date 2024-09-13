import { useState } from "react";
import MainNav from "@/components/main-nav.tsx";
import Window from "@/components/window.tsx";
import FrankaScene from "@/components/3d/FrankaScene";
import { SimpleScene } from "@/components/3d/SimpleScene";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const DefaultLayout = () => {
  const [openedWindow, setOpenedWindow] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<"simple" | "franka">(
    "simple"
  );
  const [websocketUrl, setWebsocketUrl] = useState<string>("");
  const [showDialog, setShowDialog] = useState(false);

  const handleOpenedWindow = (windowName: string) => {
    if (windowName === "start") {
      setShowDialog(true);
    } else {
      setOpenedWindow(windowName === openedWindow ? null : windowName);
    }
  };

  const handleStartSimulation = () => {
    setCurrentScene("franka");
    setShowDialog(false);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setWebsocketUrl("");
  };

  return (
    <div>
      <div className="absolute top-2 right-5 text-white"> mvp v0.4</div>
      <MainNav
        onButtonClick={handleOpenedWindow}
        onPlaySimulation={handleStartSimulation}
      />
      <Window position="right" windowTag={openedWindow} />
      <div className="absolute bottom-4 left-7 text-white">
        <a href="https://www.netlify.com">
          <img
            src="/netlify-dark.svg"
            alt="Deploys by Netlify"
            className="sm:h-8"
          />
        </a>
      </div>

      {currentScene === "simple" && <SimpleScene />}
      {currentScene === "franka" && <FrankaScene websocketUrl={websocketUrl} />}

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter WebSocket URL</DialogTitle>
          </DialogHeader>
          <Input
            value={websocketUrl}
            onChange={(e) => setWebsocketUrl(e.target.value)}
            placeholder="ws://localhost:8080"
          />
          <DialogFooter>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleStartSimulation}>Start Simulation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DefaultLayout;
