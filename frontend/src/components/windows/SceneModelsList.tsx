import { useState } from "react";
import { observer } from "mobx-react-lite";
import { Square, Bot, ChevronRight, ChevronDown } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { sceneStore } from "@/stores/scene-store";

const SceneModelsList = observer(() => {
  const [isObjectsOpen, setIsObjectsOpen] = useState(true);
  const [isRobotsOpen, setIsRobotsOpen] = useState(true);

  const handleItemClick = (id: string) => {
    sceneStore.setSelectedId(id);
  };

  const renderListItem = (item: {
    id: string;
    name: string;
    type: "object" | "robot";
  }) => (
    <div
      key={item.id}
      className={`flex items-center space-x-2 p-2 rounded cursor-pointer ${
        sceneStore.selectedId === item.id ? "bg-blue-600" : "hover:bg-gray-700"
      }`}
      onClick={() => handleItemClick(item.id)}
    >
      {item.type === "object" ? <Square size={16} /> : <Bot size={16} />}
      <span>{item.name}</span>
    </div>
  );

  return (
    <div className="w-64 bg-white bg-opacity-10 backdrop-blur-sm shadow-md text-white  flex flex-col">
      <h2 className="text-lg font-semibold p-4">Scene Models</h2>
      <ScrollArea className="flex-grow">
        <div className="p-4 space-y-2">
          <Collapsible open={isObjectsOpen} onOpenChange={setIsObjectsOpen}>
            <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
              {isObjectsOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="ml-2">
                Objects ({sceneStore.objects.length})
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {sceneStore.objects.map((obj) =>
                renderListItem({ ...obj, type: "object" })
              )}
            </CollapsibleContent>
          </Collapsible>

          <Collapsible open={isRobotsOpen} onOpenChange={setIsRobotsOpen}>
            <CollapsibleTrigger className="flex items-center w-full p-2 hover:bg-gray-700 rounded">
              {isRobotsOpen ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
              <span className="ml-2">Robots ({sceneStore.robots.length})</span>
            </CollapsibleTrigger>
            <CollapsibleContent>
              {sceneStore.robots.map((robot) =>
                renderListItem({ ...robot, type: "robot" })
              )}
            </CollapsibleContent>
          </Collapsible>
        </div>
      </ScrollArea>
    </div>
  );
});

export default SceneModelsList;
