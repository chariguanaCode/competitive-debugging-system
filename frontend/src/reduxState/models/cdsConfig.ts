export interface CdsConfigModel {
    app: {
        uuid: string;
    };
    projects: {
        projectsHistory: Array<string>;
        nextNotSavedProjectName: string;
    };
    settings: {};
}
