import React from "react";
import { Vector3 } from "three";

interface BaseShapeProps {
  position: Vector3 | [number, number, number];
  color: string;
  onClick?: () => void;
}

interface BoxProps extends BaseShapeProps {
  size: [number, number, number];
}

interface SphereProps extends BaseShapeProps {
  radius: number;
}

interface CylinderProps extends BaseShapeProps {
  radius: number;
  height: number;
}

interface ConeProps extends BaseShapeProps {
  radius: number;
  height: number;
}

interface TorusProps extends BaseShapeProps {
  radius: number;
  tubeRadius: number;
}

export const Box: React.FC<BoxProps> = ({ position, size, color, onClick }) => (
  <mesh position={position} onClick={onClick}>
    <boxGeometry args={size} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export const Sphere: React.FC<SphereProps> = ({
  position,
  radius,
  color,
  onClick,
}) => (
  <mesh position={position} onClick={onClick}>
    <sphereGeometry args={[radius, 32, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export const Cylinder: React.FC<CylinderProps> = ({
  position,
  radius,
  height,
  color,
  onClick,
}) => (
  <mesh position={position} onClick={onClick}>
    <cylinderGeometry args={[radius, radius, height, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export const Cone: React.FC<ConeProps> = ({
  position,
  radius,
  height,
  color,
  onClick,
}) => (
  <mesh position={position} onClick={onClick}>
    <coneGeometry args={[radius, height, 32]} />
    <meshStandardMaterial color={color} />
  </mesh>
);

export const Torus: React.FC<TorusProps> = ({
  position,
  radius,
  tubeRadius,
  color,
  onClick,
}) => (
  <mesh position={position} onClick={onClick}>
    <torusGeometry args={[radius, tubeRadius, 16, 100]} />
    <meshStandardMaterial color={color} />
  </mesh>
);
