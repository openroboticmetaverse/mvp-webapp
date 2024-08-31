/* import { DirectionalLight, AmbientLight, Light } from 'three'


export class ThreeLights extends Array<Light>{
  constructor() {
    super();
    this.push(new DirectionalLight(0xffeeff, 0.8));
    this[0].position.set(1, 1, 1);

    this.push(new DirectionalLight(0xffffff, 1));
    this[1].position.set(-1, 0.5, -1);

    this.push(new AmbientLight(0xffffee, 0.8));

  }
}
 */

import * as THREE from "three";

export class ThreeLights {
  private lights: THREE.Light[];

  /**
   * Initializes the ThreeLights constructor.
   *
   * This constructor creates an ambient light and a directional light with shadows.
   * The ambient light is set to a color of 0x404040.
   * The directional light is set to a color of 0xffffff and a intensity of 1.
   * The position of the directional light is set to (10, 10, 10).
   * The directional light is enabled to cast shadows.
   * The shadow map resolution is set to 1024x1024.
   * The near and far planes of the shadow camera are set to 0.5 and 500, respectively.
   *
   * @return {void} This function does not return a value.
   */
  constructor() {
    const ambientLight = new THREE.AmbientLight(0xfffdf5); // Ambient light
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Directional light
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true; // Enable shadows

    directionalLight.shadow.mapSize.width = 1024; // Shadow map resolution
    directionalLight.shadow.mapSize.height = 1024;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;

    this.lights = [ambientLight, directionalLight];
  }

  forEach(callback: (light: THREE.Light) => void): void {
    this.lights.forEach(callback);
  }
}
