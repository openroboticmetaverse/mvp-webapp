<template>

  <button
    class="button m-2 px-4 py-2 bg-transparent border-0 border-white rounded text-white font-bold uppercase text-sm tracking-wide cursor-pointer transition-all duration-300 ease-in-out outline-none disabled:opacity-50 disabled:cursor-not-allowed"
    :class="{
      'hover:bg-blue-500 hover:scale-110  hover:border-blue-300':
        !disabled,
    }"
    :disabled="disabled"
  >

      <slot class="w-6 h-6"></slot>

  </button>
</template>

<script setup lang="ts">

</script>
