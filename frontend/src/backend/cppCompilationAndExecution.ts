import * as cppActions from './cppActions';
import { fileExist, createDirectory, removeDirectory, getFileBasename, compareFiles } from './asyncFileActions';
import PromiseQueue from '../utils/parallelPromiseQueue';
import { useBeginTest, useFinishTest, useTestError } from './testManagement';
import { ExecutionState, TestModel } from 'reduxState/models';
import { useConfig } from 'reduxState/selectors';
import { useExecutionStateActions } from 'reduxState/actions';

const remote = window.require('electron').remote;

export default () => {
    const config = useConfig();
    const { setExecutionState } = useExecutionStateActions();
    const beginTest = useBeginTest();
    const finishTest = useFinishTest();
    const testError = useTestError();

    return async (filter: { groups?: string[]; tests?: string[] }) => {
        const sourcePath = config.projectInfo.files[0];
        const modifiedSourcePath = sourcePath.replace(/\.cpp$/, '.tmp.cpp');
        const binaryPath = sourcePath.replace(/\.cpp$/, '.bin');
        const tests: Array<[string, TestModel]> = [];
        const defaultTestsOutputDirectory = remote.getGlobal('paths').testsOutputs;
        const projectTestsOutputDirectory = defaultTestsOutputDirectory + '/' + config.projectInfo.uuid + '/';

        if (!filter.groups && !filter.tests) {
            await removeDirectory(projectTestsOutputDirectory).catch((err) => {});
            await createDirectory(projectTestsOutputDirectory).catch((err) => {});
        }

        for (const groupId in config.tests.groups) {
            if (
                Object.prototype.hasOwnProperty.call(config.tests.groups, groupId) &&
                (!filter.groups || filter.groups.includes(groupId))
            ) {
                tests.push(
                    ...Object.entries(config.tests.groups[groupId].tests).filter(
                        ([id, val]) => !filter.tests || filter.tests.includes(id)
                    )
                );
            }
        }

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
            await Promise.all(
                tests.map(([testId, testVal]) => {
                    const inputBasename = getFileBasename(testVal.inputPath);
                    return testPromises
                        .enqueue(
                            () =>
                                cppActions.executeTest(
                                    binaryPath,
                                    testVal.inputPath,
                                    projectTestsOutputDirectory + inputBasename + '.out',
                                    projectTestsOutputDirectory + inputBasename + '.err'
                                ),
                            beginTest(testId)
                        )
                        .then(
                            finishTest(testId, projectTestsOutputDirectory + inputBasename + '.out', testVal.outputPath),
                            testError(testId)
                        );
                })
            );
            setExecutionState({ state: ExecutionState.Finished, details: '' });
        } catch (err) {
            console.log(err);
        }
    };
};
