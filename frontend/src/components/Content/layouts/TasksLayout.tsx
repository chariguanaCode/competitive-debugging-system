import React, { useState, useEffect, useRef } from 'react';
import { useContextSelector } from 'use-context-selector';
import GlobalStateContext, { TaskState, Views } from '../../../utils/GlobalStateContext';
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
import { useKillTest } from '../../../backend/testManagement';
import { Close, FilterList, BugReport, Assessment } from '@material-ui/icons';

const TasksLayout = () => {
    const theme = useTheme();

    const killTest = useKillTest();

    const taskData = Object.entries(useContextSelector(GlobalStateContext, (v) => v.taskStates).current);
    const shouldTasksReload = useContextSelector(GlobalStateContext, (v) => v.shouldTasksReload);
    const setCurrentTaskId = useContextSelector(GlobalStateContext, (v) => v.setCurrentTaskId);
    const setView = useContextSelector(GlobalStateContext, (v) => v.setView);

    const [filters, setFilters] = useState({ state: [] as string[], id: '', executionTime: '' });

    let taskStates = taskData;
    if (filters.state.length > 0) taskStates = taskStates.filter((val) => filters.state.includes(TaskState[val[1].state]));

    if (filters.id.length > 0) taskStates = taskStates.filter((val) => val[0].includes(filters.id));

    if (filters.executionTime.length > 0)
        taskStates = taskStates.filter((val) => val[1].executionTime.includes(filters.executionTime));

    const tableRef = useRef<null | HTMLTableElement>(null);
    const [page, setPage] = useState(0);
    const [pageHeight, setPageHeight] = useState(0);
    const rowsPerPage = Math.floor(pageHeight / 53);

    const emptyRows = rowsPerPage - Math.min(rowsPerPage, taskStates.length - page * rowsPerPage);

    useEffect(() => {
        if (!tableRef.current || !tableRef.current.parentElement) return () => {};

        const handleResize = () => {
            if (!tableRef.current || !tableRef.current.parentElement) return;

            const height = tableRef.current.parentElement.offsetHeight;

            setPageHeight(height - 56 - 65 - 53 - 16);
            console.log(height);
        };

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            if (!tableRef.current || !tableRef.current.parentElement) return;

            window.removeEventListener('resize', handleResize);
        };
    }, [tableRef.current]);

    const debugTask = (id: string) => {
        setCurrentTaskId(id);
        setView(Views.Debugging);
    };

    const viewTaskOutput = (id: string) => {
        setCurrentTaskId(id);
        setView(Views.Outputs);
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
                    <TableCell>ID</TableCell>
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
                            name="id"
                            value={filters.id}
                            onChange={handleFilterChange}
                            InputProps={generateAdornments(filters.id, () => setFilters((prev) => ({ ...prev, id: '' })))}
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
                {taskStates.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map(([id, { state, executionTime }]) => (
                    <TableRow>
                        <TableCell
                            style={{
                                backgroundColor: theme.palette.taskState[state],
                                color: theme.palette.getContrastText(theme.palette.taskState[state]),
                            }}
                        >
                            {TaskState[state]}
                        </TableCell>
                        <TableCell>{id}</TableCell>
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

export default TasksLayout;
