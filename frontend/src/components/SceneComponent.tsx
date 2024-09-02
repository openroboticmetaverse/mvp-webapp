import React, { useRef, useEffect, useState } from "react";
import { useSceneStore } from "../stores/SceneStore";
import { Scene, GeometricObject, Robot } from "../interfaces/SceneInterfaces";
import { GeometricObjectComponent } from "./GeometricObjectComponent";
// import { RobotComponent } from "./RobotComponent";
import { TransformControls, OrbitControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SceneComponentProps extends Scene {}

const SceneComponent: React.FC<SceneComponentProps> = ({ id, name }) => {
  console.log(`Rendering SceneComponent: id=${id}, name=${name}`);

  const getObjectsBySceneId = useSceneStore(
    (state) => state.getObjectsBySceneId
  );
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const setSelectedObject = useSceneStore((state) => state.setSelectedObject);
  const objects = getObjectsBySceneId(id);

  console.log(`Selected object ID: ${selectedObjectId}`);
  console.log(`Number of objects in scene: ${objects.length}`);

  const objectRefs = useRef<{ [key: string]: THREE.Object3D | null }>({});
  const [selectedObject, setSelectedObjectRef] =
    useState<THREE.Object3D | null>(null);
  const { scene } = useThree();

  useEffect(() => {
    console.log("SceneComponent mounted or updated");
    return () => {
      console.log("SceneComponent will unmount");
    };
  });

  useEffect(() => {
    if (selectedObjectId && objectRefs.current[selectedObjectId]) {
      const obj = objectRefs.current[selectedObjectId];
      if (obj && obj.parent) {
        setSelectedObjectRef(obj);
        console.log(`Selected object set: ${selectedObjectId}`);
      } else {
        console.log(
          `Selected object not ready or not in scene: ${selectedObjectId}`
        );
      }
    } else {
      setSelectedObjectRef(null);
      console.log(
        `No object selected or object not found: ${selectedObjectId}`
      );
    }
  }, [selectedObjectId, objects]);

  useFrame(() => {
    console.log("Frame rendered");
    Object.entries(objectRefs.current).forEach(([id, ref]) => {
      if (ref) {
        console.log(`Object ${id} position:`, ref.position);
      }
    });
  });

  return (
    <group name={name}>
      {objects.map((obj) => {
        const isSelected = obj.id === selectedObjectId;
        console.log(`Rendering object: id=${obj.id}, isSelected=${isSelected}`);

        const CommonProps = {
          key: obj.id,
          onClick: (event: React.MouseEvent) => {
            console.log(`Object clicked: id=${obj.id}`);
            event.stopPropagation();
            setSelectedObject(obj.id);
          },
          selected: isSelected,
          ref: (el: THREE.Object3D | null) => {
            console.log(`Setting ref for object: id=${obj.id}`);
            if (el) {
              objectRefs.current[obj.id] = el;
              if (isSelected) {
                setSelectedObjectRef(el);
              }
            }
          },
        };

        let Component;
        if ("shape" in obj) {
          console.log(
            `Creating GeometricObjectComponent for object: id=${obj.id}`
          );
          Component = (
            <GeometricObjectComponent
              {...(obj as GeometricObject)}
              {...CommonProps}
            />
          );
        } else if ("type_name" in obj) {
          console.log(`Creating RobotComponent for object: id=${obj.id}`);
          // Component = <RobotComponent {...(obj as Robot)} {...CommonProps} />;
        }

        return Component;
      })}
      {selectedObject && (
        <TransformControls object={selectedObject} mode="translate" />
      )}
    </group>
  );
};

export default SceneComponent;
