import React, { memo }                  from 'react';
import { FileType } from './fileManager'
import { Button } from '@material-ui/core'
import Sidebar from '../Sidebar'
import { makeStyles } from '@material-ui/core/styles' 
interface FileManagerSelectedFilesTypes {
    selectedFiles: Set<string>,
    LoadDirectory: Function
}

const useStyles = makeStyles({
    buttonLabel: {
        fontSize: "10px"
    }
})
export const FileManagerSelectedFiles: React.FunctionComponent<FileManagerSelectedFilesTypes> = memo(({selectedFiles, LoadDirectory}) => {
    const classes = useStyles();
    return <>
        <div>
            {[...selectedFiles.keys()].map((key,index) => (
                <div key = {`selectedFiles-${index}`}>
                    <Button classes = {{label: classes.buttonLabel}} onClick = {() => {LoadDirectory(key.split('/').slice(0,-1).join('/'))}}>{key}</Button>
                </div>
            ))}
        </div>
    </>
})