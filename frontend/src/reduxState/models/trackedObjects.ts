export type TrackedArray1d = { type: 'array_1d'; value: Array<string>; color: Array<string> };
export type TrackedArray2d = { type: 'array_2d'; value: Array<Array<string>>; color: Array<Array<string>> };

export type TrackedObject = TrackedArray1d | TrackedArray2d;

export interface TrackedObjectsModel {
    [key: string]: TrackedObject;
}
