import { FileModel } from '../../../../FileManager.d';

export interface FilePropsModel {
    isSelected: boolean;
    file: FileModel;
    isAcceptable: boolean;
    onFileClick: (file: FileModel, e: any, fileIsAlreadyClicked = false, id: number) => any;
    fileIndex: number;
    onKeyDownOnFile: (file: FileModel, e: any, fileIsAlreadyClicked = false, id: number) => any;
    zoomFactor: number;
}
