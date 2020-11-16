import React, { useState, useRef } from 'react';
import {
    Table,
    TableBody,
    TableHead,
    TableRow,
    TableCell,
    TableFooter,
    TablePagination,
    useTheme,
    IconButton,
    Select,
    TextField,
    InputAdornment,
    Tooltip,
    MenuItem,
} from '@material-ui/core';
import { useKillTest } from 'backend/testManagement';
import { Close, FilterList, BugReport, Assessment } from '@material-ui/icons';
import { useAllTasksState, useConfig } from 'reduxState/selectors';
import { TaskState } from 'reduxState/models';
import { useTaskStatesActions, useConfigActions } from 'reduxState/actions';
import { TabNode } from 'flexlayout-react';

interface Props {
    node: TabNode;
}

const Tasks = ({ node }: Props) => {
    const theme = useTheme();

    const killTest = useKillTest();
    const { selectLayout } = useConfigActions();

    const taskData = useAllTasksState().current;
    const { setCurrentTaskId } = useTaskStatesActions();

    const testConfig = useConfig().tests;

    const [filters, setFilters] = useState({ state: [] as string[], name: '', executionTime: '' });
    let taskStates = taskData;
    if (filters.state.length > 0) taskStates = taskStates.filter((val) => filters.state.includes(TaskState[val.state]));
    //if (filters.name.length > 0) taskStates = taskStates.filter((val, index) => testConfig[index].name.includes(filters.name));
    if (filters.executionTime.length > 0)
        taskStates = taskStates.filter((val) => val.executionTime.includes(filters.executionTime));

    const tableRef = useRef<null | HTMLTableElement>(null);
    const [page, setPage] = useState(0);
    const pageHeight = node.getRect().height - 56 - 68 - 53 - 1;
    const rowsPerPage = Math.floor(pageHeight / 53);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, taskStates.length - page * rowsPerPage);

    const debugTask = (id: number) => {
        setCurrentTaskId(id);
        selectLayout('debugging');
    };

    const viewTaskOutput = (id: number) => {
        setCurrentTaskId(id);
        selectLayout('outputs');
    };

    const handleFilterChange = (
        event: React.ChangeEvent<
            | HTMLTextAreaElement
            | {
                  name?: string | undefined;
                  value: unknown;
              }
        >
    ) => {
        const name = event.target.name || 'err';
        event.persist();
        setFilters((prev) => ({ ...prev, [name]: event.target.value }));
    };

    const generateAdornments = (filter: string | string[], clearFilter: () => void) => ({
        startAdornment: (
            <InputAdornment position="start">
                <Tooltip title="Filter" placement="bottom" arrow>
                    <FilterList />
                </Tooltip>
            </InputAdornment>
        ),
        endAdornment: filter.length !== 0 && (
            <InputAdornment position="end">
                <Tooltip title="Clear" placement="bottom" arrow>
                    <IconButton onClick={clearFilter}>
                        <Close />
                    </IconButton>
                </Tooltip>
            </InputAdornment>
        ),
    });

    return (
        <Table ref={tableRef}>
            <TableHead>
                <TableRow>
                    <TableCell>State</TableCell>
                    <TableCell>Name</TableCell>
                    <TableCell>Execution Time</TableCell>
                    <TableCell>Actions</TableCell>
                </TableRow>
                <TableRow>
                    <TableCell>
                        <Select
                            fullWidth
                            color="secondary"
                            multiple
                            name="state"
                            value={filters.state}
                            onChange={handleFilterChange}
                            {...generateAdornments(filters.state, () => setFilters((prev) => ({ ...prev, state: [] })))}
                        >
                            {[
                                TaskState.Successful,
                                TaskState.Timeout,
                                TaskState.WrongAnswer,
                                TaskState.Crashed,
                                TaskState.Killed,
                                TaskState.Running,
                                TaskState.Pending,
                            ].map((val) => (
                                <MenuItem value={TaskState[val]} key={val}>
                                    {TaskState[val]}
                                </MenuItem>
                            ))}
                        </Select>
                    </TableCell>
                    <TableCell>
                        <TextField
                            fullWidth
                            color="secondary"
                            name="name"
                            value={filters.name}
                            onChange={handleFilterChange}
                            InputProps={generateAdornments(filters.name, () => setFilters((prev) => ({ ...prev, name: '' })))}
                        />
                    </TableCell>
                    <TableCell>
                        <TextField
                            fullWidth
                            color="secondary"
                            name="executionTime"
                            value={filters.executionTime}
                            onChange={handleFilterChange}
                            InputProps={generateAdornments(filters.executionTime, () =>
                                setFilters((prev) => ({ ...prev, executionTime: '' }))
                            )}
                        />
                    </TableCell>
                    <TableCell></TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {taskStates.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(({ state, executionTime }, id) => (
                    <TableRow key={`Tasks-TableRow-${id}`}>
                        <TableCell
                            style={{
                                backgroundColor: theme.palette.taskState[state],
                                color: theme.palette.getContrastText(theme.palette.taskState[state]),
                            }}
                        >
                            {TaskState[state]}
                        </TableCell>
                        <TableCell>{/*testConfig[id] && testConfig[id].name*/}</TableCell>
                        <TableCell>{executionTime}</TableCell>
                        <TableCell style={{ paddingTop: 8, paddingBottom: 8 }}>
                            {state === TaskState.Running && (
                                <Tooltip title="Kill" placement="bottom" arrow>
                                    <IconButton style={{ padding: 6 }} onClick={killTest(id)}>
                                        <Close fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            )}
                            {state !== TaskState.Pending && state !== TaskState.Running && (
                                <>
                                    <Tooltip title="View output" placement="bottom" arrow>
                                        <IconButton style={{ padding: 6 }} onClick={() => viewTaskOutput(id)}>
                                            <Assessment fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Debug" placement="bottom" arrow>
                                        <IconButton style={{ padding: 6 }} onClick={() => debugTask(id)}>
                                            <BugReport fontSize="small" />
                                        </IconButton>
                                    </Tooltip>
                                </>
                            )}
                        </TableCell>
                    </TableRow>
                ))}
                <TableRow style={{ height: emptyRows * 53 + (pageHeight % 53) }}>
                    <TableCell style={{ padding: 0 }} colSpan={3} />
                </TableRow>
            </TableBody>
            <TableFooter>
                <TableRow>
                    <TablePagination
                        colSpan={4}
                        count={taskStates.length}
                        rowsPerPage={rowsPerPage}
                        rowsPerPageOptions={[]}
                        page={page}
                        onChangePage={(event, newPage) => setPage(newPage)}
                    />
                </TableRow>
            </TableFooter>
        </Table>
    );
};

export default Tasks;
