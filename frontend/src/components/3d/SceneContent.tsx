import React, { useRef, useState } from "react";
import { useThree, useFrame } from "@react-three/fiber";
import { observer } from "mobx-react";
import { Object3D } from "three";
import { sceneStore } from "@/stores/scene-store";
import SceneObject from "./SceneObject";
import SceneRobot from "./SceneRobot";
import CustomTransformControls from "./CustomTransformControls";
import SceneEnvironment from "./SceneEnvironment";
import { IObject, IRobot } from "@/types/Interfaces";

const SceneContent: React.FC = observer(() => {
  const { scene } = useThree();
  const objectsRef = useRef<{ [key: string]: Object3D }>({});
  const [selectedObject, setSelectedObject] = useState<Object3D | null>(null);

  useFrame(() => {
    sceneStore.objects.forEach((obj) => updateOrCreateObject(obj, "object"));
    sceneStore.robots.forEach((robot) => updateOrCreateObject(robot, "robot"));
    removeStaleObjects();
    updateSelectedObject();
  });

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
    object.position.set(item.position[0], item.position[1], item.position[2]);
    object.rotation.set(
      item.orientation[0],
      item.orientation[1],
      item.orientation[2]
    );
    object.scale.set(item.scale[0], item.scale[1], item.scale[2]);
  };

  // Function to remove stale objects from the scene
  const removeStaleObjects = () => {
    Object.keys(objectsRef.current).forEach((id) => {
      if (
        !sceneStore.objects.some((obj) => obj.id === id) &&
        !sceneStore.robots.some((robot) => robot.id === id)
      ) {
        scene.remove(objectsRef.current[id]);
        delete objectsRef.current[id];
      }
    });
  };

  // Function to update the selected object
  const updateSelectedObject = () => {
    if (sceneStore.selectedId && objectsRef.current[sceneStore.selectedId]) {
      setSelectedObject(objectsRef.current[sceneStore.selectedId]);
    } else {
      setSelectedObject(null);
    }
  };
  const handleObjectChange = (event: any) => {
    const target = event.target.object;
    console.log("Object transformed:", target);
    const id = target.userData.id;
    const updates = {
      position: target.position.toArray(),
      orientation: target.rotation.toArray(),
      scale: target.scale.toArray(),
    };
    if (target.userData.type === "object") {
      sceneStore.updateObject(id, updates);
    } else if (target.userData.type === "robot") {
      sceneStore.updateRobot(id, updates);
    }
  };

  return (
    <>
      <SceneEnvironment />
      {/*       {Object.entries(objectsRef.current).map(([id, obj]) => {
        const isObject = obj.userData.type === "object";
        const item = isObject
          ? sceneStore.getObjectById(id)
          : sceneStore.getRobotById(id);

        if (!item) return null;

        return isObject ? (
          <SceneObject
            key={id}
            object={item as IObject}
            setSelectedId={sceneStore.setSelectedId}
          />
        ) : (
          <SceneRobot
            key={id}
            robot={item as IRobot}
            setSelectedId={sceneStore.setSelectedId}
          />
        );
      })}
      {selectedObject && (
        <CustomTransformControls
          object={selectedObject}
          onObjectChange={handleObjectChange}
        />
      )} */}
    </>
  );
});

export default SceneContent;
