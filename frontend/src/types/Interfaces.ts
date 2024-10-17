/**
 * Scene Management Interfaces
 */

// Base interface for objects and robots
export interface IAbstractObject {
  id: string; // PK
  name: string;
  description: string;
  scene_id: string; // FK
  position: [number, number, number]; // [x, y, z]
  orientation: [number, number, number]; // [roll, pitch, yaw]
  scale: [number, number, number]; // [x, y, z]
  created_at: string;
  updated_at: string;
}

// Scene interface
export interface IScene {
  id: string; // PK
  name: string;
  user_id: string; // FK
  description: string;
  websocket_visual_id: string;
  websocket_control_id: string;
  created_at: string;
  updated_at: string;
}

// Object interface (extends IAbstractObject)
export interface IObject extends IAbstractObject {
  object_reference: string; // FK
  color: string; // RGB-Code
}

// Robot interface (extends IAbstractObject)
export interface IRobot extends IAbstractObject {
  robot_reference: string; // FK
  joint_angles: number[]; // List of Double
  sim_websocket_url: string;
}

/**
 * Object Library Interfaces
 */

// Base interface for object and robot references
export interface IAbstractReference {
  id: string; // PK
  name: string;
  file: string | File | Blob;
  file_type: string;
  description: string;
  created_at: string;
  updated_at: string;
}

// ReferenceRobot interface (extends IAbstractReference)
export interface IReferenceRobot extends IAbstractReference {
  num_joints: number;
  joint_names: {
    axes: ("rx" | "ry" | "rz" | "")[];
    links: string[]; // Temporarily changed the format, currently not the same as backend, as we do not explicitly store the link/axis names
  };
}

export interface IReferenceObject extends IAbstractReference {
  color: string; // Optional?
}
