import React, { memo }                  from 'react';
import { FileType } from './fileManager'
import { Button } from '@material-ui/core'
import Sidebar from '../Sidebar'
interface FileManagerSelectedFilesTypes {
    selectedFiles: Map<string,FileType>,
    LoadDirectory: Function
}


export const FileManagerSelectedFiles: React.FunctionComponent<FileManagerSelectedFilesTypes> = memo(({selectedFiles, LoadDirectory}) => {
    return <>
        <div>
            {[...selectedFiles.values()].map((file,index) => (
                <div key = {`selectedFiles-${index}`}>
                    <Button onClick = {() => {LoadDirectory(file.path.split('/').slice(0,-1).join('/'))}}>{file.path}</Button>
                </div>
            ))}
        </div>
    </>
})