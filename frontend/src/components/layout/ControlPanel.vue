<template>
    <base-panel :position="'right'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white font-bold uppercase text-sm tracking-wide">Simulation</div>
                <base-button @click="activateRobot">
                    
                    <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/play.svg" alt="Transformation Panel" />
                </base-button>
                <base-button @click="deactivateRobot">
                    
                    <img class="w-8 h-8 md:w-10 md:h-10" src="/src/assets/icons/stop.svg" alt="Transformation Panel" />
                </base-button>
            </div>



        </template>

    </base-panel>
</template>

<script setup lang="ts">
import BasePanel from '../ui/BasePanel.vue';
import BaseButton from '../ui/BaseButton.vue';
import { useRobotController } from '../../stores/store';

const robotController = useRobotController()
function activateRobot() {
    robotController.activateRobot()
}
function deactivateRobot() {
    robotController.deactivateRobot()
}

</script>

