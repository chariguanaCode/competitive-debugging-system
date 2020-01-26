import   React, { memo }     from "react";
import { IconButton, Fade  } from '@material-ui/core'
import { makeStyles        } from '@material-ui/core/styles';

import ClearIcon                   from '@material-ui/icons/Clear'
import InsertDriveFileOutlinedIcon from '@material-ui/icons/InsertDriveFileOutlined';
import ImageIcon                   from '@material-ui/icons/Image';
import MovieIcon                   from '@material-ui/icons/Movie';
import DescriptionIcon             from '@material-ui/icons/Description';
import DeveloperBoardIcon          from '@material-ui/icons/DeveloperBoard';

import {Folder as FolderOutlinedIcon} from '@material-ui/icons';




interface FileType {
    name: string,
    type: string,
    path: string,
    typeGroup: string,
}

interface ShowFilesTypes {
    files: Array<FileType>,
    selectedFiles: Map<string, FileType>,
    onFileClick: Function,
    mouseOverPath: string,
    renderForce: number,
    showDeleteFileFromSelectedFilesButton: Function,
    displaySettings: {numberOfColumns: number},
    startIndex?: number,
    renderFilesLimit: number,
    SetFilesRefs: any,
    saveRefs?: boolean,
    onFileKeyDown: Function
}
const useStyles = makeStyles({
    fileTable: {
      border: "none",
      '& tbody': {
        '& tr': {
            '& td': {
                border: "1px solid",
                borderColor: "#e0ebeb",
                borderCollapse: "collapse",
                align: "left",
                '& button': {
                    textAlign: "left",
                    }
            }
          }
      }
      
    },
  });

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return prevProps.renderForce === nextProps.renderForce;
}

const ShowIcon: React.FunctionComponent<{fileType: string}>  = ({fileType}) => {
    switch(fileType){
        case "DIRECTORY":
            return <FolderOutlinedIcon style={{width: "20px", height: "20px", marginRight: "5px", color: "#ffee58"}}/>
        case "IMAGE": 
            return <ImageIcon style={{width: "20px", height: "20px", marginRight: "5px", color: "#66bb6a"}}/>
        case "MOVIE":
            return <MovieIcon style={{width: "20px", height: "20px", marginRight: "5px", color: "#4db6ac"}}/>
        case "DOCUMENT":
            return <DescriptionIcon style={{width: "20px", height: "20px", marginRight: "5px", color: "#757575"}}/>
        case "EXECUTABLE":
            return <DeveloperBoardIcon style={{width: "20px", height: "20px", marginRight: "5px", color: "#aa00ff"}}/>
        default: 
            return <InsertDriveFileOutlinedIcon style={{width: "20px", height: "20px", marginRight: "5px"}}/>
    }
}

export const ShowFiles: React.FunctionComponent<ShowFilesTypes> = memo(({onFileKeyDown ,saveRefs, SetFilesRefs, renderFilesLimit, files, displaySettings, selectedFiles, onFileClick, renderForce, showDeleteFileFromSelectedFilesButton, mouseOverPath, startIndex = 0 }) => {
    let table: any;
    let temp: any = null
    let iterator = 0;
    let filesRefs = new Array(startIndex + renderFilesLimit)
    let renderDividor = renderFilesLimit;
    for(let i = startIndex; (i < startIndex + renderDividor) && (i < files.length); ++i){
        const file = files[i];
        if (iterator === Number(displaySettings.numberOfColumns)) {
            table = <>{table}<tr>{temp}</tr></>
            temp = null;
            iterator = 0;
        }
        if (selectedFiles.has(file.path)) {
            if(file.type === "DIRECTORY") {
                let closeButton = <></>;
                if(file.path === mouseOverPath) closeButton = <Fade in={true}><IconButton style = {{color: "red", backgroundColor: "#0099e6", display: "flex", position: "absolute", zIndex: 999, width: "8px", height: "8px", right: 4, top: 2}} onClick = {() => {onFileClick(file, {which: 3}, true, startIndex/renderDividor)}}><ClearIcon style ={{ padding: 2 }} /></IconButton></Fade>
                temp = <>{temp}<td style={{ backgroundColor: "#90caf9"}}><div onKeyDown = { (e) => { onFileKeyDown(e, file.path) } } onMouseEnter = {() => { showDeleteFileFromSelectedFilesButton(file.path, "", startIndex/renderDividor); }}  onMouseLeave = {() => { showDeleteFileFromSelectedFilesButton("", file.path, startIndex/renderDividor) }} style = {{position: "relative"}}>{closeButton}<button ref={saveRefs ? (ref) => { SetFilesRefs(i, ref); return true;} : null} style={{ backgroundColor: "#90caf9" }} onClick={(e) => { onFileClick(file, e, true, startIndex/renderDividor) }}><ShowIcon fileType = {file.typeGroup}/>{file.name}</button></div></td></>
            } else {
                temp = <>{temp}<td style={{ backgroundColor: "#90caf9" }}><button ref={saveRefs ? (ref) => { SetFilesRefs(i, ref); return true;} : null} style={{ backgroundColor: "#90caf9" }} onClick={(e) => { onFileClick(file, e, true, startIndex/renderDividor) }}><ShowIcon fileType = {file.typeGroup}/>{file.name}</button></td></>
            }
        } else {
             temp = <>{temp}<td style = {{ position: "relative" }}><button ref={saveRefs ? (ref) => { SetFilesRefs(i, ref); return true;} : null} onKeyDown = { file.type === "DIRECTORY" ? (e) => { onFileKeyDown(e, file.path) } : () => {}} onClick={(e) => { onFileClick(file, e, false, startIndex/renderDividor) }}><ShowIcon fileType = {file.typeGroup}/>{file.name}</button></td></>
        }
        iterator += 1;
    }
    if (temp !== null) table = <>{table}<tr>{temp}</tr></>

    const classes = useStyles();
    return <>{table}</>
},arePropsEqual)