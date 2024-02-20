<template>
    <div>
        <div
            :class="`fixed bottom-36 top-12 ${computedPosition} h-4/5 w-3/12 bg-white bg-opacity-10 backdrop-blur-sm shadow-md flex justify-between items-center text-white z-10 rounded-lg  `">

            <div class="flex space-x-2 md:space-x-8 lg:space-x-12">

            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

import { defineProps, computed } from 'vue';

const { position } = defineProps({
    position: {
        type: String,
        default: "left",
        validator: (value: string) => ['left', 'right'].includes(value),
    }

});

const computedPosition = computed(() => {
  return position === 'left' ? 'left-16' : 'right-16';
});

</script>
<style></style>
  