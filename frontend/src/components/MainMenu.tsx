import React, { ReactElement } from 'react'
import { Dialog, DialogTitle } from '@material-ui/core'

interface Props {
    handleClose: (event: Event) => void,
    open: boolean
}

export default function MainMenu({ handleClose, open }: Props): ReactElement {
    return (
        <div>
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>Set backup account</DialogTitle>
            </Dialog>
        </div>
    )
}
