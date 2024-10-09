import { v4 as uuidv4 } from "uuid";

/**
 * Generates a unique identifier.
 *
 * This function uses the uuid library to generate a version 4 UUID,
 * which is suitable for most use cases requiring a unique identifier.
 *
 * @returns {string} A unique string identifier
 */
export function generateUniqueId(): string {
  return uuidv4();
}
