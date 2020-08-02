import { combineReducers } from 'redux';
import projectFile from './projectFile';
import config from './config';
import executionState from './executionState';
import taskStates from './taskStates';
import cdsConfig from './cdsConfig';
import fileManager from './fileManager';

export default combineReducers({
    projectFile,
    config,
    executionState,
    taskStates,
    cdsConfig,
    fileManager
});
