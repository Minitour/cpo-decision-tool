import React, { useState } from 'react'
import ConceptListPicker from './ConceptListPicker';
import SearchBarView from './SearchBarView'

export default function ConceptPicker(props: any) {
    const concepts = props.concepts;
    const onTextChange = props.onTextChange;
    const [description, setDescription] = useState("");

    // Search Bar
    // List Picker
    // List item
    // Description View
    return (
        <div>
            <SearchBarView onTextChange={onTextChange}></SearchBarView>
            <div>{description}</div>
            {/* {concepts.map(x => <div>{x.display}</div>)} */}
            <ConceptListPicker concepts={concepts} setDescription={setDescription}></ConceptListPicker>

        </div>
    )
}
