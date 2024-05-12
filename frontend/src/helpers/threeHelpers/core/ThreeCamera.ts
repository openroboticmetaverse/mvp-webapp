import * as THREE from "three";
import { FOV, NEAR, FAR } from "./constants/ThreeConstants";

export class ThreeCamera extends THREE.PerspectiveCamera {
  constructor(aspectRatio: number) {
    super(FOV, aspectRatio, NEAR, FAR);

    this.position.set(40, 50, 12);
  }
}
