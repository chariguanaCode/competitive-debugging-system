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
    onFileKeyDown: Function,
    filesDisplaySize: number
}
const useStyles = makeStyles(theme => ({
    fileIcon: {
        //@ts-ignore
        width: props => props.fileIconWidth, 
        //@ts-ignore
        height: props => props.fileIconWidth, 
    },
    fileButtonSelected: {
        backgroundColor: theme.palette.fileManager.selectionColor + "!important",
        color: theme.palette.fileManager.fontColor,
        fontWeight: 100,
        fontSize: (props: any) => props.fileTextSize, //13px
        //@ts-ignore
        maxWidth: props => props.fileButtonWidth,//"120px",,
        margin: "2px",
    },
    fileView: {
        display: "flex", 
        //@ts-ignore
        flexDirection: props => props.fileView.flexDirection, //"column",
        //@ts-ignore
        justifyContent: props => props.fileView.alignContent, //"center",
        alignContent: "center",
        alignItems: "center"
    },
    fileButton: {
        backgroundColor: "", 
        color: theme.palette.fileManager.fontColor,
        fontWeight: 100,
        margin: "2px",
        //fontWeight: "bold",
        //@ts-ignore
        fontSize: props => props.fileTextSize, //13px
        //@ts-ignore
        maxWidth: props => props.fileButtonWidth//"120px",
    },
    iconButtonButton: {
            width: "14px !important", 
            height: "14px !important",
            color: "red",
            backgroundColor: "green !important"/*"#0099e6"*/, 
            position: "absolute", 
            zIndex: 999,
            right: 4, 
            top: 2
    },
    iconButtonIcon: {
            fontSize: 20,
    },
  }));

const arePropsEqual = (prevProps: any, nextProps: any) => {
    return prevProps.renderForce === nextProps.renderForce;
}

const ShowIcon: React.FunctionComponent<{fileType: string, classes: any}>  = ({fileType, classes}) => {
    switch(fileType){
        case "DIRECTORY":
            return <FolderOutlinedIcon className = {classes.fileIcon} style = {{ color: "#ffee58" }} />
        case "IMAGE": 
            return <ImageIcon className = {classes.fileIcon} style = {{color: "#66bb6a"}} />
        case "MOVIE":
            return <MovieIcon className = {classes.fileIcon} style={{color: "#4db6ac"}}/>
        case "DOCUMENT":
            return <DescriptionIcon className = {classes.fileIcon} style={{color: "#757575"}}/>
        case "EXECUTABLE":
            return <DeveloperBoardIcon className = {classes.fileIcon} style={{color: "#aa00ff"}}/>
        default: 
            return <InsertDriveFileOutlinedIcon className = {classes.fileIcon}/>
    }
}

