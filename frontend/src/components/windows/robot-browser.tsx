import WindowCard from "@/components/ui/window-card.tsx";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Bot, Box, Cylinder, Globe } from "lucide-react";
import { useModel } from "@/contexts/SelectedModelContext.tsx";

const RobotBrowser = () => {
  const { setModelName } = useModel();
  const robotsList = [
    {
      name: "Cube",
      description: "A basic cube",
      icon: <Box size={50} />,
      lastUpdated: "June 2024",
    },
    {
      name: "Sphere",
      description: "A basic sphere",
      icon: <Globe size={50} />,
    },
    {
      name: "Cylinder",
      description: "A basic cylinder",
      icon: <Cylinder size={50} />,
    },
    {
      name: "Franka",
      description: "A Franka Emika robot arm",
      icon: <Bot size={50} />,
    },
    {
      name: "Sawyer",
      description: "A Sawyer robot arm",
      icon: <Bot size={50} />,
    },
  ];
  return (
    <div className="flex flex-wrap  gap-5 ">
      {robotsList.map(({ name, description, icon, lastUpdated }) => {
        return (
          <HoverCard openDelay={200} closeDelay={200}>
            <HoverCardTrigger>
              <div
                onClick={() => setModelName(name)}
                className="rounded border hover:bg-white p-2 hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {icon}
              </div>
            </HoverCardTrigger>
            <HoverCardContent>
              <WindowCard
                description={description}
                title={name}
                lastUpdated={lastUpdated}
              />
            </HoverCardContent>
          </HoverCard>
        );
      })}
    </div>
  );
};

export default RobotBrowser;
