interface TrackedValue<T, V> {
    type: T;
    value: V;
}

export type TrackedArray1d = TrackedValue<'array_1d', { value: Array<string | number>; color: Array<string> }>;
export type TrackedArray2d = TrackedValue<'array_2d', { value: Array<Array<string | number>>; color: Array<Array<string>> }>;

export type TrackedObject = TrackedArray1d | TrackedArray2d;

export interface TrackedObjectsModel {
    [key: string]: TrackedObject;
}
