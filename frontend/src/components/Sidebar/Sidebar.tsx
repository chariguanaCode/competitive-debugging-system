import React, { ReactElement, useState } from 'react';
import { Drawer, makeStyles } from '@material-ui/core';
import { NavigateNext, NavigateBefore } from '@material-ui/icons';
import Scrollbars from 'react-custom-scrollbars';
import useStyles from './Sidebar.css';

interface Props {
    children: ReactElement | ReactElement[];
    variant: 'right' | 'left';
    container?: any;
}

function LeftSidebar({ children, variant, container }: Props): ReactElement {
    const classes = useStyles({ variant });
    const [open, setOpen] = useState(false);
    return (
        <>
            <Drawer
                variant="permanent"
                anchor={variant}
                className={classes.drawer + ' ' + open ? classes.drawerOpen : classes.drawerClose}
                /*PaperProps={{ style: { position: 'absolute' } }}
                BackdropProps={{ style: { position: 'absolute' } }}
                ModalProps={{
                    container: document.getElementById('xdd'),
                    style: { position: 'absolute' }
                }}*/
            >
                <div className={classes.wrapper} style={{}}>
                    {variant === 'right' && (
                        <button onClick={() => setOpen(!open)}>{open ? <NavigateNext /> : <NavigateBefore />}</button>
                    )}
                    <Scrollbars
                        className={open ? classes.paperOpen : classes.paperClose}
                        style={{ width: '' }}
                        renderThumbVertical={({ ...props }) => <div className={classes.scrollBar} {...props} />}
                    >
                        {children}
                    </Scrollbars>
                    {variant === 'left' && (
                        <button onClick={() => setOpen(!open)}>{open ? <NavigateBefore /> : <NavigateNext />}</button>
                    )}
                </div>
            </Drawer>
        </>
    );
}

export default LeftSidebar;
