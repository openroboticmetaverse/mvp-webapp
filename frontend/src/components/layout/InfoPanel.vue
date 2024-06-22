<template>
    <div>
        <div
            :class="`fixed flex bottom-6 right-10 top-12 h-[8%] w-[6%] bg-white bg-opacity-5 backdrop-blur-sm shadow-md justify-between items-center text-white z-10 rounded-lg  `">

            <div class="flex space-x-2 md:space-x-8 lg:space-x-12 flex-wrap">
                <div
                    class="tracking-[0.1em] font bold flex flex-col justify-center items-center text-center text-white p-4 text-xs md:text-l lg:text-3xl">
                    mvp v0.2
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseCard from '../ui/BaseCard.vue';
</script>
