import { Ros, Topic } from "roslib";
import Robot from "../Robot";
import {
  Mesh,
  Object3D,
  PlaneGeometry,
  Scene,
  Vector3,
  MeshBasicMaterial,
  BufferAttribute,
  BufferGeometry,
  Group,
} from "three";
import { ThreeHelper } from "../../helpers/threeHelpers/core/ThreeHelper";

export interface RobotProperty {
  scale: Vector3;
  rotation: Vector3;
  position: Array<Vector3>;
  url: string;
  color: string;
  updateRobot: (robot: Object3D, message) => void;
}
export class RobotManager {
  static RobotMap: Map<string, string> = new Map<string, string>([
    [
      "franka_arm",
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-test/master/assets/models/franka_description/robots/panda_arm_hand.urdf.xacro",
    ],
    [
      "franka_dual_arm",
      "https://raw.githubusercontent.com/openroboticmetaverse/mvp-webapp/main/frontend/public/franka_description/robots/dual_panda_example.urdf.xacro",
    ],
  ]);

  robots: Map<string, Robot>;
  robotsId: Array<number>;
  scene: ThreeHelper;
  listeners: Map<Topic, Array<number>>;
  groups: Array<Group>;

  constructor(scene: ThreeHelper) {
    this.robots = new Map<string, Robot>();
    this.scene = scene;
    this.robotsId = new Array<number>();
    this.listeners = new Map<Topic, Array<number>>();
    this.groups = new Array<Group>();
  }

  addSingleRobot(name: string, props: RobotProperty): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        if (!this.robots.has(name) && RobotManager.RobotMap.has(name)) {
          let robot = new Robot(name, RobotManager.RobotMap.get(name)!);
          await robot.parse();
          this.robots.set(name, robot);
        }

        const robot = this.robots.get(name);
        if (!robot || !robot.parsedModel) {
          throw new Error("Robot model not available or not parsed");
        }

        const clonedModel = robot.parsedModel.clone();
        clonedModel.position.set(
          props.position[0].x,
          props.position[0].y,
          props.position[0].z
        );
        clonedModel.scale.set(props.scale.x, props.scale.y, props.scale.z);
        clonedModel.rotation.set(
          props.rotation.x,
          props.rotation.y,
          props.rotation.z
        );
        this.scene.add(clonedModel);

        const listener = this.createListener(props.url);
        listener.subscribe((message) => {
          props.updateRobot(clonedModel, message);
        });

        resolve();
      } catch (error) {
        reject(error.message);
      }
    });
  }

  addRobots(name: string, props: RobotProperty): Promise<void> {
    return new Promise(async (resolve, reject) => {
      if (!this.robots.has(name) && RobotManager.RobotMap.has(name)) {
        let robot = new Robot(name, RobotManager.RobotMap.get(name)!);
        await robot.parse();
        this.robots.set(name, robot);
      }
      let robot = this.robots.get(name);
      let localIds = new Array<number>();
      let group = new Group();
      props.position.forEach((pos) => {
        let cloned = robot!.parsedModel!.clone();
        localIds.push(cloned.id);
        cloned.position.set(pos.x, pos.y, pos.z);
        cloned.scale.set(props.scale.x, props.scale.y, props.scale.z);
        cloned.rotation.set(
          props.rotation.x,
          props.rotation.y,
          props.rotation.z
        );
        group.add(cloned);

        let geometry = new BufferGeometry();
        let minX = props.position.at(0)!.x;
        let minZ = props.position.at(0)!.z;

        let maxX = props.position.at(-1)!.x;
        let maxZ = props.position.at(-1)!.z;
        const vertices = new Float32Array([
          minX,
          0.0,
          minZ, // v0
          minX,
          0.0,
          maxZ, // v1
          maxX,
          0.0,
          maxZ, // v2

          maxX,
          0.0,
          maxZ, // v3
          maxX,
          0.0,
          minZ, // v4
          minX,
          0.0,
          minZ, // v5
        ]);
        // geometry.setIndex(indices);
        geometry.setAttribute("position", new BufferAttribute(vertices, 3));

        let material = new MeshBasicMaterial({ color: props.color });
        const mesh = new Mesh(geometry, material);
        group.add(mesh);
      });
      let url = props.url;
      let listener = this.createListener(url);
      listener.subscribe((message) => {
        localIds.forEach((id) => {
          let robot = this.scene.getObjectById(id);
          props.updateRobot(robot!, message);
        });
      });
      this.listeners.set(listener, localIds);
      this.robotsId = this.robotsId.concat(localIds);
      this.scene.add(group);
      this.groups.push(group);
      resolve();
    });
  }
  remove(id: number) {
    let robot = this.scene.getObjectById(id);
    if (robot) {
      this.scene.remove(robot);
    } else {
      console.log(
        `Error:RobotManager:remove ==> robot with ID=${id} does not exist!`
      );
    }
  }

  removeAll() {
    // this.robotsId.forEach((id) => {
    //   this.remove(id);
    // })
    this.groups.forEach((group) => {
      this.scene.remove(group);
    });
    this.groups.splice(0, this.groups.length);
    this.removeAllListeners();
    this.robotsId.splice(0, this.robotsId.length);
  }
  private createListener(url: string): Topic {
    const ros = new Ros({
      url: url,
    });
    // On ROS connection, log message
    ros.on("connection", () => {
      console.log(`Connected to ROS WebSocket. at ${url}`);
    });

    // On ROS error, log error
    ros.on("error", (error) => {
      console.error("Error connecting to ROS: ", error);
    });

    // On ROS close, log message
    ros.on("close", () => {
      console.log("Connection to ROS closed.");
    });
    // Define ROS joint state topic
    const listener = new Topic({
      ros,
      name: "/joint_states",
      messageType: "sensor_msgs/JointState",
    });
    return listener;
  }
  removeListenerByRobotId(id: number) {
    let todelete = null;
    for (let [key, value] of this.listeners) {
      if (value.includes(id)) {
        todelete = key;
      }
    }
    if (todelete) {
      todelete.unsubscribe();
      this.listeners.delete(todelete);
    }
  }

  removeAllListeners() {
    for (let [key, _] of this.listeners) {
      key.unsubscribe();
    }
    this.listeners.clear();
  }
}
