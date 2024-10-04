import React, { useState, useEffect, useCallback, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, TransformControls } from "@react-three/drei";
import { Box, Sphere, Cylinder, Cone, Torus } from "./PrimitiveShapes";
import ModelLoader from "./ModelLoader";
import { fetchObjects, saveScene, ObjectData } from "../../api/mockAPIService";
import { Object3D } from "three";

const renderObject = (
  obj: ObjectData,
  handleObjectClick: (id: string) => void
) => {
  const commonProps = {
    position: obj.position,
    rotation: obj.rotation,
    scale: obj.scale,
    onClick: () => handleObjectClick(obj.id),
  };

  switch (obj.type) {
    case "box":
      return (
        <Box
          key={obj.id}
          {...commonProps}
          size={obj.size!}
          color={obj.color!}
        />
      );
    case "sphere":
      return (
        <Sphere
          key={obj.id}
          {...commonProps}
          radius={obj.radius!}
          color={obj.color!}
        />
      );
    case "cylinder":
      return (
        <Cylinder
          key={obj.id}
          {...commonProps}
          radius={obj.radius!}
          height={obj.height!}
          color={obj.color!}
        />
      );
    case "cone":
      return (
        <Cone
          key={obj.id}
          {...commonProps}
          radius={obj.radius!}
          height={obj.height!}
          color={obj.color!}
        />
      );
    case "torus":
      return (
        <Torus
          key={obj.id}
          {...commonProps}
          radius={obj.radius!}
          tubeRadius={obj.tubeRadius!}
          color={obj.color!}
        />
      );
    case "model":
      return (
        <ModelLoader
          key={obj.id}
          {...commonProps}
          url={obj.url!}
          scale={obj.scale!}
        />
      );
    default:
      return null;
  }
};

const MainScene: React.FC = () => {
  const [objects, setObjects] = useState<ObjectData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const objectRefs = useRef<{ [key: string]: React.RefObject<Object3D> }>({});

  useEffect(() => {
    fetchObjects().then(setObjects);
  }, []);

  useEffect(() => {
    objects.forEach((obj) => {
      if (!objectRefs.current[obj.id]) {
        objectRefs.current[obj.id] = React.createRef<Object3D>();
      }
      const ref = objectRefs.current[obj.id];
      if (ref.current) {
        ref.current.position.set(...obj.position);
        if (obj.rotation) ref.current.rotation.set(...obj.rotation);
        if (obj.scale) ref.current.scale.set(...obj.scale);
      }
    });
  }, [objects]);

  const handleObjectClick = useCallback(
    (id: string) => {
      setSelectedId(id === selectedId ? null : id);
    },
    [selectedId]
  );

  const handleTransformUpdate = useCallback(
    (id: string, newTransform: Partial<ObjectData>) => {
      setObjects((prevObjects) =>
        prevObjects.map((obj) =>
          obj.id === id
            ? {
                ...obj,
                position: newTransform.position || obj.position,
                rotation: newTransform.rotation || obj.rotation,
                scale: newTransform.scale || obj.scale,
              }
            : obj
        )
      );
    },
    []
  );

  const handleSaveScene = async () => {
    try {
      await saveScene(objects);
      console.log("Scene saved successfully");
    } catch (error) {
      console.error("Error saving scene:", error);
    }
  };

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Canvas>
        <OrbitControls makeDefault />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {objects.map((obj) => (
          <React.Fragment key={obj.id}>
            {renderObject(obj, handleObjectClick)}
            <primitive
              object={objectRefs.current[obj.id]?.current || new Object3D()}
            />
          </React.Fragment>
        ))}

        {selectedId && (
          <TransformControls
            object={objectRefs.current[selectedId]?.current}
            onObjectChange={(e) => {
              const target = e.target as Object3D;
              handleTransformUpdate(selectedId, {
                position: target.position.toArray() as [number, number, number],
                rotation: target.rotation.toArray() as [number, number, number],
                scale: target.scale.toArray() as [number, number, number],
              });
            }}
          />
        )}
      </Canvas>

      <button
        onClick={handleSaveScene}
        style={{ position: "absolute", bottom: 20, right: 20 }}
      >
        Save Scene
      </button>
    </div>
  );
};
export default MainScene;
