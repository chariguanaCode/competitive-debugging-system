import { handleActions } from 'redux-actions';
import { CdsConfigActions } from '../actions';
import { CdsConfigModel } from '../models';

export const csdConfigReducer = handleActions<CdsConfigModel>(
    {
        [CdsConfigActions.SET_CDS_CONFIG]: (state, action) => action.payload,
        [CdsConfigActions.PUSH_PROJECT_TO_PROJECTS_HISTORY]: (state, action) => {
            // @ts-ignore
            const projectPath = action.payload as string;
            const newProjectsHistory = ([] as string[]).concat(state.projects.projectsHistory);
            const projectIndex = newProjectsHistory.indexOf(projectPath);
            if (projectIndex != -1) {
                newProjectsHistory.splice(projectIndex, 1);
            }
            newProjectsHistory.push(projectPath);
            return {
                ...state,
                projects: {
                    ...state.projects,
                    projectsHistory: newProjectsHistory,
                },
            };
        },
    },
    {} as CdsConfigModel
);

export default csdConfigReducer;
