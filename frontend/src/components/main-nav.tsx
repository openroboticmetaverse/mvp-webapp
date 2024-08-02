import { Bot, Play, Trash2 } from "lucide-react";

import Logo from "../assets/favicon.ico";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group.tsx";

interface MainNavProps {
  onButtonClick: (name: string) => void;
}
const MainNav = ({ onButtonClick }: MainNavProps) => {
  const navButtons = [
    {
      tag: "start",
      name: "Start Simulation",
      icon: <Trash2 height={35} width={35} />,
    },
    {
      tag: "robot-browser",
      name: "Robot Browser",
      icon: <Bot height={35} width={35} />,
    },
    { tag: "delete", name: "Delete", icon: <Play height={35} width={35} /> },
  ];
  return (
    <nav className="fixed bottom-5 left-0 right-0 mx-auto w-11/12 h-20">
      <div className="bg-white bg-opacity-10 backdrop-blur-sm shadow-md flex justify-between items-center text-white z-10 rounded-lg px-10 py-5">
        <div className="flex flex-row gap-5 items-center justify-center">
          <img className="w-8 h-8 md:w-10 md:h-10" src={Logo} alt="Logo" />
          <span className="text-2xl">the open robotic metaverse</span>
        </div>
        <ToggleGroup className="flex flex-row gap-10" type="single">
          {navButtons.map(({ name, icon, tag }, index) => {
            return (
              <TooltipProvider delayDuration={100} key={index}>
                <Tooltip>
                  <TooltipTrigger onClick={() => onButtonClick(tag)}>
                    <ToggleGroupItem value={tag}>{icon}</ToggleGroupItem>
                  </TooltipTrigger>
                  <TooltipContent className="">{name}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          })}
        </ToggleGroup>
      </div>
    </nav>
  );
};

export default MainNav;
