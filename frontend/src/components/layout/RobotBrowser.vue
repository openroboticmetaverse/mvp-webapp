<template>
    <base-panel :position="'left'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-sm tracking-wide">Robot Browser</div>
                <base-item>
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
                <base-item>
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
            </div>

        </template>

    </base-panel>
</template>

<script setup lang="ts">
import BasePanel from '../ui/BasePanel.vue';
import BaseItem from '../ui/BaseItem.vue';
// import BaseButton from '../ui/BaseButton.vue';
// import { useRobotController } from '../../stores/store';

// const robotController = useRobotController()
// function activateRobot() {
//     robotController.activateRobot()
// }
// function deactivateRobot() {
//     robotController.deactivateRobot()
// }

</script>

