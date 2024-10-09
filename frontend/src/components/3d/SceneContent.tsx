import React, { useRef, useState, useEffect } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import { Object3D } from "three";
import { sceneStore, objectStore, robotStore } from "@/stores/scene-store";
import SceneObject from "./SceneObject";
import SceneRobot from "./SceneRobot";
import CustomTransformControls from "./CustomTransformControls";
import SceneEnvironment from "./SceneEnvironment";
import { IObject, IRobot } from "@/types/Interfaces";

const SceneContent: React.FC = observer(() => {
  const { scene } = useThree();
  const objectsRef = useRef<{ [key: string]: Object3D }>({});
  const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);

  useEffect(() => {
    // Clean up objects when component unmounts
    return () => {
      Object.values(objectsRef.current).forEach((obj) => {
        scene.remove(obj);
      });
    };
  }, [scene]);

  useFrame(() => {
    if (sceneStore.activeScene) {
      const sceneId = sceneStore.activeScene.id;
      updateSceneObjects(sceneId);
      updateSceneRobots(sceneId);
      removeStaleObjects(sceneId);
      updateSelectedObject();
    }
  });

  // Function to update scene objects
  const updateSceneObjects = (sceneId: string) => {
    objectStore.getObjectsForScene(sceneId).forEach((obj) => {
      updateOrCreateObject(obj, "object");
    });
  };

  // Function to update scene robots
  const updateSceneRobots = (sceneId: string) => {
    robotStore.getRobotsForScene(sceneId).forEach((robot) => {
      updateOrCreateObject(robot, "robot");
    });
  };

  // Function to update or create an object in the scene
  const updateOrCreateObject = (
    item: IObject | IRobot,
    type: "object" | "robot"
  ) => {
    if (!objectsRef.current[item.id]) {
      const newObject = createObject(item, type);
      scene.add(newObject);
      objectsRef.current[item.id] = newObject;
    } else {
      updateObjectProperties(objectsRef.current[item.id], item);
    }
  };

  // Function to create a new Object3D
  const createObject = (
    item: IObject | IRobot,
    type: "object" | "robot"
  ): Object3D => {
    const newObject = new Object3D();
    updateObjectProperties(newObject, item);
    newObject.userData = { id: item.id, type };
    return newObject;
  };

  // Function to update Object3D properties
  const updateObjectProperties = (object: Object3D, item: IObject | IRobot) => {
    object.position.set(...item.position);
    object.rotation.set(...item.orientation);
    object.scale.set(...item.scale);
  };

  // Function to remove stale objects from the scene
  const removeStaleObjects = (sceneId: string) => {
    Object.keys(objectsRef.current).forEach((id) => {
      const objectExists = objectStore
        .getObjectsForScene(sceneId)
        .some((obj) => obj.id === id);
      const robotExists = robotStore
        .getRobotsForScene(sceneId)
        .some((robot) => robot.id === id);
      if (!objectExists && !robotExists) {
        scene.remove(objectsRef.current[id]);
        delete objectsRef.current[id];
      }
    });
  };

  // Function to update the selected object
  const updateSelectedObject = () => {
    const selectedId = sceneStore.activeScene?.selectedId;
    if (selectedId && objectsRef.current[selectedId]) {
      setSelectedObject(objectsRef.current[selectedId]);
    } else {
      setSelectedObject(null);
    }
  };

  const handleObjectChange = (event: any) => {
    const target = event.target.object;
    const id = target.userData.id;
    const updates = {
      position: target.position.toArray(),
      orientation: target.rotation.toArray(),
      scale: target.scale.toArray(),
    };
    if (target.userData.type === "object") {
      objectStore.updateObject(id, updates);
    } else if (target.userData.type === "robot") {
      robotStore.updateRobot(id, updates);
    }
  };

  if (!sceneStore.activeScene) {
    return null;
  }

  return (
    <>
      <SceneEnvironment />
      {Object.entries(objectsRef.current).map(([id, obj]) => {
        const isObject = obj.userData.type === "object";
        const item = isObject
          ? objectStore.getItemById(id)
          : robotStore.getItemById(id);

        if (!item) return null;

        return isObject ? (
          <SceneObject
            key={id}
            object={item as IObject}
            setSelectedId={(selectedId) =>
              sceneStore.updateScene(sceneStore.activeScene!.id, { selectedId })
            }
          />
        ) : (
          <SceneRobot
            key={id}
            robot={item as IRobot}
            setSelectedId={(selectedId) =>
              sceneStore.updateScene(sceneStore.activeScene!.id, { selectedId })
            }
          />
        );
      })}
      {selectedObject && (
        <CustomTransformControls
          object={selectedObject}
          onObjectChange={handleObjectChange}
        />
      )}
    </>
  );
});

export default SceneContent;
