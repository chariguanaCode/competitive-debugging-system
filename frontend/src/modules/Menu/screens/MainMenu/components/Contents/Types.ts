import { FileManagerModel } from 'reduxState/models';

export interface ContentProps {
    setFileManagerConfig: (arg1: FileManagerModel) => any;
    closeMainMenu: () => any;
}
