import { FileModel } from 'components/FileManager/FileManager.d';

const filename = {
    nameKey: (inputFile: FileModel, outputFile: FileModel | null) => {
        return inputFile.name.slice(0, inputFile.name.length - inputFile.type.length);
    },
};

const filenameWithDirectoryName = {
    nameKey: (inputFile: FileModel, outputFile: FileModel | null) => {
        const splittedPath = inputFile.path.slice(0, -inputFile.type.length).split('/');
        return splittedPath.length === 1 ? inputFile.name : splittedPath.slice(-2).join('/');
    },
};

const filenameWithDirectoryNameAndTheDirectoryAboveName = {
    nameKey: (inputFile: FileModel, outputFile: FileModel | null) => {
        const splittedPath = inputFile.path.slice(0, -inputFile.type.length).split('/');
        return splittedPath.length === 1 ? inputFile.name : splittedPath.slice(-Math.min(3, splittedPath.length)).join('/');
    },
};

const mergingFilesDefaultFunctions: {
    [key: string]: {
        name: string;
        description: string;
        nameKey: (inputFile: FileModel, outputFile: FileModel | null) => string;
    };
} = {
    filename: {
        name: 'filename',
        description: 'filename',
        ...filename,
    },
    filenameWithDirectoryName: {
        name: 'filenameWithDirectoryName',
        description: 'filenameWithDirectoryName',
        ...filenameWithDirectoryName,
    },
    filenameWithDirectoryNameAndTheDirectoryAboveName: {
        name: 'filenameWithDirectoryNameAndTheDirectoryAboveName',
        description: 'filenameWithDirectoryNameAndTheDirectoryAboveName',
        ...filenameWithDirectoryNameAndTheDirectoryAboveName,
    },
};

export default mergingFilesDefaultFunctions;
