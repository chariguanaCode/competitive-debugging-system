import { IconButtonProps, TooltipProps } from '@material-ui/core';

export interface IconButtonWithTooltipPropsModel extends IconButtonProps {
    disabled?: boolean;
    tooltipText: string;
    arrow?: boolean;
    placement?: TooltipProps['placement'];
}
