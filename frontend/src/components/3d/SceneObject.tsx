import React, { memo } from "react";
import { IObject } from "@/types/Interfaces";
import { renderObject } from "./renderObject";

interface SceneObjectProps {
  object: IObject;
  setSelectedId: (id: string | null) => void;
}

const SceneObject: React.FC<SceneObjectProps> = memo(
  ({ object, setSelectedId }) => {
    return (
      <primitive object={object} onClick={() => setSelectedId(object.id)}>
        {renderObject(object, setSelectedId)}
      </primitive>
    );
  }
);

export default SceneObject;
