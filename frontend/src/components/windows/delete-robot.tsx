import { useCallback } from "react";
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
