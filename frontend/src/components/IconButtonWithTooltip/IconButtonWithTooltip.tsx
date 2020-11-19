import React from 'react';
import useStyles from './IconButtonWithTooltip.css';
import { IconButtonWithTooltipPropsModel } from './IconButtonWithTooltip.d';
import { IconButton, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

export const IconButtonWithTooltip: React.FunctionComponent<IconButtonWithTooltipPropsModel> = ({
    tooltipText,
    disabled = false,
    onClick,
    arrow,
    placement,
    ...other
}) => {
    const classes = useStyles();

    const adjustedProps = {
        disabled,
        component: disabled ? 'div' : undefined,
        onClick: disabled ? undefined : onClick,
    };

    return (
        <Tooltip title={tooltipText} placement={placement} arrow={arrow}>
            <IconButton
                {...other}
                {...adjustedProps}
                classes={{ ...other.classes, root: clsx(other.classes?.root, classes.IconButton) }}
            />
        </Tooltip>
    );
};

export default IconButtonWithTooltip;
