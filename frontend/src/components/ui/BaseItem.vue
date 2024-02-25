<template>
    <a href="#"
        class="block items-center m-4 bg-white border border-gray-200 rounded-lg shadow md:flex-row  hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700 transition-all duration-300">
        <!-- <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg" src="/docs/images/blog/image-4.jpg" alt=""> -->

        <div class="flex flex-wrap justify-between p-4 leading-normal">
            <slot name="image"></slot>
            <div class="p-4">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-left text-gray-900 dark:text-white">
                <slot name="title"></slot>
            </h5>
            <p class="font-normal text-gray-700 text-left dark:text-gray-400">
                <slot name="description"></slot>
            </p>
        </div>
        </div>
    </a>
</template>
  
<script setup lang="ts">

</script>
<style></style>
  