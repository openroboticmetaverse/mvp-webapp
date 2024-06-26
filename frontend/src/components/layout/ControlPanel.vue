<template>
    <base-panel :position="'right'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-left text-sm tracking-wide">Simulation</div>
                <base-card>
                    <base-button @click="activateRobot">

                        <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/play.svg"
                            alt="Transformation Panel" />
                    </base-button>
                    <base-button @click="deactivateRobot">

                        <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/stop.svg"
                            alt="Transformation Panel" />
                    </base-button>
                    <br>
                    PLACEHOLDER
                </base-card>
            </div>



        </template>

    </base-panel>
</template>

<script setup lang="ts">
import BasePanel from '../ui/BasePanel.vue';
import BaseButton from '../ui/BaseButton.vue';
import BaseCard from '../ui/BaseCard.vue';
import { useRobotController } from '../../stores/store';

const robotController = useRobotController()
function activateRobot() {
    robotController.activateRobot()
}
function deactivateRobot() {
    robotController.deactivateRobot()
}

</script>
