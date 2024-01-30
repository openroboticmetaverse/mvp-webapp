<template>
    <div>
        <div
            :class="`fixed bottom-36 ${position}  h-4/5 w-3/12 bg-white bg-opacity-10 backdrop-blur-sm shadow-md flex justify-between items-center text-white z-10 rounded-lg px-4 md:px-10`">

            <div class="flex space-x-2 md:space-x-8 lg:space-x-12">

            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

import { defineProps } from 'vue';

const { position } = defineProps({
    position: {
        type: String,
        default: 'left',
        validator: (value: string) => ['left', 'right'].includes(value),
    }

});


</script>
<style></style>
  