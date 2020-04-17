import React, { memo }                  from 'react';
import { useEffect, useState, useRef  } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon   from '@material-ui/icons/ArrowDropUp';
import { useTheme } from '@material-ui/core/styles';
import { loadFilesOnDirectory } from '../../backend/filesHandlingFunctions'
interface FileManagerFoldersTreeTypes {
    currentPath: string,
    showLoadingCircular: Function,
    joinDirectory: Function,
    currentRootDirectory: string
}

interface FileType {
    name: string,
    type: string,
    path: string,
    typeGroup: string,
}

interface foldersTreeObjectTypes {
    [key: string]: Array<FileType>,
}
export const FileManagerFoldersTree: React.FunctionComponent<FileManagerFoldersTreeTypes> = memo(({showLoadingCircular, currentPath, joinDirectory, currentRootDirectory}) => {

    const [ rerenderValue, RerenderForce ] = useState(1)
    let foldersTree = useRef<foldersTreeObjectTypes>({});
    let treeVisibility = useRef(new Map()) 

    const loadDirectory = async (path: string) => {
        //@ts-ignore
        let [files, newPath]= await loadFilesOnDirectory({directory: path, regex: null, filetypes: ['DIRECTORY']});
        if(newPath){
            Object.assign(foldersTree.current,{[newPath === "/" ? newPath : newPath.slice(0,-1)]: files})
            RerenderForce(prevValue=>(prevValue+1))
        }
    }

    const showDirectory = (dir: string) => {
        treeVisibility.current.set(dir,!treeVisibility.current.get(dir));
        if(!foldersTree.current.hasOwnProperty(dir)) loadDirectory(dir)
        else RerenderForce(prevValue=>(prevValue+1))
    }

    const renderTree = (dir: string, indentation: string, name: string) => {
        let layer = <span style = {{whiteSpace: "nowrap"}}>
            {indentation}<button style = {{padding: '0px', margin: '0px'}} 
                                 onClick = {()=>{showDirectory(dir)}}>
                            {treeVisibility.current.get(dir) ? <ArrowDropUpIcon style = {{color: theme.palette.fileManager.fontColor}} /> : <ArrowDropDownIcon style = {{color: theme.palette.fileManager.fontColor}}/>}
                        </button>
                        <button onClick = {dir !== currentPath.slice(0,-1) ? ()=>{joinDirectory(dir)} : ()=>{}} 
                                style = {{padding: '0px', margin: '0px', textAlign: "left", paddingBottom: '3px'}}>
                                   <span style = {(dir === currentPath.slice(0,-1)) || (dir === '/' && currentPath === '/') ? {backgroundColor: theme.palette.fileManager.selectionColor, padding: '4px', color: theme.palette.fileManager.fontColor} : {color: theme.palette.fileManager.fontColor}}>{name}</span> 
                        </button>
                    </span>
        if(treeVisibility.current.get(dir) === true){
            for(let i = 0; i < foldersTree.current[dir].length; ++i){
                    //@ts-ignore
                    layer = <>{layer}{renderTree(foldersTree.current[dir][i].path, indentation + '\u00A0\u00A0\u00A0\u00A0', foldersTree.current[dir][i].name)}</>
            }
        }
        return <>{layer}</>
    }
    const theme = useTheme();
    return <>
        <div style = {{color: theme.palette.fileManager.fontColor, alignContent: "left", alignItems: "left", textAlign: "left", display: "flex", flexDirection: "column", width: "20%"}}>
        {renderTree(currentRootDirectory,'',currentRootDirectory)}
        </div>
    </>
})