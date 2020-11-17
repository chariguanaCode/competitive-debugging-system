import * as cppActions from './cppActions';
import { fileExist, createDirectory, removeDirectory, getFileBasename, compareFiles } from './asyncFileActions';
import PromiseQueue from '../utils/parallelPromiseQueue';
import { useBeginTest, useFinishTest, useTestError } from './testManagement';
import { ExecutionState } from 'reduxState/models';
import { useConfig } from 'reduxState/selectors';
import { useExecutionStateActions } from 'reduxState/actions';

const remote = window.require('electron').remote;

export default () => {
    const config = useConfig();
    const { setExecutionState } = useExecutionStateActions();
    const beginTest = useBeginTest();
    const finishTest = useFinishTest();
    const testError = useTestError();

    return async () => {
        const sourcePath = config.projectInfo.files[0];
        const modifiedSourcePath = sourcePath.replace(/\.cpp$/, '.tmp.cpp');
        const binaryPath = sourcePath.replace(/\.cpp$/, '.bin');
        const tests = config.tests;
        const defaultTestsOutputDirectory = remote.getGlobal('paths').testsOutputs;
        const projectTestsOutputDirectory = defaultTestsOutputDirectory + '/' + config.projectInfo.uuid + '/';

        await removeDirectory(projectTestsOutputDirectory).catch((err) => {});
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
            console.log('Found tests:', tests);
            const testPromises = new PromiseQueue(4);
            const groupId = Object.keys(tests.groups)[0];
            const groupTests = tests.groups[groupId].tests;
            await Promise.all(
                // TODO: add groups handling
                Object.keys(groupTests).map((testId) => {
                    const inputBasename = getFileBasename(groupTests[testId].inputPath);
                    console.log(inputBasename, projectTestsOutputDirectory);
                    return testPromises
                        .enqueue(
                            () =>
                                cppActions.executeTest(
                                    binaryPath,
                                    groupTests[testId].inputPath,
                                    projectTestsOutputDirectory + inputBasename + '.out',
                                    projectTestsOutputDirectory + inputBasename + '.err'
                                ),
                            beginTest(Number(testId))
                        )
                        .then(
                            finishTest(
                                Number(testId),
                                projectTestsOutputDirectory + inputBasename + '.out',
                                groupTests[testId].outputPath
                            ),
                            testError(Number(testId))
                        );
                })
            );
            setExecutionState({ state: ExecutionState.Finished, details: '' });
        } catch (err) {
            console.log(err);
        }
    };
};
