import { FileModel } from 'components/FileManager/FileManager.d';

const sameFilename = {
    inputKey: (file: FileModel) => {
        return file.name.slice(0, file.name.length - file.type.length);
    },
    outputKey: (file: FileModel) => {
        return file.name.slice(0, file.name.length - file.type.length);
    },
};

const mergingFilesDefaultFunctions: {
    [key: string]: {
        name: string;
        description: string;
        inputKey: (file: FileModel) => string;
        outputKey: (file: FileModel) => string;
    };
} = {
    'same filename': {
        name: 'same filename',
        description: 'Same filename.',
        ...sameFilename,
    },
};

export default mergingFilesDefaultFunctions;
