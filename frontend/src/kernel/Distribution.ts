import { Vector3 } from "three";

export function generateCirlceDistribution(n: number, radius: number): Array<Vector3> {
  if (n <= 0) {
    throw new Error("Invalid values for n and k");
  }
  const points: Array<Vector3> = new Array<Vector3>();
  const angleIncrement = (2 * Math.PI) / n;

  let randomX = Math.floor(Math.random() * (100 - 0 + 0)) + 0;
  let randomZ = Math.floor(Math.random() * (100 - 0 + 0)) + 0;
  let randomStart: Vector3 = new Vector3(randomX, 0, randomZ);
  // Generate points around a circle
  for (let i = 0; i < n; i++) {
    const angle = i * angleIncrement;
    const x = radius * Math.cos(angle);
    const y = radius * Math.sin(angle);
    let vec = new Vector3(x, 0, y);
    vec.add(randomStart)
    points.push(vec);
  }
  return points;

}

export function generateGridDistribution(n: number, m: number, d: number): Array<Vector3> {
  const grid: Array<Vector3> = new Array<Vector3>();

  let randomX = Math.floor(Math.random() * (100 - 0 + 0)) + 0;
  let randomZ = Math.floor(Math.random() * (100 - 0 + 0)) + 0;
  let randomStart: Vector3 = new Vector3(randomX, 0, randomZ);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < m; j++) {
      const x = i * d;
      const y = j * d;
      let vec = new Vector3(x, 0, y);
      vec.add(randomStart);
      grid.push(vec);
    }
  }
  return grid;
}

export function generateRandomHexColor(): string {
  // Generate random R, G, and B values
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);

  // Convert RGB to hexadecimal
  const hexR = r.toString(16).padStart(2, '0');
  const hexG = g.toString(16).padStart(2, '0');
  const hexB = b.toString(16).padStart(2, '0');

  // Concatenate and return the color code
  return `#${hexR}${hexG}${hexB}`;
}