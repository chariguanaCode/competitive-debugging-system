import React, { memo }                from "react";
//@ts-ignore
import {Line} from 'react-lineto';
import {useTheme } from '@material-ui/core/styles'
export const Rectangle: React.FunctionComponent<{x0: number, x1: number, y0: number, y1: number}> = ({x0,x1,y0,y1}) => {
    const theme = useTheme();
    return <> 
        <Line x0 = {x0} y0 = {y0} x1 = {x0} y1 = {y1} zIndex = {4000} borderWidth = {2} borderColor = {theme.palette.fileManager.selectionColor}/>
        <Line x0 = {x0} y0 = {y1} x1 = {x1} y1 = {y1} zIndex = {4000} borderWidth = {2} borderColor = {theme.palette.fileManager.selectionColor}/>
        <Line x0 = {x1} y0 = {y1} x1 = {x1} y1 = {y0} zIndex = {4000} borderWidth = {2} borderColor = {theme.palette.fileManager.selectionColor}/>
        <Line x0 = {x1} y0 = {y0} x1 = {x0} y1 = {y0} zIndex = {4000} borderWidth = {2} borderColor = {theme.palette.fileManager.selectionColor}/>
    </>
    
}