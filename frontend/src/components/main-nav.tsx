import { useState } from "react";
import { Bot, Play, Square, Trash } from "lucide-react";
import Logo from "../assets/favicon.ico";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface MainNavProps {
  onButtonClick: (name: string) => void;
  onPlaySimulation: (websocketUrl: string) => void;
}

const MainNav = ({ onButtonClick, onPlaySimulation }: MainNavProps) => {
  const [showDialog, setShowDialog] = useState(false);
  const [websocketUrl, setWebsocketUrl] = useState("");

  const navButtons = [
    {
      tag: "start",
      name: "Start Simulation",
      icon: <Play height={35} width={35} />,
    },
    {
      tag: "stop",
      name: "Stop Simulation",
      icon: <Square height={35} width={35} />,
    },
    {
      tag: "robot-browser",
      name: "Robot Browser",
      icon: <Bot height={35} width={35} />,
    },
    { tag: "delete", name: "Delete", icon: <Trash height={35} width={35} /> },
  ];

  const handlePlayClick = () => {
    setShowDialog(true);
  };

  const handleDialogClose = () => {
    setShowDialog(false);
    setWebsocketUrl("");
  };

  const handleStartSimulation = () => {
    onPlaySimulation(websocketUrl);
    setShowDialog(false);
  };

  return (
    <>
      <nav className="fixed bottom-[5%] left-0 right-0 mx-auto w-10/12 md:w-7/12 h-auto md:h-20">
        <div className="bg-white bg-opacity-10 backdrop-blur-sm shadow-md flex flex-col md:flex-row justify-between items-center text-white z-10 rounded-3xl md:rounded-full px-4 md:px-10 py-2 md:py-5">
          <div className="flex flex-row gap-3 md:gap-5 items-center justify-center mb-3 md:mb-0">
            <a
              href="https://www.openroboticmetaverse.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="w-8 h-8 md:w-10 md:h-10" src={Logo} alt="Logo" />
            </a>
            <span className="text-xl md:text-2xl tracking-widest text-center md:text-left">
              the open robotic metaverse
            </span>
          </div>
          <ToggleGroup className="flex flex-row gap-3 md:gap-10" type="single">
            {navButtons.map(({ name, icon, tag }) => (
              <div key={tag}>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        onClick={() => {
                          if (tag === "start") {
                            handlePlayClick();
                          } else {
                            onButtonClick(tag);
                          }
                        }}
                      >
                        <ToggleGroupItem value={tag}>{icon}</ToggleGroupItem>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>{name}</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            ))}
          </ToggleGroup>
        </div>
      </nav>

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
    </>
  );
};

export default MainNav;
