<template>
  <div>
    <the-navbar></the-navbar>
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import TheNavbar from "../components/layout/TheNavbar.vue";
</script>
