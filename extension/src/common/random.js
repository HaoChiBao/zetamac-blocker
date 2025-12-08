/**
 * Pick a random item from an array.
 * @template T
 * @param {T[]} array 
 * @returns {T}
 */
export function pickRandom(array) {
    if (!array || array.length === 0) return null;
    return array[Math.floor(Math.random() * array.length)];
}
