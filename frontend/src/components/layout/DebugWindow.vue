<template>
    <base-panel :position="'right'">
        <!-- This is the debug window component, displayed on the right side of the screen -->
        <template v-slot:panel>
            <div class="mb-auto m-2 rounded">
                <div class="text-white p-4 font-bold uppercase text-left text-sm tracking-wide">
                    <!-- Display the title of the debug window -->
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    <br>
                    Joint States will be shown here for debugging purposes

                </div>
                <base-card>
                    <!-- Display a list of joint states, with each state containing name, position, velocity, and effort data -->
                    <ul>
                        <li v-for="(state, index) in jointStates" :key="index">
                            <!-- Display the name of the joint and its corresponding state data -->
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

// Create a ROS client and initialize variables for joint states and connection state
const ros = new ROSLIB.Ros();
const jointStates = ref([]);
const navbarStore = useNavbarStore();
let topic = null;
let isConnected = ref(false);

// Watch for changes in the debug window active state
watch(() => navbarStore.isDebugActive, (isActive) => {
    if (isActive) {
        if (!isConnected.value) {
            // Connect to ROS if not already connected
            ros.connect('ws://localhost:9090');
        }
    } else {
        if (topic) {
            // Unsubscribe from the topic if the debug window is inactive
            topic.unsubscribe();
            topic = null;
        }
        if (isConnected.value) {
            // Close the ROS connection if the debug window is inactive
            ros.close();
        }
    }
});

// Event handler for ROS connection
ros.on('connection', () => {
    console.log('Connected to ROS.');
    isConnected.value = true;
    // Subscribe to the /joint_states topic once connected
    topic = new ROSLIB.Topic({
        ros,
        name: '/joint_states',
        messageType: 'sensor_msgs/JointState'
    });

    // Event handler for receiving /joint_states topic data
    topic.subscribe((message) => {
        // Add the received joint state to the list of joint states
        jointStates.value.push({
            name: message.name,
            position: message.position,
            velocity: message.velocity,
            effort: message.effort
        });
        // Limit the size of the list to prevent memory issues
        if (jointStates.value.length > 10) {
            jointStates.value.shift();
        }
    });
});

// Event handler for ROS connection errors
ros.on('error', (error) => {
    console.error('Error connecting to ROS: ', error);
});

// Event handler for ROS connection close
ros.on('close', () => {
    console.log('Connection to ROS closed.');
    isConnected.value = false;
});

// Event handler for component unmount
onUnmounted(() => {
    if (topic) {
        // Unsubscribe from the /joint_states topic if the component is unmounted
        topic.unsubscribe();
    }
    if (isConnected.value) {
        // Close the ROS connection if the component is unmounted
        ros.close();
    }
});
</script>
