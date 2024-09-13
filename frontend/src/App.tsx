import { useState, useEffect } from "react";
import DefaultLayout from "@/components/default-layout";
import { SimpleScene } from "@/components/3d/SimpleScene";
import FrankaScene from "@/components/3d/FrankaScene";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function App() {
  const [openedWindow, setOpenedWindow] = useState<string | null>(null);
  const [currentScene, setCurrentScene] = useState<"simple" | "franka">(
    "simple"
  );
  const [websocketUrl, setWebsocketUrl] = useState<string>(
    "ws://localhost:8081"
  );
  const [showDialog, setShowDialog] = useState(false);

  const handleOpenedWindow = (windowName: string) => {
    if (windowName === "start") {
      setShowDialog(true);
    } else if (windowName === "stop") {
      setCurrentScene("simple");
    } else {
      setOpenedWindow(windowName === openedWindow ? null : windowName);
    }
  };

  const handleStartSimulation = () => {
    if (websocketUrl) {
      console.log("Starting simulation with WebSocket URL:", websocketUrl);
      setCurrentScene("franka");
      setShowDialog(false);
    } else {
      console.error("WebSocket URL is empty. Cannot start simulation.");
    }
  };

  const handleDialogClose = () => {
    setShowDialog(false);
  };

  useEffect(() => {
    console.log("Current WebSocket URL:", websocketUrl);
  }, [websocketUrl]);

  return (
    <div className="h-screen">
      <DefaultLayout
        openedWindow={openedWindow}
        onButtonClick={handleOpenedWindow}
        onPlaySimulation={handleStartSimulation}
      />
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
            placeholder="ws://localhost:8081"
          />
          <DialogFooter>
            <Button onClick={handleDialogClose}>Cancel</Button>
            <Button onClick={handleStartSimulation}>Start Simulation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default App;
