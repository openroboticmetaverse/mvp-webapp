<template>
  <div>
    <the-navbar></the-navbar>
    <base-panel></base-panel>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from "../components/layout/TheNavbar.vue";
import BasePanel from "../components/ui/BasePanel.vue";
</script>
