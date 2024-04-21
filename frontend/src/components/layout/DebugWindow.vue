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
import { ref } from 'vue';
import BasePanel from '../ui/BasePanel.vue';
import BaseCard from '../ui/BaseCard.vue';
import ROSLIB from 'roslib';

const ros = new ROSLIB.Ros({
    url: 'ws://localhost:9090'  // Replace with your ROS bridge server URL
});

ros.on('connection', () => {
    console.log('Connected to ROS.');
});

ros.on('error', (error) => {
    console.error('Error connecting to ROS: ', error);
});

ros.on('close', () => {
    console.log('Connection to ROS closed.');
});

const topic = new ROSLIB.Topic({
    ros,
    name: '/joint_states',  // Subscribe to the /joint_states topic
    messageType: 'sensor_msgs/JointState'
});

const jointStates = ref([]);

topic.subscribe((message) => {
    jointStates.value.push({
        name: message.name,
        position: message.position,
        velocity: message.velocity,
        effort: message.effort
    });
    // Optionally, limit the number of states stored
    if (jointStates.value.length > 10) {
        jointStates.value.shift();
    }
});
</script>
