import { combineReducers } from 'redux';
import projectFile from './projectFile';
import config from './config';
import executionState from './executionState';
import taskStates from './taskStates';
import cdsConfig from './cdsConfig';
import fileManager from './fileManager';
import watchActionsHistory from './watchActionsHistory';
import trackedObjects from './trackedObjects';
import addTrackedObjectDialog from './addTrackedObjectDialog';

export default combineReducers({
    projectFile,
    config,
    executionState,
    taskStates,
    cdsConfig,
    fileManager,
    watchActionsHistory,
    trackedObjects,
    addTrackedObjectDialog,
});
