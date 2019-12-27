import React, { ReactElement } from 'react'
import Chip from '@material-ui/core/Chip'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import { grey, red, green, lightBlue, purple } from '@material-ui/core/colors';

interface Props {
    testName: string,
    state: string,
    stdin: string,
    stdout: string,
    executionTime: string,
    error: any,
    killTest: (testName: string) => void,
}

export default function ProgramTestComponent({ testName, state, stdin, stdout, executionTime, error, killTest }: Props): ReactElement {
    return (
        <ExpansionPanel>
            <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
            >
                <Typography 
                    style={{
                        flexBasis: '33.33%',
                        flexShrink: 0,
                    }}
                >
                    {testName}
                </Typography>
                <Typography> 
                    State: 
                </Typography>
                {(state === "pending") && <Chip label="Pending" style={{ backgroundColor: grey[300] }}/>}
                {(state === "running") && <Chip label="Running" style={{ backgroundColor: lightBlue[500] }}/>}
                {(state === "success") && <Chip label="Success" style={{ backgroundColor: green[500] }}/>}
                {(state === "killed" ) && <Chip label="Killed"  style={{ backgroundColor: purple[500], color: "white" }}/>}
                {(state === "crashed") && <Chip label="Crashed" style={{ backgroundColor: red[500], color: "white" }}/>}

                {(state === "running") && 
                    <Chip 
                        label="Kill" 
                        style={{ 
                            backgroundColor: purple[500], 
                            color: "white" 
                        }} 
                        onClick={(event) => { event.stopPropagation(); killTest(testName) }} 
                    />
                }
            </ExpansionPanelSummary>
            <ExpansionPanelDetails style={{ display: "block" }}>
                <Typography>
                    Input: {stdin}
                </Typography>
                <Typography>
                    Output: {stdout}
                </Typography>
                <Typography>
                    Execution time: {executionTime}
                </Typography>
                {(error) && <Typography>
                    {(error.code) && (<>Error code: {error.code}</>)}
                    {(error.signal) && (<>Error signal: {error.signal}</>)}
                    {(error.stderr) && (<>Stderr: {error.stderr}</>)}
                </Typography>}
            </ExpansionPanelDetails>
      </ExpansionPanel>
    )
}
