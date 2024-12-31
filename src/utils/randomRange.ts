export function randomIntFromRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFloatFromRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

export const timestamp = new Date().getTime();
