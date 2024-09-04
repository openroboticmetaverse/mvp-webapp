import * as THREE from "three";

export class CustomObject3D extends THREE.Object3D {
  customId: number;
  sceneId: string;
  material: THREE.Material;

  constructor(customId: number, name: string, sceneId: string) {
    super();
    this.customId = customId;
    this.name = name;
    this.sceneId = sceneId;
    this.material = new THREE.MeshStandardMaterial();
    this.castShadow = false;
    this.receiveShadow = false;
  }

  move(position: THREE.Vector3) {
    this.position.copy(position);
  }

  rotate(rotation: THREE.Euler) {
    this.rotation.copy(rotation);
  }

  setMaterial(material: THREE.Material) {
    this.material = material;
  }
}
