import React from 'react';
import { useState, useMemo } from 'react';
import { TextField, FormLabel, InputAdornment } from '@material-ui/core';
import { useTheme } from '@material-ui/core/styles';
import { useLoadProject } from 'backend/projectManagement';
import { FileType } from 'modules/FileManager/Types';
import useStyles from './MainMenu.css';
import { MainMenuProps } from './Types';
import { Sidebar, Content } from './components';
import { Sector } from './components/SectorsButtons';
const MainMenu: React.FunctionComponent<MainMenuProps> = ({ open, handleClose, isAnyProjectOpen }) => {
    const [selectedSector, selectSector] = useState<Sector>(Sector.CreateProject);
    const classes = useStyles({
        open: open,
    });
    const theme = useTheme();
    return (
        <>
            <div className={classes.MainMenu}>
                {open && (
                    <>
                        <Sidebar
                            selectedSector={selectedSector}
                            selectSector={selectSector}
                            isAnyProjectOpen={isAnyProjectOpen}
                        />
                        <Content closeMainMenu={() => handleClose()} selectedSector={selectedSector} />
                    </>
                )}
            </div>
        </>
    );
};

export default MainMenu;
