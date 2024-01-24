interface IRobotLoader {
  loadRobot(url: string): Promise<Object3D>;
}