/* import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { sceneStore } from "@/stores/scene-store";

const DeleteRobot = observer(() => {
  const { objects, robots, deleteObject, deleteRobot } = sceneStore;

  const handleDelete = useCallback(
    (id: string, type: "object" | "robot") => {
      if (type === "object") {
        deleteObject(id);
      } else {
        deleteRobot(id);
      }
    },
    [deleteObject, deleteRobot]
  );

  return (
    <div className="flex flex-col gap-5">
      <h3>Objects in the Scene: </h3>
      <div className="flex flex-wrap gap-3">
        {objects.length === 0 && robots.length === 0 ? (
          <p>No objects in the scene</p>
        ) : (
          <>
            {objects.map((object, index) => (
              <div
                key={`${object.id}-${object.name}-${index}`}
                onClick={() => handleDelete(object.id, "object")}
                className="rounded border hover:bg-white p-2 
                hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {object.name}
              </div>
            ))}
            {robots.map((robot, index) => (
              <div
                key={`${robot.id}-${robot.name}-${index}`}
                onClick={() => handleDelete(robot.id, "robot")}
                className="rounded border hover:bg-white p-2 
                hover:bg-opacity-25 hover:text-muted cursor-pointer"
              >
                {robot.name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
});

export default DeleteRobot;
 */
/* 
import { useCallback, useState } from "react";
import { observer } from "mobx-react-lite";
import { objectStore, robotStore, sceneStore } from "@/stores/scene-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Square, Bot, Trash2 } from "lucide-react";

const SceneItemsList = observer(() => {
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    type: "object" | "robot";
  } | null>(null);

  const handleDelete = useCallback((id: string, type: "object" | "robot") => {
    if (type === "object") {
      objectStore.deleteObject(id);
    } else {
      robotStore.deleteRobot(id);
    }
    setItemToDelete(null);
  }, []);

  const saveChanges = useCallback(async () => {
    try {
      await objectStore.saveChanges();
      await robotStore.saveChanges();
    } catch (error) {
      console.error("Error saving changes:", error);
      // Handle error (e.g., show an error message to the user)
    }
  }, []);

  const renderItemRow = (item: any, type: "object" | "robot") => {
    const isPendingCreation =
      type === "object"
        ? objectStore.pendingCreations.has(item.id)
        : robotStore.pendingCreations.has(item.id);
    const isPendingUpdate =
      type === "object"
        ? objectStore.pendingChanges.has(item.id)
        : robotStore.pendingChanges.has(item.id);
    const isPendingDeletion =
      type === "object"
        ? objectStore.pendingDeletions.has(item.id)
        : robotStore.pendingDeletions.has(item.id);

    let rowClass = "";
    if (isPendingCreation) rowClass = "bg-green-400";
    else if (isPendingUpdate) rowClass = "bg-yellow-400";
    else if (isPendingDeletion) rowClass = "bg-red-400 ";

    return (
      <TableRow
        key={item.id}
        className={`bg-opacity-30 backdrop-blur-sm ${rowClass}`}
      >
        <TableCell>
          {type === "object" ? <Square size={16} /> : <Bot size={16} />}
        </TableCell>
        <TableCell>{item.name}</TableCell>
        <TableCell>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white bg-opacity-10 backdrop-blur-sm">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-gray-100">
                  Are you sure?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the{" "}
                  {type}.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleDelete(item.id, type)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    );
  };

  const currentSceneObjects = objectStore.objectsByScene(
    sceneStore.activeSceneId!
  );
  const currentSceneRobots = robotStore.robotsByScene(
    sceneStore.activeSceneId!
  );

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">Items in the Scene</h3>
      {currentSceneObjects.length === 0 && currentSceneRobots.length === 0 ? (
        <p>No items in the scene</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">Type</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentSceneObjects.map((object) =>
              renderItemRow(object, "object")
            )}
            {currentSceneRobots.map((robot) => renderItemRow(robot, "robot"))}
          </TableBody>
        </Table>
      )}
      <Button
        onClick={saveChanges}
        className="bg-white  text-gray-800 hover:bg-opacity-50 hover:bg-gray-300 hover:text-whitesssssssssssss"
      >
        Save Changes
      </Button>
    </div>
  );
});

export default SceneItemsList;
 */

import { useCallback } from "react";
import { observer } from "mobx-react-lite";
import { objectStore, robotStore, sceneStore } from "@/stores/scene-store";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Square, Trash2 } from "lucide-react";

const SceneItemsList = observer(() => {
  const handleDelete = useCallback((id: string, type: "object" | "robot") => {
    if (type === "object") {
      objectStore.deleteObject(id);
    } else {
      robotStore.deleteRobot(id);
    }
  }, []);

  const saveChanges = useCallback(async () => {
    try {
      await objectStore.saveChanges();
      await robotStore.saveChanges();
    } catch (error) {
      console.error("Error saving changes:", error);
    }
  }, []);

  const renderItemRow = (item: any, type: "object" | "robot") => (
    <TableRow
      key={item.id}
      className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm"
    >
      <TableCell className="py-1">
        <Square size={16} className="text-white" />
      </TableCell>
      <TableCell className="py-1 text-white">{item.name}</TableCell>
      <TableCell className="py-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 rounded p-0"
          onClick={() => handleDelete(item.id, type)}
        >
          <Trash2 className="h-4 w-4 text-white" />
        </Button>
      </TableCell>
    </TableRow>
  );

  const currentSceneObjects = objectStore.objectsByScene(
    sceneStore.activeSceneId!
  );
  const currentSceneRobots = robotStore.robotsByScene(
    sceneStore.activeSceneId!
  );

  return (
    <div className=" p-4 rounded-lg">
      <h3 className=" mb-2 text-2xl font-bold text-gray-100">Items List</h3>
      <p className="text-gray-100 italic">
        Scene: {sceneStore.activeScene?.name}
      </p>
      <Table>
        <TableHeader>
          <TableRow className="border-b">
            <TableHead className="w-[50px] text-white font-normal">
              Type
            </TableHead>
            <TableHead className="text-white font-normal">Name</TableHead>
            <TableHead className="w-[50px] text-white font-normal">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentSceneObjects.map((object) => renderItemRow(object, "object"))}
          {currentSceneRobots.map((robot) => renderItemRow(robot, "robot"))}
        </TableBody>
      </Table>
      <Button
        onClick={saveChanges}
        variant={"secondary"}
        className="rounded border hover:bg-white hover:bg-opacity-25 hover:text-gray-300 mt-4 w-full"
      >
        Save Changes
      </Button>
    </div>
  );
});

export default SceneItemsList;
