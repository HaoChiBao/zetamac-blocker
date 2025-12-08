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

/**
 * Returns a random integer between min (inclusive) and max (inclusive).
 * @param {number} min 
 * @param {number} max 
 * @returns {number}
 */
export function randomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Picks two distinct random integers from the range [min, max].
 * @param {number} min 
 * @param {number} max 
 * @returns {[number, number]}
 */
export function pickRandomDistinctPair(min, max) {
    if (max <= min) return [min, min];
    const a = randomInt(min, max);
    let b = randomInt(min, max);
    while (b === a) {
        b = randomInt(min, max);
    }
    return [a, b];
}
