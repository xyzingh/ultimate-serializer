export function err(message: string): never {
    throw new Error('UltimateSerializer: ' + message);
}

export function warn(message: string): void {
    console.log('UltimateSerializer: ' + message);
}

export function assert(bool: boolean, message?: string): void {
    if (!bool) {
        message = message || 'AssertionError';
        err(message);
    }
}

export function clamp(value: number, min: number, max: number): number {
    return value < min ? min : value > max ? max : value;
}

export function values<T>(obj: { [s: string]: T } | ArrayLike<T>): T[] {
    return Object.keys(obj).map((key) => (obj as any)[key]);
}

/**
 * Checks if `value` is a plain object.
 *
 * Definition of Plain Object:
 * - where the object comes from:
 *   - { }
 *   - new Object()
 *   - Object.create(null)
 * - object[Symbol.toStringTag] is undefined
 */
export function isPlainObject(value: any): value is object {
    if (
        typeof value !== 'object' ||
        value === null ||
        Object.prototype.toString.call(value) !== '[object Object]'
    ) {
        return false;
    }
    const proto = Object.getPrototypeOf(value);
    return proto === Object.prototype || proto === null;
}

export class ArraySet<T = any> {
    public readonly arr: T[] = [];
    public get(i: number): T | undefined {
        return this.arr[i];
    }
    public indexOf(elem: T): number {
        return this.arr.indexOf(elem);
    }
    public has(elem: T): boolean {
        return this.arr.indexOf(elem) !== -1;
    }
    public addAndGetIndex(elem: T): number {
        const index = this.arr.indexOf(elem);
        if (~index) return index;

        this.arr.push(elem);
        return this.arr.length - 1;
    }
}

export const isInteger =
    Number.isInteger ||
    ((value: number): boolean => {
        return isFinite(value) && Math.floor(value) === value;
    });

export function bigIntToBuffer(bigint: bigint): Uint8Array {
    assert(bigint >= 0);

    let hex = bigint.toString(16);
    if (hex.length % 2) {
        hex = '0' + hex;
    }
    const len = hex.length / 2;
    const buf = new Uint8Array(len);

    let i = 0;
    let j = 0;
    while (i < len) {
        buf[i] = parseInt(hex.slice(j, j + 2), 16);
        i += 1;
        j += 2;
    }
    return buf;
}

export function bufferToBigInt(buf: Uint8Array): bigint {
    const hex: string[] = [];
    const len = buf.length;

    for (let i = 0; i < len; ++i) {
        const num = buf[i];
        let str = num.toString(16);
        if (num < 16) str = '0' + str;
        hex.push(str);
    }

    return BigInt('0x' + hex.join(''));
}
