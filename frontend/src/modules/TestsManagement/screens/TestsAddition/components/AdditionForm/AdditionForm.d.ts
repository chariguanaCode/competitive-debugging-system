import { FileManagerModel } from 'reduxState/models';
import { FileModel } from 'components/FileManager/FileManager.d';
export interface AdditionFormPropsModel {
    title: string | React.ElementType;
    setSelectedFiles: Function;
    selectedFiles: Array<FileModel>;
    setFileManager: (arg1: FileManagerModel) => any;
    mirrored?: boolean;
}

export interface AdditionFormStateModel {}
