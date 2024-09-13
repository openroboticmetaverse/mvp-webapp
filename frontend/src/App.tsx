import { useState } from "react";
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
}

export default App;
