import React, { memo } from 'react';
import { useState } from 'react';
import { useTheme } from '@material-ui/core/styles';
import useStyles from './MainMenu.css';
import { MainMenuProps } from './Types';
import { Sidebar, Content } from './components';
import { Sector } from './components/SectorsButtons';
const MainMenu: React.FunctionComponent<MainMenuProps> = memo(({ open, handleClose, isAnyProjectOpen }) => {
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
});

export default MainMenu;
