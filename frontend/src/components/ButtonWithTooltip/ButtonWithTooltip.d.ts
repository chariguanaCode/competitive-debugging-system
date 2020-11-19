import { ButtonProps, TooltipProps } from '@material-ui/core';

export interface ButtonWithTooltipPropsModel extends ButtonProps {
    disabled?: boolean;
    tooltipText: string;
    arrow?: boolean;
    placement?: TooltipProps['placement'];
}
