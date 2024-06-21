<template>
  <canvas ref="canvas" class="canvas"></canvas>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, onUnmounted } from 'vue';
import { ThreeHelper } from '../helpers/threeHelpers/core/ThreeHelper';
import * as THREE from 'three';
import { useNavbarStore } from '../stores/store';

const props = defineProps({
  selectedModel: String
});

const canvas = ref<HTMLCanvasElement | null>(null);
let threeHelper: ThreeHelper | null = null;

const navbarSelector = useNavbarStore();


onMounted(() => {

  watch(() => navbarSelector.isRemoveAll, async (isRemoveAll) => {
    threeHelper.remove();
  });

  if (canvas.value) {
    console.log("Canvas mounted");
    threeHelper = new ThreeHelper(canvas.value);
    threeHelper.animate();

    watch(() => props.selectedModel, (modelName) => {
      if (modelName) {
        console.log("Selected model changed:", modelName);
        addModelToScene(modelName);
      }
    });
  }
});

onUnmounted(() => {
  if (threeHelper) {
    threeHelper.dispose();
  }
});

function addModelToScene(modelName) {
  let geometry;
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
  threeHelper.add(mesh);
  console.log("Model added to scene:", mesh);
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
