import React from 'react';
import {
    Description as DescriptionIcon,
    DeveloperBoard as DeveloperBoardIcon,
    Folder as FolderOutlinedIcon,
    Image as ImageIcon,
    InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
    Movie as MovieIcon,
} from '@material-ui/icons';
import useStyles from './FileIcon.css';

const FileIcon: React.FunctionComponent<{ fileType: string }> = ({ fileType }) => {
    const classes = useStyles();
    switch (fileType) {
        case 'DIRECTORY':
            return <FolderOutlinedIcon className={classes.FileIcon} style={{ color: '#ffee58' }} />;
        case 'IMAGE':
            return <ImageIcon className={classes.FileIcon} style={{ color: '#66bb6a' }} />;
        case 'MOVIE':
            return <MovieIcon className={classes.FileIcon} style={{ color: '#4db6ac' }} />;
        case 'DOCUMENT':
            return <DescriptionIcon className={classes.FileIcon} style={{ color: '#757575' }} />;
        case 'EXECUTABLE':
            return <DeveloperBoardIcon className={classes.FileIcon} style={{ color: '#aa00ff' }} />;
        default:
            return <InsertDriveFileOutlinedIcon className={classes.FileIcon} />;
    }
};

export default FileIcon;
