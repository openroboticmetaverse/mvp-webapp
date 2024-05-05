<template>
    <base-panel :position="'left'">
        <template v-slot:panel>
            
            <div class=" mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-sm text-left tracking-wide">Robot Browser</div><base-card>
                <base-item @click="selectRobot(franka_arm)">
                    <template v-slot:image>
                        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                            src="/src/assets/img/franka_panda_arm.png" alt="Avatar of Jonathan Reinink">
                    </template>
                    <template v-slot:title>
                        Franka Panda Arm
                    </template>
                    <template v-slot:description>
                        A classic beauty, she's an independent woman.
                    </template>
                </base-item>
                <base-item @click="selectRobot(franka_dual_arm)">
                    <template v-slot:image>
                        <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-s-lg"
                            src="/src/assets/img/franka_panda_dual_arm.png" alt="Avatar of Jonathan Reinink">
                    </template>
                    <template v-slot:title>
                        Franka Panda Dual Arm
                    </template>
                    <template v-slot:description>
                        Who run the world
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
// import BaseButton from '../ui/BaseButton.vue';
import { useRobotSelector } from '../../stores/store';
import { ref } from 'vue';
const robotController = useRobotSelector()

const franka_arm = ref("https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro")
const franka_dual_arm = ref("https://raw.githubusercontent.com/openroboticmetaverse/mvp-webapp/main/frontend/public/franka_description/robots/dual_panda_example.urdf.xacro")

function selectRobot(xacroPath: string) {
    robotController.selectRobot(xacroPath)
}
</script>

