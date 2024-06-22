<template>
  <!-- Canvas element for rendering the Three.js scene -->
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { ThreeHelper } from '../helpers/threeHelpers/core/ThreeHelper';
import * as THREE from 'three';
import { useNavbarStore } from '../stores/store';
import { TransformControls } from 'three/examples/jsm/controls/TransformControls';

const props = defineProps({
  selectedModel: String // Prop to receive the selected model name
});

const canvas = ref<HTMLCanvasElement | null>(null); // Reference to the canvas element
let threeHelper: ThreeHelper | null = null; // Instance of ThreeHelper for managing the Three.js scene
let recentMesh: THREE.Mesh | null = null; // Reference to the most recently added mesh
let transformControls: TransformControls | null = null; // Instance of TransformControls for manipulating objects

const navbarSelector = useNavbarStore(); // Access the navbar store

// Lifecycle hook: onMounted
onMounted(() => {
  if (canvas.value) {
    console.log("Canvas mounted");
    threeHelper = new ThreeHelper(canvas.value); // Initialize ThreeHelper with the canvas
    threeHelper.animate(); // Start the animation loop

    // Initialize TransformControls
    if (threeHelper) {
      transformControls = new TransformControls(threeHelper.camera, threeHelper.renderer.domElement);
      threeHelper.scene.add(transformControls); // Add TransformControls to the scene

      // Event listeners for TransformControls
      transformControls.addEventListener('change', () => threeHelper.renderer.render(threeHelper.scene, threeHelper.camera));
      transformControls.addEventListener('dragging-changed', (event) => {
        threeHelper.controls.enabled = !event.value; // Enable/disable controls based on dragging state
      });
    }

    // Watch for changes to the selected model prop
    watch(() => props.selectedModel, (modelName) => {
      if (modelName) {
        console.log("Selected model changed:", modelName);
        addModelToScene(modelName); // Add the selected model to the scene
      }
    });

    // Watch for the remove all flag in the navbar store
    watch(() => navbarSelector.isRemoveAll, (isRemoveAll) => {
      if (isRemoveAll) {
        console.log("Remove all triggered");
        removeRecentMesh(); // Remove the most recently added mesh
        navbarSelector.isRemoveAll = false; // Reset the flag
      }
    });
  }
});

// Lifecycle hook: onUnmounted
onUnmounted(() => {
  if (threeHelper) {
    threeHelper.dispose(); // Dispose of the ThreeHelper instance to clean up resources
  }
});

// Function to add a model to the scene
function addModelToScene(modelName: string) {
  let geometry: THREE.BufferGeometry | undefined;
  console.log("Adding model to scene:", modelName);

  // Create geometry based on the selected model name
  switch (modelName) {
    case 'cube':
      geometry = new THREE.BoxGeometry(20, 20, 20);
      break;
    case 'sphere':
      geometry = new THREE.SphereGeometry(10, 32, 32);
      break;
    case 'cylinder':
      geometry = new THREE.CylinderGeometry(10, 10, 20, 32);
      break;
    default:
      console.error("Unknown model name:", modelName);
      return;
  }

  const material = new THREE.MeshStandardMaterial({ color: 0x87CEEB }); // Light blue color
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(0, 0, 0);
  mesh.castShadow = true; // Enable shadows

  if (threeHelper) {
    threeHelper.add(mesh); // Add the mesh to the scene
    recentMesh = mesh; // Track the most recently added mesh
    console.log("Model added to scene:", mesh);

    // Attach TransformControls to the recent mesh
    if (transformControls) {
      transformControls.attach(recentMesh);
    }
  }
}

// Function to remove the most recently added mesh from the scene
function removeRecentMesh() {
  if (threeHelper && recentMesh) {
    console.log("Removing recent mesh:", recentMesh);
    threeHelper.remove(recentMesh); // Remove the mesh from the scene
    if (transformControls) {
      transformControls.detach(); // Detach TransformControls from the mesh
    }
    recentMesh = null; // Clear the reference after removal
    console.log("Recent model removed from scene");
  } else {
    console.log("No recent mesh to remove");
  }
}
</script>

<style>
/* Styles for the canvas element */
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
