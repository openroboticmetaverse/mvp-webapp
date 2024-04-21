<template>
  <div>
    <the-navbar></the-navbar>
    <robot-browser v-if="navbarStore.isRobotBrowserActive"></robot-browser>
    <control-panel v-if="navbarStore.isControlPanelActive"></control-panel>
    <pose-display v-if="navbarStore.isPoseDisplayActive"></pose-display>
    <debug-window v-if="navbarStore.isDebugActive"></debug-window>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useNavbarStore } from "../stores/store";
import TheNavbar from "../components/layout/TheNavbar.vue";
import ControlPanel from "../components/layout/ControlPanel.vue";
import PoseDisplay from "../components/layout/PoseDisplay.vue";
import RobotBrowser from "../components/layout/RobotBrowser.vue";
import DebugWindow from "../components/layout/DebugWindow.vue";
const navbarStore = useNavbarStore();
</script>
<style scoped></style>
