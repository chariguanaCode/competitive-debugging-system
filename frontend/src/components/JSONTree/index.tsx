import React, { ReactElement } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import TreeNode from './TreeNode'

const useStyles = makeStyles({
    container: {
        width: "100%"
    }
})

interface Props {
    data: any
}

export default function JSONTree({ data }: Props): ReactElement {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            {Object.entries(data).map(([ id, val ]) => (
                <TreeNode 
                    key={id} 
                    data={val} 
                />
            ))}
        </div>
    )
}
