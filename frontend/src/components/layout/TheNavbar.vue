<template>
  <div>
    <nav
      class="fixed bottom-5 left-0 right-0 mx-auto w-11/12 h-10 sm:h-20 bg-white bg-opacity-10 backdrop-blur-sm shadow-md flex justify-between items-center text-white z-10 rounded-lg px-4 md:px-10">
      <img class="w-8 h-8 md:w-10 md:h-10" src="/favicon.ico" alt="Logo" />
      <span
        class="text-xs sm:text-sm md:text-xl font-bold tracking-[0.4em] hover:tracking-[0.5em] transition-all duration-300 cursor-default">
        orom - mvp</span>

      <div class="flex space-x-2 md:space-x-8 lg:space-x-12">
        <BaseButton @click="toggleDebug()">
          <img class="w-8 h-6 md:w-10 sm:h-8 md:h-10" src="/src/assets/icons/debug.svg" alt="Debug" />
        </BaseButton>
        <BaseButton @click="toggleSimulation(); deactivateRobotBrowser()">
          <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/simulate.svg" alt="Transformation Panel" />
        </BaseButton>
        <BaseButton @click="toggleRobotBrowser(); deactivatePoseDislay()">
          <img class="w-8 h-6 md:w-10 sm:h-8 md:h-10" src="/src/assets/icons/load.svg" alt="Load Model" />
        </BaseButton>
        <BaseButton @click="toggleRemoveAll(); deactivatePoseDislay()">
          <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/remove.svg" alt="Remove Model" />
        </BaseButton>
        <BaseButton @click="toggleControlPanel">
          <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/control.svg" alt="Control Panel" />
        </BaseButton>
        <BaseButton @click="togglePoseDislay(); deactivateRobotBrowser()">
          <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/meter.svg" alt="Transformation Panel" />
        </BaseButton>
      </div>
    </nav>
  </div>
</template>

<script setup lang="ts">
import BaseButton from "../ui/BaseButton.vue";
import { useNavbarStore } from '../../stores/store';

const navbarStore = useNavbarStore();

// function deactivateControlPanel() {
//   navbarStore.deactivateControlPanel();
// }
function toggleControlPanel() {
  navbarStore.toggleControlPanel();
}
function deactivatePoseDislay() {
  navbarStore.deactivatePoseDisplay();
}
function togglePoseDislay() {
  navbarStore.togglePoseDisplay();
}
function deactivateRobotBrowser() {
  navbarStore.deactivateRobotBrowser();
}
function toggleRobotBrowser() {
  navbarStore.toggleRobotBrowser();
}
function toggleDebug() {
  navbarStore.toggleDebug();
}

function toggleRemoveAll() {
  navbarStore.toggleRemoveAll();
}

function toggleSimulation() {
  navbarStore.toggleSimulation();
}
</script>
<style></style>
