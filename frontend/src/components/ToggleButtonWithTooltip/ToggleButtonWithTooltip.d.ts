import { TooltipProps } from '@material-ui/core';
import { ToggleButtonProps } from '@material-ui/lab';

export interface ToggleButtonWithTooltipPropsModel extends ToggleButtonProps {
    disabled?: boolean;
    tooltipText: string;
    arrow?: boolean;
    placement?: TooltipProps['placement'];
}
