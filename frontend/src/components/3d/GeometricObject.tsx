import React, { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import {
  GeometricObject,
  PrimitiveType,
  GeometryParameters,
} from "@/models/GerometricObject";

interface GeometricObjectProps {
  id: number;
  name: string;
  sceneId: string;
  primitiveType: PrimitiveType;
  parameters?: GeometryParameters;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
  color?: string;
}

export const GeometricObjectComponent: React.FC<GeometricObjectProps> = ({
  id,
  name,
  sceneId,
  primitiveType,
  parameters,
  position,
  rotation,
  scale,
  color,
}) => {
  const { scene } = useThree();
  const objectRef = useRef<GeometricObject | null>(null);

  useEffect(() => {
    // Create the GeometricObject
    const object = new GeometricObject(
      id,
      name,
      sceneId,
      primitiveType,
      parameters
    );
    objectRef.current = object;

    // Set position, rotation, and scale
    if (position) object.position.set(...position);
    if (rotation) object.rotation.set(...rotation);
    if (scale) object.scale.set(...scale);

    // Set color if provided
    if (color) object.setColor(color);

    // Add to the scene
    scene.add(object);

    // Clean up
    return () => {
      scene.remove(object);
      object.geometry.dispose();
      if (object.material instanceof THREE.Material) {
        object.material.dispose();
      }
    };
  }, [
    id,
    name,
    sceneId,
    primitiveType,
    parameters,
    position,
    rotation,
    scale,
    color,
    scene,
  ]);

  useEffect(() => {
    if (objectRef.current) {
      objectRef.current.setPrimitiveType(primitiveType, parameters);
    }
  }, [primitiveType, parameters]);

  useEffect(() => {
    if (objectRef.current && color) {
      objectRef.current.setColor(color);
    }
  }, [color]);

  // The component doesn't render anything directly, it just adds the object to the scene
  return null;
};
export default GeometricObjectComponent;
