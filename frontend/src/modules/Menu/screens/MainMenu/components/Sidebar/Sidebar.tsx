import React from 'react';
import useStyles from './Sidebar.css';
import { useTheme } from '@material-ui/core/styles';
import { MenuList, MenuItem } from '@material-ui/core';
import SectorsButtons, { Sector } from '../SectorsButtons';
import { SidebarProps } from './Types';
import {useProjectFile} from 'reduxState/selectors'

export const Sidebar: React.FunctionComponent<SidebarProps> = ({ isAnyProjectOpen, selectSector, selectedSector }) => {
    const classes = useStyles();
    const theme = useTheme();
    const projectFile = useProjectFile();
    return (
        <>
            <div className={classes.Sidebar}>
                <MenuList className={classes.SectorsButtonsList}>
                    {SectorsButtons.map((obj, index) => {
                        return (
                            <MenuItem
                                key={`MainMenuOption-${index}`}
                                disabled={obj.disabled || (obj.doesNeedOpenProject && !projectFile) || (obj.doesNeedSaveLocation && !projectFile?.hasSaveLocation)}
                                onClick={() => {
                                    selectSector(obj.sectorId);
                                }}
                                className={classes.OptionItem}
                                style={{
                                    backgroundColor:
                                        obj.sectorId === selectedSector
                                            ? theme.palette.mainMenu.selectedButtonBackgroundColor
                                            : 'transparent',
                                }}
                            >
                                {React.cloneElement(obj.icon, {
                                    style: { color: theme.palette.mainMenu.iconColorEnabled },
                                })}
                                <span style={{ paddingLeft: '10px' }}>{obj.name}</span>
                            </MenuItem>
                        );
                    })}
                </MenuList>
            </div>
        </>
    );
};

export default Sidebar;
