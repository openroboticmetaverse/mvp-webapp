import React, { useRef, useEffect } from "react";
import { useSceneStore } from "../stores/SceneStore";
import { Scene, GeometricObject, Robot } from "../interfaces/SceneInterfaces";
import { GeometricObjectComponent } from "./GeometricObjectComponent";
import { TransformControls } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

interface SceneComponentProps extends Scene {}

const SceneComponent: React.FC<SceneComponentProps> = ({ id, name }) => {
  console.log(`Rendering SceneComponent: id=${id}, name=${name}`);

  const getObjectsBySceneId = useSceneStore(
    (state) => state.getObjectsBySceneId
  );
  const updateObject = useSceneStore((state) => state.updateObject);
  const selectedObjectId = useSceneStore((state) => state.selectedObjectId);
  const setSelectedObject = useSceneStore((state) => state.setSelectedObject);
  const transformMode = useSceneStore((state) => state.transformMode);
  const cycleTransformMode = useSceneStore((state) => state.cycleTransformMode);

  const objects = getObjectsBySceneId(id);

  console.log(`Selected object ID: ${selectedObjectId}`);
  console.log(`Number of objects in scene: ${objects.length}`);

  const objectRefs = useRef<{ [key: string]: THREE.Object3D | null }>({});
  const { scene } = useThree();

  useEffect(() => {
    console.log("SceneComponent mounted or updated");
    return () => {
      console.log("SceneComponent will unmount");
    };
  }, []);

  useFrame(() => {
    Object.entries(objectRefs.current).forEach(([id, ref]) => {
      if (ref) {
        console.log(`Object ${id} position:`, ref.position);
      }
    });
  });

  const handleTransformChange = (e) => {
    if (selectedObjectId && objectRefs.current[selectedObjectId]) {
      const obj = objectRefs.current[selectedObjectId];

      // Update the object's transform properties
      updateObject(selectedObjectId, {
        position: obj.position.toArray(),
        orientation: [obj.rotation.x, obj.rotation.y, obj.rotation.z],
        scale: obj.scale.toArray(),
      });

      // Force update on the object ref to ensure it reflects the new transform
      obj.updateMatrix();
    }
  };

  return (
    <group name={name}>
      {objects.map((obj) => {
        const isSelected = obj.id === selectedObjectId;
        console.log(`Rendering object: id=${obj.id}, isSelected=${isSelected}`);

        const CommonProps = {
          key: obj.id,
          onClick: (e: React.MouseEvent) => {
            e.stopPropagation();
            setSelectedObject(obj.id);
          },
          onPointerMissed: (e: React.MouseEvent) => {
            if (e.type === "click") setSelectedObject(null);
          },
          onContextMenu: (e: React.MouseEvent) => {
            if (selectedObjectId === obj.id) {
              e.stopPropagation();
              cycleTransformMode();
            }
          },
          selected: isSelected,
          ref: (el: THREE.Object3D | null) => {
            console.log(`Setting ref for object: id=${obj.id}`);
            if (el) {
              objectRefs.current[obj.id] = el;
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
      {selectedObjectId && (
        <TransformControls
          object={objectRefs.current[selectedObjectId]}
          mode={transformMode}
          onObjectChange={handleTransformChange}
        />
      )}
    </group>
  );
};

export default React.memo(SceneComponent);
