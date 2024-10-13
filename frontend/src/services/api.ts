import axios, { AxiosInstance, AxiosResponse } from "axios";
import {
  IObject,
  IRobot,
  IScene,
  IReferenceRobot,
  IReferenceObject,
} from "@/types/Interfaces";
import { errorLoggingService } from "./error-logging-service";

// Import the base URL from the .env file or default to http://localhost:8000
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:8000";

// Create an axios instance with the base URL
const api: AxiosInstance = axios.create({
  baseURL: BASE_URL,
});

/**
 * Helper function to handle API responses
 * @template T The expected type of the response data
 * @param {AxiosResponse<T>} response The axios response object
 * @returns {T} The response data
 */
const handleResponse = <T>(response: AxiosResponse<T>): T => response.data;

/**
 * Helper function to handle API errors
 * @param {any} error The error object
 * @throws {Error} Throws an error with a descriptive message
 */
const handleError = (error: any): never => {
  let errorMessage = "An unexpected error occurred";

  if (error.response) {
    errorLoggingService.error("API Error Response", error);
    errorMessage =
      error.response.data.message || `Error: ${error.response.status}`;
  } else if (error.request) {
    errorLoggingService.error("API Error Request", error);
    errorMessage = "No response received from server";
  } else {
    errorLoggingService.error("API Error", error);
    errorMessage = error.message;
  }

  throw new Error(errorMessage);
};

/**
 * Scene Manager API functions
 */
