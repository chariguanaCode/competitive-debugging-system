export type ProjectFileModel = {
    path: string;
    isSaved: boolean;
    directory: string;
    filename: string;
    hasSaveLocation: boolean;
    savedFileHash: number;
} | null
