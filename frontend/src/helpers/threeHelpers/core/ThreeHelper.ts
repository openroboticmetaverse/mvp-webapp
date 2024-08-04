import { ThreeScene } from "./ThreeScene";
import { ThreeCamera } from "./ThreeCamera";
import { ThreeControls } from "./ThreeControls";
import { ThreeRenderer } from "./ThreeRenderer";
import { ThreeGrid } from "./ThreeGrid";
import { ThreeLights } from "./ThreeLights";
import { MAX_SCALE } from "./constants/ThreeConstants";
import type { IThreeHelper } from "../interfaces/IThreeHelper";
import {
  AmbientLight,
  Object3D,
  WebGLRenderer,
  WebGLRenderTarget,
} from "three";

export class ThreeHelper implements IThreeHelper {
  public scene: ThreeScene;
  public camera: ThreeCamera;
  public renderer: ThreeRenderer;
  public controls: ThreeControls;
  private grid: ThreeGrid;
  private scale: number;
  private lights: ThreeLights;
  private animationId: number | null = null;

  constructor(private container?: HTMLCanvasElement) {
    console.log("Initializing ThreeHelper");
    this.scale = 0.01;
    this.scene = new ThreeScene();
    this.camera = new ThreeCamera(window.innerWidth / window.innerHeight);
    this.renderer = new ThreeRenderer(this.container);
    this.renderer.shadowMap.enabled = true; // Enable shadow map
    this.controls = new ThreeControls(this.camera, this.renderer.domElement);
    this.grid = new ThreeGrid();
    this.lights = new ThreeLights();

    this.scene.add(this.grid.getGridMesh());
    this.lights.forEach((light) => {
      if (!(light instanceof AmbientLight)) {
        light.castShadow = true; // Enable shadows for non-AmbientLight
      }
      this.scene.add(light);
    });

    this.setupWindowResize(this.camera, this.renderer);
  }

  private setupWindowResize(
    camera: ThreeCamera,
    renderer: ThreeRenderer
  ): void {
    const onResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", onResize);

    // Clean up the event listener on dispose
    this.disposeEventListener = () =>
      window.removeEventListener("resize", onResize);
  }

  private disposeEventListener: () => void = () => {};

  public add(mesh: Object3D): void {
    console.log("Adding object to scene:", mesh);
    this.scene.add(mesh);
  }

  public getObjectById(id: number): Object3D {
    return this.scene.getObjectById(id);
  }

  public clear(): void {
    this.scene.clear();
  }

  public remove(mesh: Object3D): void {
    console.log("Removing object from scene:", mesh);
    this.scene.remove(mesh);
  }

  public animate(): void {
    const animateLoop = () => {
      this.animationId = requestAnimationFrame(animateLoop);

      if (this.scale < MAX_SCALE) {
        this.scale += 0.005;
        this.grid.getGridMesh().scale.set(this.scale, this.scale, this.scale);
      }

      this.controls.update();
      this.renderer.render(this.scene, this.camera);
    };
    console.log("Starting animation loop");
    animateLoop();
  }

  public dispose(): void {
    console.log("Disposing ThreeHelper");
    if (this.animationId !== null) {
      cancelAnimationFrame(this.animationId);
    }
    this.disposeEventListener();
    this.renderer.dispose();
    this.controls.dispose();

    // Optionally, dispose of scene children if needed
    this.scene.traverse((object) => {
      if (object instanceof Object3D) {
        object.geometry?.dispose();
        if (object.material instanceof Array) {
          object.material.forEach((material) => material.dispose());
        } else {
          object.material?.dispose();
        }
      }
    });
  }
}
