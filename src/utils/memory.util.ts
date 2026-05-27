import { FIRST_NAMES, LAST_NAMES } from "./constants";

/**
  RSS: Toda la memoria consumida por el proceso
  Heap Used: memoria usada por objetos JS
 */
export function logMemoryUsage(context: string, processed: number ) {

  const memory = process.memoryUsage();
  console.log(
    `[STREAM] ${context} | Rows: ${processed} | RAM: ${(memory.rss / 1024 / 1024).toFixed(2)} MB | JS Heap: ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
  );
}

// FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
export function getRandomFirstName(): string {
  return FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
}

export function getRandomLastName(): string {
  return LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
}