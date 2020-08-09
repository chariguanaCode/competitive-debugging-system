import React, { ReactElement } from 'react';
import useStyles from './ContextMenu.css';
import { Menu, MenuItem, ListItemIcon, ListItemText } from '@material-ui/core';

const initialState = {
    mouseX: null,
    mouseY: null,
} as {
    mouseX: null | number;
    mouseY: null | number;
};

interface Props {
    children: React.ReactNode;
    style?: React.CSSProperties;
    className?: string;
    items: Array<{
        label: string;
        icon?: ReactElement;
        onClick: () => void;
    }>;
}

export const ContextMenu = ({ children, items, style, className }: Props) => {
    const classes = useStyles();
    const [position, setPosition] = React.useState(initialState);

    const handleClick = (event: React.MouseEvent<HTMLDivElement | MouseEvent>) => {
        event.preventDefault();
        event.stopPropagation();
        setPosition({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    };

    return (
        <div onContextMenu={handleClick} style={style} className={className}>
            {children}
            <Menu
                open={position.mouseX !== null}
                onClose={() => setPosition(initialState)}
                anchorReference="anchorPosition"
                anchorPosition={
                    position.mouseY !== null && position.mouseX !== null
                        ? { top: position.mouseY, left: position.mouseX }
                        : undefined
                }
            >
                {items.map(({ label, onClick, icon }) => (
                    <MenuItem
                        key={label}
                        onClick={() => {
                            setPosition(initialState);
                            onClick();
                        }}
                    >
                        {icon && <ListItemIcon>{icon}</ListItemIcon>}
                        <ListItemText>{label}</ListItemText>
                    </MenuItem>
                ))}
            </Menu>
        </div>
    );
};

export default ContextMenu;
