import * as cppActions from './cppActions';
import { fileExist, createDirectory, removeDirectory, getFileBasename, compareFiles } from './asyncFileActions';
import PromiseQueue from '../utils/parallelPromiseQueue';
import { useBeginTest, useFinishTest, useTestError } from './testManagement';
import { ExecutionState, TestModel } from 'reduxState/models';
import { useConfig } from 'reduxState/selectors';
import { useExecutionStateActions } from 'reduxState/actions';

const remote = window.require('electron').remote;

export const useCompilationAndExecution = () => {
    const config = useConfig();
    const { setExecutionState } = useExecutionStateActions();
    const beginTest = useBeginTest();
    const finishTest = useFinishTest();
    const testError = useTestError();

    return async (testsToRun?: { [key: string]: string[] }) => {
        const sourcePath = config.projectInfo.files[0];
        const modifiedSourcePath = sourcePath.replace(/\.cpp$/, '.tmp.cpp');
        const binaryPath = sourcePath.replace(/\.cpp$/, '.bin');
        const defaultTestsOutputDirectory = remote.getGlobal('paths').testsOutputs;
        const projectTestsOutputDirectory = defaultTestsOutputDirectory + '/' + config.projectInfo.uuid + '/';

        if (!testsToRun) {
            testsToRun = {};
            for (const groupId in config.tests.groups) {
                testsToRun[groupId] = Object.keys(config.tests.groups[groupId]);
            }
        }
        
        await createDirectory(projectTestsOutputDirectory).catch((err) => {});

        try {
            setExecutionState({ state: ExecutionState.Compiling, details: '' });
            let hrstart = window.process.hrtime();

            await cppActions.modifyCppSource(sourcePath, modifiedSourcePath);

            await cppActions.compileCpp(modifiedSourcePath, binaryPath).catch((stderr: any) => {
                setExecutionState({ state: ExecutionState.CompilationError, details: stderr });
                console.log(stderr);
                throw new Error();
            });

            let hrend = window.process.hrtime(hrstart);
            setExecutionState({ state: ExecutionState.Running, details: `Took ${hrend[0]}s ${hrend[1] / 1000000}ms` });

            console.log('Running tests...');
            console.log('Found tests:', testsToRun);
            const testPromises = new PromiseQueue(10);
            const promisesArray = [];
            for (const groupId in testsToRun) {
                const maximumGroupRunningTime = config.tests.groups[groupId].maximumRunningTime;
                const _groupTimeLimit = config.tests.groups[groupId].timeLimit;

                let groupTimeout: undefined | number;
                if (!maximumGroupRunningTime || maximumGroupRunningTime === '-1') groupTimeout = undefined;
                else groupTimeout = parseInt(maximumGroupRunningTime);

                let groupTimeLimit: undefined | number;
                if (!_groupTimeLimit || _groupTimeLimit === '-1') groupTimeLimit = undefined;
                else groupTimeLimit = parseInt(_groupTimeLimit);

                promisesArray.push(
                    ...testsToRun[groupId].map((testId) => {
                        const testVal = config.tests.groups[groupId].tests[testId];
                        const inputBasename = getFileBasename(testVal.inputPath);
                        return testPromises
                            .enqueue(
                                () =>
                                    cppActions.executeTest(
                                        binaryPath,
                                        testVal.inputPath,
                                        projectTestsOutputDirectory + inputBasename + '.out',
                                        projectTestsOutputDirectory + inputBasename + '.err',
                                        groupTimeout
                                    ),
                                beginTest(testId)
                            )
                            .then(
                                finishTest(testId, projectTestsOutputDirectory + inputBasename + '.out', testVal.outputPath, groupTimeLimit),
                                testError(testId)
                            );
                    })
                );
            }
            await Promise.all(promisesArray);
            setExecutionState({ state: ExecutionState.Finished, details: '' });
        } catch (err) {
            console.log(err);
        }
    };
};

export default useCompilationAndExecution;
