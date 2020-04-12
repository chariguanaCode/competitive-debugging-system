import React, { ReactElement } from 'react'
import { Dialog } from '@material-ui/core'
import { TestManager } from './TestManager/index'
interface Props {
    handleClose: (event: Event) => void
    open: boolean
}

export default function MainMenu({ handleClose, open }: Props): ReactElement {
    return (
        <div>
            <Dialog onClose={handleClose} open={open}>
                {/*<TestManager availableFileTypes={[]} />*/}
            </Dialog>
        </div>
    )
}
