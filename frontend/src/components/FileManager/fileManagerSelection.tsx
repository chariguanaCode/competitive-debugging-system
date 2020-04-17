import React, { memo, useState, useEffect, useRef }                  from 'react';
import { FileType } from './fileManager'
import { Button } from '@material-ui/core'
import Sidebar from '../Sidebar'
import { isNumeric, checkIfActiveElementIsInput, GetRectangleRightTopAndLeftBottomCorners, DoRectanglesOverclap } from'../../utils/tools'
import { Rectangle } from './Rectangle'

interface FileManagerSelectionTypes {
    selectedFilesState: Set<string>,
    startPosition: {
        x: number,
        y: number,
        isRightMB: boolean
    },
    filesRefs: any,
    SetSelectedFiles: Function,
    RenderForceFoo: Function,
    EndSelection: Function
}


export const FileManagerSelection: React.FunctionComponent<FileManagerSelectionTypes> = memo(({startPosition, selectedFilesState, filesRefs , SetSelectedFiles, RenderForceFoo, EndSelection}) => {
    const [mouseSelection, setMouseSelection] = useState({
        x1: startPosition.x,
        y1: startPosition.y,
        x2: startPosition.x,
        y2: startPosition.y,
        isRightMB: startPosition.isRightMB
    })

    const CheckSelection = () => {
        let filesToChangeStatus: Array<string> = [];
        for(let i = 0; i < filesRefs.current.length; ++i) {
            if(!filesRefs.current[i]) continue;
            let isSelected = false
            if(filesRefs.current[i].classList.contains('fileButton-selected')) 
                isSelected = true;
            if(!filesRefs.current[i].classList.contains('fileButton-acceptable') ||
                (isSelected && !mouseSelection.isRightMB) ||
                (!isSelected && mouseSelection.isRightMB)) continue;
            let cords = filesRefs.current[i].getBoundingClientRect(); 
            let corners = GetRectangleRightTopAndLeftBottomCorners(cords.x, cords.y, cords.x + cords.width, cords.y + cords.height)
            let selectionCorners = GetRectangleRightTopAndLeftBottomCorners(mouseSelection.x1, mouseSelection.y1, mouseSelection.x2, mouseSelection.y2)
            if(DoRectanglesOverclap(
                {x1: corners[0].x, y1: corners[0].y, x2: corners[1].x, y2: corners[1].y}, 
                {x1: selectionCorners[0].x, y1: selectionCorners[0].y, x2: selectionCorners[1].x, y2: selectionCorners[1].y}
            )) {
                filesToChangeStatus.push(filesRefs.current[i].dataset.path)
                RenderForceFoo(filesRefs.current[i].dataset.renderblockid)
            } 
        }
        if(filesToChangeStatus.length === 0) return;
        let selectedFiles = new Set(selectedFilesState)
        if(mouseSelection.isRightMB) filesToChangeStatus.forEach(item => {selectedFiles.delete(item)});
        else                         filesToChangeStatus.forEach(item => {selectedFiles.add(item)});
        SetSelectedFiles(selectedFiles);
    }

    useEffect(() => {
        CheckSelection();
    }, [mouseSelection.x2, mouseSelection.y2])
    
    const onMouseMove = (e: any) => {
        e.persist();
        setMouseSelection((pv: any) => ({
            ...pv,
            x2: e.pageX,
            y2: e.pageY
        }));
    }

    return <>
        <div onMouseUp = { () => { EndSelection() } } onMouseMove = {onMouseMove} style = {{position: "absolute", width: "100%", height: "100%", zIndex: 10000}}>
            <Rectangle 
                x0 = {mouseSelection.x1} 
                x1 = {mouseSelection.x2} 
                y0 = {mouseSelection.y1} 
                y1 = {mouseSelection.y2}
            />
        </div>
    </>
})