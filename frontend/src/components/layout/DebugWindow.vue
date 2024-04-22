<template>
    <base-panel :position="'right'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-left text-sm tracking-wide">Joint States</div>
                <base-card>
                    <ul>
                        <!-- Display each joint and its corresponding state -->
                        <li v-for="(state, index) in jointStates" :key="index">
                            {{ state.name.join(', ') }} - Pos: {{ state.position.join(', ') }}
                            Vel: {{ state.velocity.join(', ') }} Eff: {{ state.effort.join(', ') }}
                        </li>
                    </ul>
                </base-card>
            </div>
        </template>
    </base-panel>
</template>

<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import BasePanel from '../ui/BasePanel.vue';
import BaseCard from '../ui/BaseCard.vue';
import ROSLIB from 'roslib';
import { useNavbarStore } from '../../stores/store';

const ros = new ROSLIB.Ros();
const jointStates = ref([]);
const navbarStore = useNavbarStore();
let topic = null;
let isConnected = ref(false);  // Manage connection state explicitly

watch(() => navbarStore.isDebugActive, (isActive) => {
    if (isActive) {
        if (!isConnected.value) {
            ros.connect('ws://localhost:9090');
        }
    } else {
        if (topic) {
            topic.unsubscribe();
            topic = null;
        }
        if (isConnected.value) {
            ros.close();
        }
    }
});

ros.on('connection', () => {
    console.log('Connected to ROS.');
    isConnected.value = true;
    // Subscribe to the topic once connected
    topic = new ROSLIB.Topic({
        ros,
        name: '/joint_states',
        messageType: 'sensor_msgs/JointState'
    });

    topic.subscribe((message) => {
        jointStates.value.push({
            name: message.name,
            position: message.position,
            velocity: message.velocity,
            effort: message.effort
        });
        if (jointStates.value.length > 10) {  // Limit the size to prevent memory issues
            jointStates.value.shift();
        }
    });
});

ros.on('error', (error) => {
    console.error('Error connecting to ROS: ', error);
});

ros.on('close', () => {
    console.log('Connection to ROS closed.');
    isConnected.value = false;
});

onUnmounted(() => {
    if (topic) {
        topic.unsubscribe();
    }
    if (isConnected.value) {
        ros.close();
    }
});
</script>
