import axios from "axios";
import { IObject, IRobot, IScene } from "@/types/Interfaces";

const BASE_URL = "http://pi.local:8000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchScenes = async () => {
  const response = await api.get("/scene-manager/scenes/");
  return response.data;
};

export const fetchObjects = async () => {
  const response = await api.get("/scene-manager/objects/");
  return response.data;
};

export const fetchRobots = async () => {
  const response = await api.get("/scene-manager/robots/");
  return response.data;
};

export const createScene = async (sceneData: Partial<IScene>) => {
  const response = await api.post("/scene-manager/scenes/", sceneData);
  return response.data;
};

export const updateScene = async (id: string, sceneData: Partial<IScene>) => {
  const response = await api.put(`/scene-manager/scenes/${id}/`, sceneData);
  return response.data;
};

export const createObject = async (objectData: Partial<IObject>) => {
  const response = await api.post("/scene-manager/objects/", objectData);
  return response.data;
};

export const updateObject = async (
  id: string,
  objectData: Partial<IObject>
) => {
  const response = await api.put(`/scene-manager/objects/${id}/`, objectData);
  return response.data;
};

export const createRobot = async (robotData: Partial<IRobot>) => {
  const response = await api.post("/scene-manager/robots/", robotData);
  return response.data;
};

export const updateRobot = async (id: string, robotData: Partial<IRobot>) => {
  const response = await api.put(`/scene-manager/robots/${id}/`, robotData);
  return response.data;
};
