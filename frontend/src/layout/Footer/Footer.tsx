import React, { useState, useEffect } from 'react';
import useStyles from './Footer.css';
import { useConfig, useCurrentTaskState } from 'reduxState/selectors';

export const Footer = () => {
    const classes = useStyles();
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const listener = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => {
            clearInterval(listener);
        };
    }, [setCurrentTime]);

    const date = new Intl.DateTimeFormat('pl', {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        //second: 'numeric', VERY DISTRACTING
    }).format(currentTime);

    const config = useConfig();
    const projectName = config.projectInfo.name;
    const currentTestState = useCurrentTaskState();
    const currentTest = config.tests.groups[currentTestState.groupId]?.tests?.[currentTestState.id].name;

    const leftElements = [<>{projectName}</>, <>{currentTest}</>];
    const rightElements = [
        <>
            {process.env.REACT_APP_NAME} {process.env.REACT_APP_VERSION}
        </>,
        <>{date}</>,
    ];

    return (
        <div className={classes.wrapper}>
            <div className={classes.separator} />
            {[...leftElements, <div style={{ flexGrow: 1 }} />, ...rightElements].map((elem, key) => (
                <React.Fragment key={key}>
                    {!elem.props.style ? <div className={classes.element}>{elem}</div> : elem}
                    <div className={classes.separator} />
                </React.Fragment>
            ))}
        </div>
    );
};

export default Footer;
