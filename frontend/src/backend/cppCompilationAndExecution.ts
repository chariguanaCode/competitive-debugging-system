import * as cppActions from './cppActions';
import { fileExist, createDirectory, getFileBasename, readFile, getFileDirname } from './asyncFileActions';
import PromiseQueue from '../utils/parallelPromiseQueue';
import { useBeginTest, useFinishTest, useTestError } from './testManagement';
import { ExecutionState } from 'reduxState/models';
import { useConfig, useSourceHash } from 'reduxState/selectors';
import { useExecutionStateActions } from 'reduxState/actions';

const remote = window.require('electron').remote;
const md5 = window.require('md5');

export const useCompilationAndExecution = () => {
    const config = useConfig();
    const { setExecutionState, beginCompilation } = useExecutionStateActions();
    const beginTest = useBeginTest();
    const finishTest = useFinishTest();
    const testError = useTestError();

    const sourceHash = useSourceHash();

    return async (testsToRun?: { [key: string]: string[] }) => {
        const sourcePath = config.projectInfo.files[0];
        const modifiedSourcePath = sourcePath.replace(/\.cpp$/, '.tmp.cpp');
        const sourceFolder = getFileDirname(sourcePath);
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
            let hrstart = window.process.hrtime();

            if (!(await fileExist(sourcePath))) {
                setExecutionState({
                    state: ExecutionState.CompilationError,
                    details: "Source file doesn't exist",
                    sourceHash: '',
                });
                console.log("Source file doesn't exist");
                throw new Error();
            }

            const newSourceHash = md5(await readFile(sourcePath)) as string;

            if (sourceHash !== newSourceHash || !(await fileExist(binaryPath))) {
                beginCompilation(newSourceHash);

                await cppActions.modifyCppSource(sourcePath, modifiedSourcePath);

                await cppActions.compileCpp(modifiedSourcePath, binaryPath).catch((stderr: any) => {
                    setExecutionState({ state: ExecutionState.CompilationError, details: stderr, sourceHash: '' });
                    console.log(stderr);
                    throw new Error();
                });
            }

            let hrend = window.process.hrtime(hrstart);
            setExecutionState({
                state: ExecutionState.Running,
                details: `Compilation took ${hrend[0]}s ${hrend[1] / 1000000}ms`,
            });

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
                        return testPromises
                            .enqueue(
                                () =>
                                    cppActions.executeTest(
                                        binaryPath,
                                        sourceFolder,
                                        testVal.inputPath,
                                        projectTestsOutputDirectory + testId + '.out',
                                        projectTestsOutputDirectory + testId + '.err',
                                        groupTimeout
                                    ),
                                beginTest(testId)
                            )
                            .then(
                                finishTest(
                                    testId,
                                    projectTestsOutputDirectory + testId + '.out',
                                    testVal.outputPath,
                                    groupTimeLimit
                                ),
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
