import React, { memo } from 'react';
import useStyles from './Content.css';
import { ContentPropsModel, ContentStateModel } from './Content.d';

export const Content: React.FunctionComponent<ContentPropsModel> = memo(({ children }) => {
    const classes = useStyles();
    return (
        <>
            <div className={classes.Content}>{children}</div>
        </>
    );
});

export default Content;
