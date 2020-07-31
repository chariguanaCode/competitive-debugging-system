import { FileManagerStateModel, FileManagerPropsModel } from 'components/FileManager/FileManager.d';

export interface HeaderPropsModel {
    loadDirectory: (arg1: { path: string; regex?: string }) => any;
    currentPath: FileManagerStateModel.currentPath;
    setRootDirectory: (newRootDirectory: FileManagerStateModel.currentRootPath) => any;
    sortMethodNumber: FileManagerStateModel.sortMethodNumber;
    setSortMethodNumber: (number: FileManagerStateModel.sortMethodNumber) => any;
    dialogClose: FileManagerPropsModel.closeFileManager;
    setSearchText: (arg1: FileManagerStateModel.searchText) => any;
}

export interface HeaderStateModel {
    historyList: Array<string>;
    searchFieldAutoSearch: boolean;
    searchFieldText: string;
}
