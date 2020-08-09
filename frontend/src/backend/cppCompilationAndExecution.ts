import * as cppActions from './cppActions';
import PromiseQueue from '../utils/parallelPromiseQueue';
import { useBeginTest, useFinishTest, useTestError } from './testManagement';
import { ExecutionState } from 'reduxState/models';
import { useConfig } from 'reduxState/selectors';
import { useExecutionStateActions } from 'reduxState/actions';

export default () => {
    const config = useConfig();
    const { setExecutionState } = useExecutionStateActions();
    const beginTest = useBeginTest();
    const finishTest = useFinishTest();
    const testError = useTestError();

    return async () => {
        const filename = config.projectInfo.files[0];
        const tests = config.tests;
        try {
            setExecutionState({ state: ExecutionState.Compiling, details: '' });
            let hrstart = window.process.hrtime();
            const binaryName = await cppActions.compileCpp(filename).then(
                (result: string) => result,
                (stderr: any) => {
                    setExecutionState({ state: ExecutionState.CompilationError, details: stderr });
                    throw new Error();
                }
            );
            let hrend = window.process.hrtime(hrstart);
            setExecutionState({ state: ExecutionState.Running, details: `Took ${hrend[0]}s ${hrend[1] / 1000000}ms` });

            console.log('Running tests...');

            console.log('Found tests:', tests);
            const testPromises = new PromiseQueue(4);
            await Promise.all(
                tests.map(({ inputPath }, id) =>
                    testPromises
                        .enqueue(
                            () => cppActions.executeTest(binaryName, inputPath, inputPath + '.out', inputPath + '.err'),
                            beginTest(id)
                        )
                        .then(finishTest(id), testError(id))
                )
            );
            setExecutionState({ state: ExecutionState.Finished, details: '' });
        } catch (err) {}
    };
};