export const sceneManagerApi = {
  /**
   * Fetch all scenes
   * @returns {Promise<IScene[]>} A promise that resolves to an array of scenes
   */
  fetchScenes: () =>
    api
      .get<IScene[]>("/scene-manager/scenes/")
      .then(handleResponse)
      .catch(handleError),

  /**
   * Create a new scene
   * @param {Partial<IScene>} sceneData The data for the new scene
   * @returns {Promise<IScene>} A promise that resolves to the created scene
   */
  createScene: (sceneData: Partial<IScene>) =>
    api
      .post<IScene>("/scene-manager/scenes/", sceneData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Update an existing scene
   * @param {string} id The ID of the scene to update
   * @param {Partial<IScene>} sceneData The updated scene data
   * @returns {Promise<IScene>} A promise that resolves to the updated scene
   */
  updateScene: (id: string, sceneData: Partial<IScene>) =>
    api
      .put<IScene>(`/scene-manager/scenes/${id}/`, sceneData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Delete a scene
   * @param {string} id The ID of the scene to delete
   * @returns {Promise<void>} A promise that resolves when the scene is deleted
   */
  deleteScene: (id: string) =>
    api
      .delete(`/scene-manager/scenes/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Fetch all objects
   * @returns {Promise<IObject[]>} A promise that resolves to an array of objects
   */
  fetchObjects: () =>
    api
      .get<IObject[]>("/scene-manager/objects/")
      .then(handleResponse)
      .catch(handleError),

  /**
   * Create a new object
   * @param {Partial<IObject>} objectData The data for the new object
   * @returns {Promise<IObject>} A promise that resolves to the created object
   */
  createObject: (objectData: Partial<IObject>) =>
    api
      .post<IObject>("/scene-manager/objects/", objectData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Update an existing object
   * @param {string} id The ID of the object to update
   * @param {Partial<IObject>} objectData The updated object data
   * @returns {Promise<IObject>} A promise that resolves to the updated object
   */
  updateObject: (id: string, objectData: Partial<IObject>) =>
    api
      .put<IObject>(`/scene-manager/objects/${id}/`, objectData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Delete an object
   * @param {string} id The ID of the object to delete
   * @returns {Promise<void>} A promise that resolves when the object is deleted
   */
  deleteObject: (id: string) =>
    api
      .delete(`/scene-manager/objects/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Fetch all robots
   * @returns {Promise<IRobot[]>} A promise that resolves to an array of robots
   */
  fetchRobots: () =>
    api
      .get<IRobot[]>("/scene-manager/robots/")
      .then(handleResponse)
      .catch(handleError),

  /**
   * Create a new robot
   * @param {Partial<IRobot>} robotData The data for the new robot
   * @returns {Promise<IRobot>} A promise that resolves to the created robot
   */
  createRobot: (robotData: Partial<IRobot>) =>
    api
      .post<IRobot>("/scene-manager/robots/", robotData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Update an existing robot
   * @param {string} id The ID of the robot to update
   * @param {Partial<IRobot>} robotData The updated robot data
   * @returns {Promise<IRobot>} A promise that resolves to the updated robot
   */
  updateRobot: (id: string, robotData: Partial<IRobot>) =>
    api
      .put<IRobot>(`/scene-manager/robots/${id}/`, robotData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Delete a robot
   * @param {string} id The ID of the robot to delete
   * @returns {Promise<void>} A promise that resolves when the robot is deleted
   */
  deleteRobot: (id: string) =>
    api
      .delete(`/scene-manager/robots/${id}/`)
      .then(handleResponse)
      .catch(handleError),
};

/**
 * Object Library API functions
 */
export const objectLibraryApi = {
  /**
   * Fetch all reference robots
   * @returns {Promise<IReferenceRobot[]>} A promise that resolves to an array of reference robots
   */
  fetchReferenceRobots: () =>
    api
      .get<IReferenceRobot[]>("/library/ref-robots/")
      .then(handleResponse)
      .catch(handleError),

  /**
   * Create a new reference robot
   * @param {Partial<IReferenceRobot>} robotData The data for the new reference robot
   * @returns {Promise<IReferenceRobot>} A promise that resolves to the created reference robot
   */
  createReferenceRobot: (robotData: Partial<IReferenceRobot>) =>
    api
      .post<IReferenceRobot>("/library/ref-robots/", robotData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Update an existing reference robot
   * @param {string} id The ID of the reference robot to update
   * @param {Partial<IReferenceRobot>} robotData The updated reference robot data
   * @returns {Promise<IReferenceRobot>} A promise that resolves to the updated reference robot
   */
  updateReferenceRobot: (id: string, robotData: Partial<IReferenceRobot>) =>
    api
      .put<IReferenceRobot>(`/library/ref-robots/${id}/`, robotData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Delete a reference robot
   * @param {string} id The ID of the reference robot to delete
   * @returns {Promise<void>} A promise that resolves when the reference robot is deleted
   */
  deleteReferenceRobot: (id: string) =>
    api
      .delete(`/library/ref-robots/${id}/`)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Fetch all reference objects
   * @returns {Promise<IReferenceObject[]>} A promise that resolves to an array of reference objects
   */
  fetchReferenceObjects: () =>
    api
      .get<IReferenceObject[]>("/library/ref-objects/")
      .then(handleResponse)
      .catch(handleError),

  /**
   * Create a new reference object
   * @param {Partial<IReferenceObject>} objectData The data for the new reference object
   * @returns {Promise<IReferenceObject>} A promise that resolves to the created reference object
   */
  createReferenceObject: (objectData: Partial<IReferenceObject>) =>
    api
      .post<IReferenceObject>("/library/ref-objects/", objectData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Update an existing reference object
   * @param {string} id The ID of the reference object to update
   * @param {Partial<IReferenceObject>} objectData The updated reference object data
   * @returns {Promise<IReferenceObject>} A promise that resolves to the updated reference object
   */
  updateReferenceObject: (id: string, objectData: Partial<IReferenceObject>) =>
    api
      .put<IReferenceObject>(`/library/ref-objects/${id}/`, objectData)
      .then(handleResponse)
      .catch(handleError),

  /**
   * Delete a reference object
   * @param {string} id The ID of the reference object to delete
   * @returns {Promise<void>} A promise that resolves when the reference object is deleted
   */
  deleteReferenceObject: (id: string) =>
    api
      .delete(`/library/ref-objects/${id}/`)
      .then(handleResponse)
      .catch(handleError),
};
