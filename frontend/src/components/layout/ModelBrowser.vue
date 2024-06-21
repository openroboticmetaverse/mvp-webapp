<template>
    <base-panel :position="'left'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-sm text-left tracking-wide">Model Browser</div>
                <base-card>
                    <base-item @click="selectModel('cube')">
                        <template v-slot:image>
                            <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                                src="" alt="Cube">
                        </template>
                        <template v-slot:title>
                            Cube
                        </template>
                        <template v-slot:description>
                            A basic cube shape.
                        </template>
                    </base-item>
                    <base-item @click="selectModel('sphere')">
                        <template v-slot:image>
                            <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                                src="" alt="Sphere">
                        </template>
                        <template v-slot:title>
                            Sphere
                        </template>
                        <template v-slot:description>
                            A basic sphere shape.
                        </template>
                    </base-item>
                    <base-item @click="selectModel('cylinder')">
                        <template v-slot:image>
                            <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                                src="" alt="Cylinder">
                        </template>
                        <template v-slot:title>
                            Cylinder
                        </template>
                        <template v-slot:description>
                            A basic cylinder shape.
                        </template>
                    </base-item>
                </base-card>
            </div>
        </template>
    </base-panel>
</template>

<script setup lang="ts">
import BasePanel from '../ui/BasePanel.vue';
import BaseItem from '../ui/BaseItem.vue';
import BaseCard from '../ui/BaseCard.vue';

const emit = defineEmits(['model-selected']);

function selectModel(modelName: string) {
    // Emit event when a model is selected
    emit('model-selected', modelName);
    console.log("Model selected:", modelName);
}
</script>