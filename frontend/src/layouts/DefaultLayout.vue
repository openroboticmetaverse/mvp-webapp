<template>
  <div>
    <the-navbar></the-navbar>
    <model-browser v-if="navbarStore.isRobotBrowserActive" @model-selected="handleModelSelected"></model-browser>
    <control-panel v-if="navbarStore.isControlPanelActive"></control-panel>
    <pose-display v-if="navbarStore.isPoseDisplayActive"></pose-display>
    <debug-window v-if="navbarStore.isDebugActive"></debug-window>
    <info-panel></info-panel>
    <main>
      <router-view></router-view>
      <TheViewer :selectedModel="selectedModel" />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useNavbarStore } from "../stores/store";
import TheNavbar from "../components/layout/TheNavbar.vue";
import ControlPanel from "../components/layout/ControlPanel.vue";
import PoseDisplay from "../components/layout/PoseDisplay.vue";
import ModelBrowser from "../components/layout/ModelBrowser.vue";
import DebugWindow from "../components/layout/DebugWindow.vue";
import InfoPanel from "../components/layout/InfoPanel.vue";
import TheViewer from '../pages/TheViewer.vue';

const navbarStore = useNavbarStore();
const selectedModel = ref("");

function handleModelSelected(modelName) {
  selectedModel.value = modelName;
}
</script>
<style scoped></style>
