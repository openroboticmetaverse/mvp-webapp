import React from "react";
import { observer } from "mobx-react-lite";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sceneStore } from "@/stores/scene-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const TopBar: React.FC = observer(() => {
  // Handler for saving the active scene
  const handleSaveScene = async () => {
    if (sceneStore.activeScene) {
      try {
        await sceneStore.updateScene(
          sceneStore.activeScene.id,
          sceneStore.activeScene
        );
        console.log("Scene saved successfully");
      } catch (error) {
        console.error("Error saving scene:", error);
      }
    } else {
      console.error("No active scene to save");
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-sm shadow-md text-white rounded-full px-4 py-2 flex items-center space-x-4 z-10">
      <span className="text-sm font-semibold truncate max-w-[200px]">
        {sceneStore.activeScene
          ? sceneStore.activeScene.name
          : "No Scene Selected"}
      </span>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-xs text-gray-400 truncate max-w-[150px]">
              {sceneStore.activeScene
                ? new Date(sceneStore.activeScene.updated_at).toLocaleString()
                : "Not available"}
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Last updated</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveScene}
              disabled={!sceneStore.activeScene}
              className="p-1"
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save Scene</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

export default TopBar;
