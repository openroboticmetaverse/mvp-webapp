<template>
    <base-panel :position="'right'">
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-left text-sm tracking-wide">Debug - ROS Topic Data
                </div>
                <base-card>
                    <ul>
                        <!-- Only render the last N messages for performance -->
                        <li v-for="(msg, index) in limitedMessages" :key="index">{{ msg }}</li>
                    </ul>
                </base-card>
            </div>
        </template>
    </base-panel>
</template>

<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue';
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
    name: '/join_states',  // Replace with the name of the ROS topic you want to subscribe to
    messageType: 'sensor_msgs/msg/JointState'  // Replace with the type of the message
});

const messages = ref([]);

topic.subscribe((message) => {
    // Directly modify the reactive array for real-time update
    messages.value.push(message.data);
    // Optionally, remove old messages to prevent memory overflow
    if (messages.value.length > 100) {  // Adjust based on acceptable limit
        messages.value.shift();
    }
});

// Computed property to limit the number of messages displayed for performance
const limitedMessages = computed(() => {
    return messages.value.slice(-10); // Adjust number to display based on performance needs
});

// Clean up on component unmount
onUnmounted(() => {
    topic.unsubscribe();
    ros.close();
});
</script>
