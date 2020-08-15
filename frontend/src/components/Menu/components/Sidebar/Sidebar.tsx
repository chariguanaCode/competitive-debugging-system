import React, { memo } from 'react';
import useStyles from './Sidebar.css';
import { MenuList, MenuItem } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { SidebarPropsModel } from './Sidebar.d';

export const Sidebar: React.FunctionComponent<SidebarPropsModel> = memo(({ buttons, selectSector, selectedSector }) => {
    const classes = useStyles();
    const theme = useTheme();
    return (
        <>
            <div className={classes.Sidebar}>
                <MenuList className={classes.SectorsButtonsList}>
                    {buttons.map((obj, index) => {
                        return (
                            <MenuItem
                                key={`MenuOption-${index}`}
                                disabled={obj.disabled}
                                onClick={() => {
                                    selectSector(obj.key);
                                }}
                                className={classes.OptionItem}
                                style={{
                                    backgroundColor:
                                        obj.key === selectedSector
                                            ? theme.palette.Menu.selectedButtonBackgroundColor
                                            : 'transparent',
                                }}
                            >
                                {React.cloneElement(obj.icon, {
                                    style: { color: theme.palette.Menu.iconColorEnabled },
                                })}
                                <span style={{ paddingLeft: '10px' }}>{obj.name}</span>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </div>
        </>
    );
});

export default Sidebar;
