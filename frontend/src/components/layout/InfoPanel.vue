<template>
    <div>
        <div
            :class="`fixed flex bottom-36 right-20 top-12 h-[18%] w-[10%] bg-white bg-opacity-10 backdrop-blur-sm shadow-md justify-between items-center text-white z-10 rounded-lg  `">

            <div class="flex space-x-2 md:space-x-8 lg:space-x-12 flex-wrap">
                <div
                    class="flex flex-col justify-center items-center text-center text-white p-4 text-xs md:text-l lg:text-3xl">
                    Info session tomorrow 19h @ the Collective Incubator
                </div>

            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import BaseCard from '../ui/BaseCard.vue';
</script>
