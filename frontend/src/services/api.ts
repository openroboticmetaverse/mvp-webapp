import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  IObject,
  IRobot,
  IScene,
  IReferenceRobot,
  IReferenceObject,
} from "@/types/Interfaces";

// Define the base URL for the API
const BASE_URL = "http://pi.local:8000";

// Create an axios instance with the base URL
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Helper function to handle API responses
const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

// Helper function to handle API errors
const handleError = (error: any): never => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error("API Error Response:", error.response.data);
    console.error("API Error Status:", error.response.status);
    console.error("API Error Headers:", error.response.headers);
  } else if (error.request) {
    // The request was made but no response was received
    console.error("API Error Request:", error.request);
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error("API Error Message:", error.message);
  }
  console.error("API Error Config:", error.config);
  throw error;
};

// Scene Manager API functions
export const sceneManagerApi = {
  // Scenes
  fetchScenes: () =>
    api
      .get<IScene[]>("/scene-manager/scenes/")
      .then(handleResponse)
      .catch(handleError),
  createScene: (sceneData: Partial<IScene>) =>
    api
      .post<IScene>("/scene-manager/scenes/", sceneData)
      .then(handleResponse)
      .catch(handleError),
  updateScene: (id: string, sceneData: Partial<IScene>) =>
    api
      .put<IScene>(`/scene-manager/scenes/${id}/`, sceneData)
      .then(handleResponse)
      .catch(handleError),
  deleteScene: (id: string) =>
    api
      .delete(`/scene-manager/scenes/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  // Objects
  fetchObjects: () =>
    api
      .get<IObject[]>("/scene-manager/objects/")
      .then(handleResponse)
      .catch(handleError),
  createObject: (objectData: Partial<IObject>) =>
    api
      .post<IObject>("/scene-manager/objects/", objectData)
      .then(handleResponse)
      .catch(handleError),
  updateObject: (id: string, objectData: Partial<IObject>) =>
    api
      .put<IObject>(`/scene-manager/objects/${id}/`, objectData)
      .then(handleResponse)
      .catch(handleError),
  deleteObject: (id: string) =>
    api
      .delete(`/scene-manager/objects/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  // Robots
  fetchRobots: () =>
    api
      .get<IRobot[]>("/scene-manager/robots/")
      .then(handleResponse)
      .catch(handleError),
  createRobot: (robotData: Partial<IRobot>) =>
    api
      .post<IRobot>("/scene-manager/robots/", robotData)
      .then(handleResponse)
      .catch(handleError),
  updateRobot: (id: string, robotData: Partial<IRobot>) =>
    api
      .put<IRobot>(`/scene-manager/robots/${id}/`, robotData)
      .then(handleResponse)
      .catch(handleError),
  deleteRobot: (id: string) =>
    api
      .delete(`/scene-manager/robots/${id}/`)
      .then(handleResponse)
      .catch(handleError),
};

// Object Library API functions
export const objectLibraryApi = {
  // Reference Robots
  fetchReferenceRobots: () =>
    api
      .get<IReferenceRobot[]>("/library/ref-robots/")
      .then(handleResponse)
      .catch(handleError),
  createReferenceRobot: (robotData: Partial<IReferenceRobot>) =>
    api
      .post<IReferenceRobot>("/library/ref-robots/", robotData)
      .then(handleResponse)
      .catch(handleError),
  updateReferenceRobot: (id: string, robotData: Partial<IReferenceRobot>) =>
    api
      .put<IReferenceRobot>(`/library/ref-robots/${id}/`, robotData)
      .then(handleResponse)
      .catch(handleError),
  deleteReferenceRobot: (id: string) =>
    api
      .delete(`/library/ref-robots/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  // Reference Objects
  fetchReferenceObjects: () =>
    api
      .get<IReferenceObject[]>("/library/ref-objects/")
      .then(handleResponse)
      .catch(handleError),
  createReferenceObject: (objectData: Partial<IReferenceObject>) =>
    api
      .post<IReferenceObject>("/library/ref-objects/", objectData)
      .then(handleResponse)
      .catch(handleError),
  updateReferenceObject: (id: string, objectData: Partial<IReferenceObject>) =>
    api
      .put<IReferenceObject>(`/library/ref-objects/${id}/`, objectData)
      .then(handleResponse)
      .catch(handleError),
  deleteReferenceObject: (id: string) =>
    api
      .delete(`/library/ref-objects/${id}/`)
      .then(handleResponse)
      .catch(handleError),
};
