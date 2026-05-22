
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