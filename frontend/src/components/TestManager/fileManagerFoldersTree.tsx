import React, { memo }                  from 'react';
import { useEffect, useState, useRef  } from 'react';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon   from '@material-ui/icons/ArrowDropUp';

interface FileManagerFoldersTreeTypes {
    socket: any,
    currentPath: string,
    showLoadingCircular: Function
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
export const FileManagerFoldersTree: React.FunctionComponent<FileManagerFoldersTreeTypes> = memo(({showLoadingCircular,socket, currentPath}) => {

    const [ rerenderValue, RerenderForce ] = useState(1)
    let foldersTree = useRef<foldersTreeObjectTypes>({});
    let treeVisibility = useRef(new Map()) 

    const loadDirectory = (path: string) => {
        if(socket){
            socket.send(JSON.stringify({
                type: "loadFilesOnDirectory",
                data: {
                    directory: path,
                    filetypes: ["DIRECTORY"],
                    key: "FolderTreeTests"
                }
            }))
        } else console.log("connection error")
    }

    const joinDirectory = (path: string) => {
        showLoadingCircular();
        if(socket){
            socket.send(JSON.stringify({
                type: "loadFilesOnDirectory",
                data: {
                    directory: path,
                    filetypes: null,
                    key: ""
                }
            }))
        } else console.log("connection error")
    }

    useEffect(() => {
        if (socket) {
            socket.addEventListener("message", (msg: any) => {
                const message = JSON.parse(msg.data)
                const type = message.type
                const data = message.data
                if (type === "loadDirectoryFolderTreeTests") {
                    if(data.path){
                        Object.assign(foldersTree.current,{[data.path === "/" ? data.path : data.path.slice(0,-1)]: data.files})
                        RerenderForce(prevValue=>(prevValue+1))
                    }
                }
            })
        }
    }, [socket]);

    const showDirectory = (dir: string) => {
        treeVisibility.current.set(dir,!treeVisibility.current.get(dir));
        if(!foldersTree.current.hasOwnProperty(dir)) loadDirectory(dir)
        else RerenderForce(prevValue=>(prevValue+1))
    }

    const renderTree = (dir: string, indentation: string, name: string) => {
        let layer = <span style = {{whiteSpace: "nowrap"}}>
            {indentation}<button style = {{padding: '0px', margin: '0px'}} 
                                 onClick = {()=>{showDirectory(dir)}}>
                            {treeVisibility.current.get(dir) ? <ArrowDropUpIcon/> : <ArrowDropDownIcon/>}
                        </button>
                        <button onClick = {dir !== currentPath.slice(0,-1) ? ()=>{joinDirectory(dir)} : ()=>{}} 
                                style = {{padding: '0px', margin: '0px', textAlign: "left", paddingBottom: '3px'}}>
                                   <span style = {(dir === currentPath.slice(0,-1)) || (dir === '/' && currentPath === '/') ? {backgroundColor: '#40c4ff', padding: '4px'} : {}}>{name}</span> 
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

    return <>
        <div style = {{alignContent: "left", alignItems: "left", textAlign: "left", display: "flex", flexDirection: "column", width: "20%"}}>
        {renderTree('/','', '/')}
        </div>
    </>
})