// frontend/src/components/3d/renderObject.tsx
import React from "react";
import { ObjectData } from "../../api/sceneService";

export const renderObject = (
  obj: ObjectData,
  setSelectedId: (id: string) => void
) => {
  return (
    <mesh
      position={obj.position}
      rotation={obj.orientation}
      scale={obj.scale}
      onClick={() => setSelectedId(obj.id)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={obj.color} />
    </mesh>
  );
};
