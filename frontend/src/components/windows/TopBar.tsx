import React from "react";
import { observer } from "mobx-react-lite";
import { Save, Undo, Redo, Wifi } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sceneStore, objectStore, robotStore } from "@/stores/scene-store";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// TODO: Add undo and redo functionality
// TODO: Add a proper check for pending changes

const TopBar: React.FC = observer(() => {
  // Handler for saving all changes
  const handleSaveChanges = async () => {
    try {
      await sceneStore.saveChanges();
      await objectStore.saveChanges();
      await robotStore.saveChanges();
      console.log("All changes saved successfully");
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  };

  // Check if there are any pending changes
  // Current check is lazy and only checks if there are any pending changes
  // that haven't been saved yet
  const hasPendingChanges =
    sceneStore.pendingChanges.size > 0 ||
    sceneStore.pendingCreations.size > 0 ||
    sceneStore.pendingDeletions.size > 0 ||
    objectStore.pendingChanges.size > 0 ||
    objectStore.pendingCreations.size > 0 ||
    objectStore.pendingDeletions.size > 0 ||
    robotStore.pendingChanges.size > 0 ||
    robotStore.pendingCreations.size > 0 ||
    robotStore.pendingDeletions.size > 0;

  // Get the total number of objects and robots in the current scene
  const objectCount = sceneStore.currentSceneObjects.length;
  const robotCount = sceneStore.currentSceneRobots.length;

  const getWebSocketStatusColor = () => {
    switch (robotStore.overallWebSocketStatus) {
      case "connected":
        return "text-green-500";
      case "connecting":
        return "text-yellow-500";
      case "error":
        return "text-red-500";
      case "disconnected":
      default:
        return "text-gray-500";
    }
  };

  const getWebSocketStatusText = () => {
    switch (robotStore.overallWebSocketStatus) {
      case "connected":
        return "All WebSockets connected";
      case "connecting":
        return "WebSockets connecting";
      case "error":
        return "WebSocket error";
      case "disconnected":
      default:
        return "WebSockets disconnected";
    }
  };

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-10 backdrop-blur-sm shadow-md text-white rounded-full px-4 py-2 flex items-center space-x-4 z-10">
      <span className="text-md">Meetup Demo #2</span>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSaveChanges}
              disabled={!hasPendingChanges}
              className={`p-1 ${hasPendingChanges ? "text-yellow-400" : ""}`}
            >
              <Save className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Save All Changes</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={`${getWebSocketStatusColor()} transition-colors duration-300`}
            >
              <Wifi size={20} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{getWebSocketStatusText()}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      {/* Add Undo and Redo buttons if you implement that functionality
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
              }}
              disabled={true} // Enable when undo is implemented
              className="p-1"
            >
              <Undo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Undo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
              }}
              disabled={true} // Enable when redo is implemented
              className="p-1"
            >
              <Redo className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Redo</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider> */}

      <div className="w-px h-4 bg-gray-300" />
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-semibold text-gray-100">
              mvp v0.6
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>Version</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
});

export default TopBar;
