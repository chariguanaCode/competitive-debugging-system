import React, { useState, memo } from 'react';
import useStyles from './Menu.css';
import { MenuPropsModel, MenuStateModel } from './Menu.d';
import { Content, Sidebar } from './components';
export const Menu: React.FunctionComponent<MenuPropsModel> = memo(
    ({ sectors, contents, buttons, contentsProps = {}, contentProps = {}, defaultSelectedSector }) => {
        const [selectedSector, selectSector] = useState<typeof sectors[0]>(
            defaultSelectedSector ? defaultSelectedSector : sectors[0]
        );
        const classes = useStyles();
        const SectorContent = contents[selectedSector];
        return (
            <>
                <div className={classes.Menu}>
                    <>
                        <Sidebar selectedSector={selectedSector} selectSector={selectSector} buttons={buttons} />
                        <Content>
                            {SectorContent && <SectorContent {...contentsProps} {...contentProps[selectedSector]} />}
                        </Content>
                    </>
                </div>
            </>
        );
    }
);

export default Menu;
