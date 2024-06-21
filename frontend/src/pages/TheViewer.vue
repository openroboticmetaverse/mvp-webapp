<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { ThreeHelper } from '../helpers/threeHelpers/core/ThreeHelper';
import * as THREE from 'three';
import { useNavbarStore } from '../stores/store';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const props = defineProps({
  selectedModel: String
});

const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper | null = null;
let recentMesh: THREE.Mesh | null = null;
let transformControls: TransformControls | null = null;

const navbarSelector = useNavbarStore();

onMounted(() => {
  if (canvas.value) {
    console.log("Canvas mounted");
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();

    // Initialize TransformControls
    if (threeHelper) {
      transformControls = new TransformControls(threeHelper.camera, threeHelper.renderer.domElement);
      threeHelper.scene.add(transformControls);

      // Add event listeners
      transformControls.addEventListener('change', () => threeHelper.renderer.render(threeHelper.scene, threeHelper.camera));
      transformControls.addEventListener('dragging-changed', (event) => {
        threeHelper.controls.enabled = !event.value;

        // Customize TransformControls
        transformControls.setMode('translate'); // 'translate', 'rotate', 'scale'
        transformControls.size = 1; // Default size is 1
        transformControls.showX = true; // Show/hide X axis
        transformControls.showY = true; // Show/hide Y axis
        transformControls.showZ = true; // Show/hide Z axis
        transformControls.translationSnap = 0.2; // Enable snapping for translations (0.5 units)
        transformControls.rotationSnap = THREE.MathUtils.degToRad(15); // Enable snapping for rotations (15 degrees)
        transformControls.space = 'world'; // 'world' or 'local' space
      });
    }

    watch(() => props.selectedModel, (modelName) => {
      if (modelName) {
        console.log("Selected model changed:", modelName);
        addModelToScene(modelName);
      }
    });

    watch(() => navbarSelector.isRemoveAll, (isRemoveAll) => {
      if (isRemoveAll) {
        console.log("Remove all triggered");
        removeRecentMesh();
        navbarSelector.isRemoveAll = false; // Reset the flag
      }
    });
  }
});

onUnmounted(() => {
  if (threeHelper) {
    threeHelper.dispose();
  }
});

function addModelToScene(modelName: string) {
  let geometry: THREE.BufferGeometry | undefined;
  console.log("Adding model to scene:", modelName);

  switch (modelName) {
    case 'cube':
      geometry = new THREE.BoxGeometry(1, 1, 1);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(0.5, 32, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
      break;
    default:
      console.error("Unknown model name:", modelName);
      return;
  }

  const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);

  if (threeHelper) {
    threeHelper.add(mesh);
    recentMesh = mesh; // Track the most recently added mesh
    console.log("Model added to scene:", mesh);

    // Attach TransformControls to the recent mesh
    if (transformControls) {
      transformControls.attach(recentMesh);
    }
  }
}

function removeRecentMesh() {
  if (threeHelper && recentMesh) {
    console.log("Removing recent mesh:", recentMesh);
    threeHelper.remove(recentMesh);
    if (transformControls) {
      transformControls.detach();
    }
    recentMesh = null; // Clear the reference after removal
    console.log("Recent model removed from scene");
  } else {
    console.log("No recent mesh to remove");
  }
}
</script>

<style>
.canvas {
  display: block;
  overflow: hidden;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  position: absolute;
}
</style>
