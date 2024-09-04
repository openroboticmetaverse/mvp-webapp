import * as THREE from "three";
import { CustomObject3D } from "./CustomObject3D";

export type PrimitiveType =
  | "cube"
  | "sphere"
  | "cylinder"
  | "cone"
  | "torus"
  | "custom";

export type GeometryParameters = {
  cube?: { width?: number; height?: number; depth?: number };
  sphere?: { radius?: number; widthSegments?: number; heightSegments?: number };
  cylinder?: {
    radiusTop?: number;
    radiusBottom?: number;
    cylinderHeight?: number;
    radialSegments?: number;
  };
  cone?: {
    coneRadius?: number;
    coneHeight?: number;
    coneRadialSegments?: number;
  };
  torus?: {
    torusRadius?: number;
    tube?: number;
    torusRadialSegments?: number;
    tubularSegments?: number;
  };
};

export class GeometricObject extends CustomObject3D {
  geometry: THREE.BufferGeometry;
  color: string;
  primitiveType: PrimitiveType;
  parameters: GeometryParameters;

  constructor(
    customId: number,
    name: string,
    sceneId: string,
    primitiveType: PrimitiveType = "custom",
    parameters: GeometryParameters = {}
  ) {
    super(customId, name, sceneId);
    this.primitiveType = primitiveType;
    this.parameters = parameters;
    this.geometry = this.createGeometry();
    this.color = "#ffffff";
    this.createMesh();
  }

  private createGeometry(): THREE.BufferGeometry {
    switch (this.primitiveType) {
      case "cube":
        const { width = 1, height = 1, depth = 1 } = this.parameters.cube || {};
        return new THREE.BoxGeometry(width, height, depth);
      case "sphere":
        const {
          radius = 1,
          widthSegments = 32,
          heightSegments = 32,
        } = this.parameters.sphere || {};
        return new THREE.SphereGeometry(radius, widthSegments, heightSegments);
      case "cylinder":
        const {
          radiusTop = 1,
          radiusBottom = 1,
          cylinderHeight = 1,
          radialSegments = 32,
        } = this.parameters.cylinder || {};
        return new THREE.CylinderGeometry(
          radiusTop,
          radiusBottom,
          cylinderHeight,
          radialSegments
        );
      case "cone":
        const {
          coneRadius = 1,
          coneHeight = 1,
          coneRadialSegments = 32,
        } = this.parameters.cone || {};
        return new THREE.ConeGeometry(
          coneRadius,
          coneHeight,
          coneRadialSegments
        );
      case "torus":
        const {
          torusRadius = 1,
          tube = 0.4,
          torusRadialSegments = 8,
          tubularSegments = 32,
        } = this.parameters.torus || {};
        return new THREE.TorusGeometry(
          torusRadius,
          tube,
          torusRadialSegments,
          tubularSegments
        );
      default:
        return new THREE.BufferGeometry();
    }
  }

  private createMesh() {
    const material = new THREE.MeshStandardMaterial({ color: this.color });
    const mesh = new THREE.Mesh(this.geometry, material);
    this.add(mesh);
  }

  setGeometry(geometry: THREE.BufferGeometry) {
    this.geometry = geometry;
    this.primitiveType = "custom";
    this.updateMesh();
  }

  setPrimitiveType(type: PrimitiveType, parameters?: GeometryParameters) {
    this.primitiveType = type;
    if (parameters) {
      this.parameters = { ...this.parameters, ...parameters };
    }
    this.geometry = this.createGeometry();
    this.updateMesh();
  }

  setColor(color: string) {
    this.color = color;
    this.updateMesh();
  }

  updateParameters(parameters: GeometryParameters) {
    this.parameters = { ...this.parameters, ...parameters };
    if (this.primitiveType !== "custom") {
      this.geometry = this.createGeometry();
      this.updateMesh();
    }
  }

  private updateMesh() {
    this.remove(...this.children);
    this.createMesh();
  }
}
