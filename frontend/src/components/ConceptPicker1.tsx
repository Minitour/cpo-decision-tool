import { Checkbox, createStyles, Grid, List, ListItem, ListItemIcon, ListItemText, makeStyles, Paper, TextField, Theme } from '@material-ui/core';
import React, { useState } from 'react'
import Concept from '../models/Concept';


const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
    }),
);

function ConceptItem(props: any) {
    const concept: Concept = props.concept;
    const checked: boolean = props.checked;
    const labelId: string = `checkbox-list-label-${concept.id}`;
    const onToggle = props.onToggle;
    const onEnter = props.onEnter;
    const onLeave = props.onLeave;

    return (
        <ListItem key={concept.id} role={undefined} dense button
            onClick={() => { onToggle?.(concept) }}
            onMouseEnter={() => { onEnter?.(concept) }}
            onMouseLeave={() => { onLeave?.(concept) }}
        >
            <ListItemIcon>
                <Checkbox
                    edge="start"
                    checked={checked}
                    tabIndex={-1}
                    disableRipple
                    inputProps={{ 'aria-labelledby': labelId }}
                />
            </ListItemIcon>
            <ListItemText id={labelId} primary={concept.display} />
        </ListItem>
    )
}

function ConceptList(props: any) {
    const searchTerm: string = props.searchTerm;
    const concepts: Array<Concept> = props.concepts;
    const handleToggle = props.handleToggle;
    const updateConcept = props.updateConcept;
    const checked = props.checked;
    console.log("ConceptList render")
    return (
        <List>
            {concepts.filter(concept => {

                if (searchTerm === "") {
                    return true;
                } else {
                    return concept.display.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        concept.description.toLowerCase().includes(searchTerm.toLowerCase())
                }

            }).map((concept: Concept) => {
                return (
                    <ConceptItem key={concept.id} concept={concept}
                        checked={checked.has(concept.id)}
                        onToggle={(concept: Concept) => handleToggle(concept.id)()}
                    // onEnter={(concept: Concept) => { console.log(`on enter ${concept.id}`) }}
                    // onLeave={(concept: Concept) => { console.log(`on leave ${concept.id}`) }}
                    ></ConceptItem>
                )
            })}
        </List>
    )
}


export default function ConceptPicker(props: any) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState(new Set<string>());
    const [conceptDescription, setConceptDescription] = React.useState("");
    const [searchTerm, setSearchTerm] = React.useState("");
    const concepts: Array<Concept> = props.concepts;

    const updateConcept = (description: string) => () => {
        setConceptDescription(description);
    };

    // A function that constructs a function.
    const handleToggle = (key: string) => () => {
        if (checked.has(key)) { checked.delete(key); } else { checked.add(key); }
        let newSet = (oldSet: Set<string>) => { let set = new Set<string>(); oldSet.forEach(x => set.add(x)); return set; }
        setChecked(newSet(checked));
    };

    return (
        <div className={classes.root}>
            <Grid container spacing={2}>
                <Grid item xs={9}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                onChange={(event) => { setSearchTerm(event.target.value); }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Paper style={{ maxHeight: 200, overflow: 'auto' }}>
                                <ConceptList
                                    concepts={concepts}
                                    searchTerm={searchTerm}
                                    checked={checked}
                                    handleToggle={handleToggle}
                                    updateConcept={updateConcept}
                                ></ConceptList>
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={3}>
                    <Paper elevation={3}>
                        {conceptDescription}
                    </Paper>
                </Grid>
            </Grid>
        </div>
    );
}
