import { FileModel } from 'components/FileManager/FileManager.d';

const sameFilename = {
    inputKey: (file: FileModel) => {
        return file.name.slice(0, file.name.length - file.type.length);
    },
    outputKey: (file: FileModel) => {
        return file.name.slice(0, file.name.length - file.type.length);
    },
};

const inoutCommonPart = {
    inputKey: (file: FileModel) => {
        const inBeginIndex = file.name.indexOf('in');
        return file.name.slice(inBeginIndex > -1 ? inBeginIndex + 2 : 0, file.name.length - file.type.length);
    },
    outputKey: (file: FileModel) => {
        const outBeginIndex = file.name.indexOf('out');
        return file.name.slice(outBeginIndex > -1 ? outBeginIndex + 3 : 0, file.name.length - file.type.length);
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
    'in/out + key': {
        name: 'in/out + key',
        description: 'in/out + key',
        ...inoutCommonPart,
    }
};

export default mergingFilesDefaultFunctions;
