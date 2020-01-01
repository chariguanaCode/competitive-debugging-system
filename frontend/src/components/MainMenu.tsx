import React, { ReactElement } from 'react'
import { Dialog, DialogTitle } from '@material-ui/core'
import { TestManager } from './TestManager/index'
interface Props {
    handleClose: (event: Event) => void,
    open: boolean,
    socket: any,
}

export default function MainMenu({ handleClose, open, socket }: Props): ReactElement {
    return (
        <div>
            <Dialog onClose={handleClose} open={open}>
                <TestManager socket = {socket}/>
            </Dialog>
        </div>
    )
}
