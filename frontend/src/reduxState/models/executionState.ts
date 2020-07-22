export enum ExecutionState {
    NoProject,
    Compiling,
    CompilationError,
    Running,
    Finished,
}

export interface ExecutionStateModel {
    state: ExecutionState;
    details: string;
}