export const ShowFiles: React.FunctionComponent<ShowFilesTypes> = memo(({onFileKeyDown, saveRefs, SetFilesRefs, renderFilesLimit, files, displaySettings, selectedFiles, onFileClick, renderForce, showDeleteFileFromSelectedFilesButton, mouseOverPath, startIndex = 0, filesDisplaySize}) => {
    //let table: any;
    //let temp: any = null
    let iterator = -1;
    let filesRefs = new Array(startIndex + renderFilesLimit)
    let renderDividor = renderFilesLimit;
    let displaySettingsStyle = {
        fileButtonWidth: filesDisplaySize > 90 ?  "100%" : Math.ceil(filesDisplaySize * 3.2).toString() + "px",
        fileTextSize: Math.ceil(filesDisplaySize/(100/13)).toString() + "px !important",
        fileIconWidth: filesDisplaySize > 90 ?  "20px" : (filesDisplaySize * 3).toString() + "px",
        fileView: {
            flexDirection: filesDisplaySize > 90 ? "row" : "column",
            justifyContent: filesDisplaySize > 90 ? "left" : "center"
        }
    }
    //console.log(displaySettingsStyle)
    const classes = useStyles(displaySettingsStyle);
    //console.log(files)
    return <div style = {{ display: "inline" }} id = {`renderFiles${startIndex.toString()}`}>
        { files.map((file, index) => {
            let isSelected = selectedFiles.has(file.path);
            ++iterator;
            return <div
                    key = {`renderFiles${startIndex.toString()}File${index}`}
                    style = {{display: "inline", position: "relative", padding: "2px"}}
                    onKeyDown = { file.type === "DIRECTORY" ? (e) => { onFileKeyDown(e, file.path) } : () => {}} 
                    onMouseEnter = { (file.type === "DIRECTORY" && isSelected) ? () => { showDeleteFileFromSelectedFilesButton(file.path, "", startIndex/renderDividor); } : () => {}}  
                    onMouseLeave = { (file.type === "DIRECTORY" && isSelected) ? () => { showDeleteFileFromSelectedFilesButton("", file.path, startIndex/renderDividor); } : () => {}} 
                >
                    { (file.type === "DIRECTORY" && file.path === mouseOverPath) ? 
                        <Fade in={true}>
                            <IconButton
                                className = {classes.iconButtonButton}
                                onClick = {() => {showDeleteFileFromSelectedFilesButton("", file.path, startIndex/renderDividor); onFileClick(file, {which: 3}, true, startIndex/renderDividor)}}
                            >
                                <ClearIcon className ={classes.iconButtonIcon}/>
                            </IconButton>
                        </Fade> : null
                    }
                    <button 
                        className = { isSelected ? classes.fileButtonSelected : classes.fileButton }
                        ref = {saveRefs ? (ref) => { SetFilesRefs(index+startIndex, ref); return true;} : null} 
                        onClick={(e) => { onFileClick(file, e, isSelected, startIndex/renderDividor) }}
                    >
                        <div className = { classes.fileView }>
                            <div style = {{display: "flex", alignContent: "center", justifyContent: "center"}}>
                                <ShowIcon classes = {classes} fileType = {file.typeGroup}/>
                            </div>

                             <div id={`testID${startIndex.toString()}`} style = {{fontSize: displaySettingsStyle.fileTextSize, wordBreak: "break-all", display: "flex", alignContent: "center", justifyContent: "center"}}>
                                 {file.name}
                            </div>
                        </div>
                    </button>
                </div>
        }) 
        }
    </div>

    //return <><table className = {classes.fileTable}><tbody>{table}</tbody></table></>
} , arePropsEqual)


    /*for(let i = startIndex; (i < startIndex + renderDividor) && (i < files.length); ++i){
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
                temp = <>{temp}<td><div onKeyDown = { (e) => { onFileKeyDown(e, file.path) } } onMouseEnter = {() => { showDeleteFileFromSelectedFilesButton(file.path, "", startIndex/renderDividor); }}  onMouseLeave = {() => { showDeleteFileFromSelectedFilesButton("", file.path, startIndex/renderDividor) }} style = {{position: "relative"}}>{closeButton}<button ref={saveRefs ? (ref) => { SetFilesRefs(i, ref); return true;} : null} onClick={(e) => { onFileClick(file, e, true, startIndex/renderDividor) }}><ShowFile selected = {true} fileType = {file.typeGroup} fileName = {file.name}/></button></div></td></>
            } else {
                temp = <>{temp}<td><button ref={saveRefs ? (ref) => { SetFilesRefs(i, ref); return true;} : null} onClick={(e) => { onFileClick(file, e, true, startIndex/renderDividor) }}><ShowFile selected = {true} fileType = {file.typeGroup} fileName = {file.name}/></button></td></>
            }
        } else {
             temp = <>{temp}<td><button ref={saveRefs ? (ref) => { SetFilesRefs(i, ref); return true;} : null} onKeyDown = { file.type === "DIRECTORY" ? (e) => { onFileKeyDown(e, file.path) } : () => {}} onClick={(e) => { onFileClick(file, e, false, startIndex/renderDividor) }}><ShowFile selected = {false} fileType = {file.typeGroup} fileName = {file.name}/></button></td></>
        }
        iterator += 1;
    }
    if (temp !== null) table = <>{table}<tr>{temp}</tr></>*/
/*
    <button 
        ref = {saveRefs ? (ref) => { SetFilesRefs(iterator, ref); return true;} : null} 
        onKeyDown = { file.type === "DIRECTORY" ? (e) => { onFileKeyDown(e, file.path) } : () => {}} 
        onClick={(e) => { onFileClick(file, e, false, startIndex/renderDividor) }}
    >
        <ShowFile selected = {false} fileType = {file.typeGroup} fileName = {file.name}/>
    </button>

    <button 
        ref = {saveRefs ? (ref) => { SetFilesRefs(iterator, ref); return true;} : null} 
        onClick={(e) => { onFileClick(file, e, true, startIndex/renderDividor) }}
    >
        <ShowFile selected = {true} fileType = {file.typeGroup} fileName = {file.name}/>
    </button>

    <div 
        onKeyDown = { (e) => { onFileKeyDown(e, file.path) } } 
        onMouseEnter = {() => { showDeleteFileFromSelectedFilesButton(file.path, "", startIndex/renderDividor); }}  
        onMouseLeave = {() => { showDeleteFileFromSelectedFilesButton("", file.path, startIndex/renderDividor) }} 
    >
        {closeButton}
        <button 
            ref = {saveRefs ? (ref) => { SetFilesRefs(iterator, ref); return true;} : null} 
            onClick={(e) => { onFileClick(file, e, true, startIndex/renderDividor) }}
        >
            <ShowFile selected = {true} fileType = {file.typeGroup} fileName = {file.name}/>
        </button>
    </div>
*/
/*
 fileTable: {
        border: "none",
        '& tbody': {
          '& tr': {
              '& td': {
                  border: "0px solid",
                  borderColor: "#e0ebeb",
                  borderCollapse: "collapse",
                  align: "left",
                  '& button': {
                      width: "200px"
                    }
              }
            }
        }
    },
*/