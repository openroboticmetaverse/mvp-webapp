<template>
  <div>
    <ModelBrowser @model-selected="handleModelSelected" />
    <TheViewer :selectedModel="selectedModel" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import ModelBrowser from '../../components/layout/ModelBrowser.vue';
import TheViewer from '../../pages/TheViewer.vue';

const selectedModel = ref("");

function handleModelSelected(modelName) {
  selectedModel.value = modelName;
}
</script>
