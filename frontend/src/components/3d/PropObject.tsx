import React, { useState, useEffect } from "react";
import { useLoader } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader.js";
import CustomObject3D from "./CustomObject3D";

type PropObjectProps = {
  name: string;
  type: string;
  sceneId: string;
  position: [number, number, number];
};

const PropObject: React.FC<PropObjectProps> = ({
  name,
  type,
  sceneId,
  position,
}) => {
  const [modelPath, setModelPath] = useState<string | null>(null);

  useEffect(() => {
    // In a real application, we might fetch this mapping from backend
    const modelPaths: { [key: string]: string } = {
      apple: "/static/Apple.obj",
      // Add more props as needed
    };

    setModelPath(modelPaths[type]);
  }, [type]);

  if (!modelPath) {
    return null;
  }

  const obj = useLoader(OBJLoader, modelPath);

  if (!modelPath) {
    console.warn(`No model found for type: ${type}`);
    return null;
  }

  return (
    <CustomObject3D position={position} sceneId={sceneId} name={name}>
      <primitive object={obj} scale={[0.01, 0.01, 0.01]} />
    </CustomObject3D>
  );
};

export default PropObject;
