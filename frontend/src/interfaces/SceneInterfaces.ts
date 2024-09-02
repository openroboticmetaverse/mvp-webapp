export interface Scene {
  id: string;
  name: string;
  user_id: string;
  description: string;
  websocket_visual_ip?: string;
  websocket_control_ip?: string;
  created_at: string;
  updated_at: string;
}

export interface Object {
  id: string;
  name: string;
  scene_id: string;
  db_model_reference?: string;
  position?: [number, number, number];
  orientation?: [number, number, number];
  scale?: [number, number, number];
  created_at: string;
  updated_at: string;
}

export interface Robot extends Object {
  type_name: number;
  num_joints?: number;
  joint_angles?: number[];
  joint_angle?: number[];
}
export interface GeometricObject extends Object {
  color?: string;
  shape: "box" | "sphere" | "cylinder" | "plane" | "torus";
}
