import React from "react";
import { TransformControls as DreiTransformControls } from "@react-three/drei";
import { Object3D } from "three";

interface CustomTransformControlsProps {
  object: Object3D;
  onObjectChange: (event: any) => void;
}

const CustomTransformControls: React.FC<CustomTransformControlsProps> = ({
  object,
  onObjectChange,
}) => {
  return (
    <DreiTransformControls
      object={object}
      onObjectChange={onObjectChange}
      size={0.7}
    />
  );
};

export default CustomTransformControls;
