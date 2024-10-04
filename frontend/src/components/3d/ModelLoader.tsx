import React, { useEffect, useState } from "react";
import { useLoader } from "@react-three/fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Vector3 } from "three";

import * as THREE from "three";

interface ModelLoaderProps {
  url: string;
  position: Vector3 | [number, number, number];
  scale: Vector3 | [number, number, number];
  onClick?: () => void;
}

const ModelLoader: React.FC<ModelLoaderProps> = ({
  url,
  position,
  scale,
  onClick,
}) => {
  const [model, setModel] = useState<THREE.Group | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loader = new GLTFLoader();
    loader.load(
      url,
      (gltf) => setModel(gltf.scene),
      undefined,
      (error) => setError(error)
    );
  }, [url]);

  if (error) {
    console.error("Error loading model:", error);
    return null;
  }

  if (!model) {
    return null; // or a loading placeholder
  }

  return (
    <primitive
      object={model}
      position={position}
      scale={scale}
      onClick={onClick}
    />
  );
};

export default ModelLoader;
