import React from 'react';
import useStyles from './ButtonWithTooltip.css';
import { ButtonWithTooltipPropsModel } from './ButtonWithTooltip.d';
import { Button, Tooltip } from '@material-ui/core';
import clsx from 'clsx';

export const ButtonWithTooltip: React.FunctionComponent<ButtonWithTooltipPropsModel> = ({
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
            <Button
                {...other}
                {...adjustedProps}
                classes={{ ...other.classes, root: clsx(other.classes?.root, classes.Button) }}
            />
        </Tooltip>
    );
};

export default ButtonWithTooltip;
