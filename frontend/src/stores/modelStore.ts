// modelStore.js
import { defineStore } from "pinia";
import { ref } from "vue";

export const useModelSelector = defineStore("modelSelector", () => {
  const selectedModel = ref("");
  const isLoading = ref(false);
  const errorMessage = ref("");

  function selectModel(modelName: string) {
    isLoading.value = true;
    errorMessage.value = "";

    // Simulate model loading
    setTimeout(() => {
      try {
        selectedModel.value = modelName;
        isLoading.value = false;
      } catch (error) {
        errorMessage.value = `Failed to load model: ${error.message}`;
        isLoading.value = false;
      }
    }, 1000);
  }

  function deselectModel() {
    selectedModel.value = "";
  }

  return {
    selectedModel,
    isLoading,
    errorMessage,
    selectModel,
    deselectModel,
  };
});
