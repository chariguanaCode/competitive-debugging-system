import React, { useEffect, useRef, useState } from 'react';
import useStyles from './AnchoredDialog.css';
import { AnchoredDialogPropsModel, AnchoredDialogStateModel } from './AnchoredDialog.d';

export const AnchoredDialog: React.FunctionComponent<AnchoredDialogPropsModel> = ({
    anchorElRef,
    anchorEl,
    content,
    contentProps = {},
    open,
    closeOnClickOutside = false,
    position = 'right-middle',
    anchorPosition = 'left-middle',
    closeDialog,
}) => {
    const classes = useStyles();
    const dialogRef = useRef(null);
    const [dialogStyle, setDialogStyle] = useState({});

    const setDialogPosition = (dialogEl: any, anchorElC: any) => {
        const anchorElBounds = anchorElC.getBoundingClientRect();
        const dialogElBounds = dialogEl.getBoundingClientRect();
        const dialogStyle = {};
        const [dstX, dstY]: string[] = position.split('-');
        const [ancX, ancY]: string[] = anchorPosition.split('-');
        setDialogStyle({
            left:
                ({
                    left: anchorElBounds.left - 10,
                    middle: anchorElBounds.left + anchorElBounds.width / 2,
                    right: anchorElBounds.right + 10,
                } as { [key: string]: any })[dstX] +
                ({
                    left: 0,
                    middle: -dialogElBounds.width / 2,
                    right: -dialogElBounds.width,
                } as { [key: string]: any })[ancX],
            top:
                ({
                    top: anchorElBounds.top - 10,
                    middle: anchorElBounds.top + anchorElBounds.height / 2,
                    bottom: anchorElBounds.bottom + 10,
                } as { [key: string]: any })[dstY] +
                ({
                    top: 0,
                    middle: -dialogElBounds.height / 2,
                    bottom: -dialogElBounds.height,
                } as { [key: string]: any })[ancY],
        });
    };

    useEffect(() => {
        if (dialogRef.current && (anchorEl || (anchorElRef && anchorElRef.current)))
            setDialogPosition(dialogRef.current, anchorEl ? anchorEl : anchorElRef.current);
    }, [dialogRef, anchorElRef, anchorEl]);

    return (
        <>
            {open && content && (
                <>
                    {closeOnClickOutside && (
                        <div
                            onClick={(e) => {
                                e.preventDefault();
                                if (closeDialog) closeDialog();
                            }}
                            className={classes.DialogBackground}
                        ></div>
                    )}
                    <div style={dialogStyle} ref={dialogRef} className={classes.AnchoredDialog}>
                        {React.cloneElement(content, { ...contentProps })}
                    </div>
                </>
            )}
        </>
    );
};

export default AnchoredDialog;
