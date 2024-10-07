/**
 * Scene data interface
 */
export interface SceneData {
  /**
   * Unique identifier for the scene
   */
  id: string;
  /**
   * Name of the scene
   */
  name: string;
  /**
   * Description of the scene
   */
  description: string;
  /**
   * Array of objects in the scene
   */
  objects: ObjectData[];
  /**
   * Array of robots in the scene
   */
  robots: RobotData[];
  /**
   * User ID of the user who created the scene
   */
  user_id: string;
  /**
   * Date and time when the scene was created
   */
  created_at: string;
  /**
   * Date and time when the scene was last updated
   */
  updated_at: string;
}

/**
 * Object data interface
 */
export interface ObjectData {
  /**
   * Unique identifier for the object
   */
  id: string;
  /**
   * Name of the object
   */
  name: string;
  /**
   * Description of the object
   */
  description: string;
  /**
   * Position of the object in 3D space
   */
  position: [number, number, number];
  /**
   * Orientation of the object in 3D space
   */
  orientation: [number, number, number];
  /**
   * Scale of the object in 3D space
   */
  scale: [number, number, number];
  /**
   * Color of the object
   */
  color: string;
  /**
   * Object reference
   */
  objectReference: string;
}

/**
 * Robot data interface
 */
export interface RobotData {
  /**
   * Unique identifier for the robot
   */
  id: string;
  /**
   * Name of the robot
   */
  name: string;
  /**
   * Description of the robot
   */
  description: string;
  /**
   * Position of the robot in 3D space
   */
  position: [number, number, number];
  /**
   * Orientation of the robot in 3D space
   */
  orientation: [number, number, number];
  /**
   * Scale of the robot in 3D space
   */
  scale: [number, number, number];
  /**
   * Joint angles of the robot
   */
  jointAngles: number[];
  /**
   * Robot reference
   */
  robotReference: string;
}
