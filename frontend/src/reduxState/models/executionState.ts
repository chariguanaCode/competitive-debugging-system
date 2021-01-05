export enum ExecutionState {
    NoProject,
    ProjectLoaded,
    Compiling,
    CompilationError,
    Running,
    Finished,
}

export interface ExecutionStateModel {
    state: ExecutionState;
    details: string;
    sourceHash: string;
}
