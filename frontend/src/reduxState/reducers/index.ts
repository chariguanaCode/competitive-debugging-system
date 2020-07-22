import { combineReducers } from 'redux';
import projectFile from './projectFile';
import config from './config';
import executionState from './executionState';
import taskStates from './taskStates';

export default combineReducers({
    projectFile,
    config,
    executionState,
    taskStates,
});
