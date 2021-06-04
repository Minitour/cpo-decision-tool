import { Checkbox, List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core';
import React, { useEffect } from 'react'
import Concept from '../models/Concept';

function ConceptItem(props: any) {
    const [concept, setConcept] = React.useState(props.concept);
    const checked: boolean = false;
    const labelId: string = `checkbox-list-label-${concept.id}`;
    const onToggle = props.onToggle;
    const setDescription = props.setDescription;



    return (
        <ListItem key={concept.id} role={undefined} dense button
            onClick={() => { onToggle?.(concept) }}
            onMouseEnter={() => { setDescription?.(concept.description) }}
            onMouseLeave={() => { setDescription?.("") }}
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

export default function ConceptListPicker(props: any) {
    // const concepts = props.concepts;
    const [checked, setChecked] = React.useState(new Set<string>());
    const setDescription = props.setDescription;

    // const didCheckChange = (concept: Concept) => {
    //     if (concept.)
    //         setChecked(
    //             new Set()
    //         )
    // }

    return (
        <List>
            {props.concepts.map((concept: Concept) => {
                return (
                    <ConceptItem
                        key={concept.id}
                        concept={concept}
                        checked={checked.has(concept.id)}
                        // onToggle={(concept: Concept) => handleToggle(concept.id)()
                        setDescription={setDescription}
                    >
                    </ConceptItem>
                )
            })}
        </List>
    )
}
