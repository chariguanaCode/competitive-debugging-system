import React from 'react';
import useStyles from './ToggleButtonWithTooltip.css';
import { ToggleButtonWithTooltipPropsModel } from './ToggleButtonWithTooltip.d';
import { Tooltip } from '@material-ui/core';
import { ToggleButton } from '@material-ui/lab';
import clsx from 'clsx';

export const ToggleButtonWithTooltip: React.FunctionComponent<ToggleButtonWithTooltipPropsModel> = ({
    tooltipText,
    arrow,
    placement,
    disabled = false,
    onChange,
    ...other
}) => {
    const classes = useStyles();

    const adjustedProps = {
        disabled,
        component: disabled ? 'div' : undefined,
        onChange: disabled ? undefined : onChange,
    };

    return (
        <Tooltip title={tooltipText} placement={placement} arrow={arrow}>
            <ToggleButton
                {...other}
                {...adjustedProps}
                classes={{ ...other.classes, root: clsx(other.classes?.root, classes.ToggleButton) }}
            />
        </Tooltip>
    );
};

export default ToggleButtonWithTooltip;
