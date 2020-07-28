import { FileModel } from '../../../../FileManager.d';

export interface FilePropsModel {
    isSelected: boolean;
    file: FileModel;
    isAcceptable: boolean;
    onFileClick: (file: FileType, e: any, fileIsAlreadyClicked = false, id: number) => any;
    fileIndex: number
}
