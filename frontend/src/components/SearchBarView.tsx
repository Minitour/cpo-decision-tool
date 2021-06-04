import { TextField } from '@material-ui/core';
import React, { useEffect, useState } from 'react'

export default function SearchBarView(props: any) {
    const [search, setSearch] = useState("")
    const [timer, setTimer] = useState(0)

    useEffect(() => {
        clearTimeout(timer)
        setTimer(setTimeout(async () => {
            props.onTextChange?.(search);
        }, 500))
    }, [search])

    const onTextChange = (e: any) => {
        setSearch(e.target.value);
    }
    return (
        <TextField
            id="outlined-full-width"
            label="Label"
            style={{ margin: 8 }}
            placeholder="Placeholder"
            helperText="Full width!"
            fullWidth
            margin="normal"
            InputLabelProps={{
                shrink: true,
            }}
            variant="outlined"
            onChange={onTextChange}
        />
    )
}
