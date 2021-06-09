import React, { useState } from 'react'
import SearchView from './SearchView'
import Concept from '../models/Concept'
import { List, ListItem, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Popover, IconButton, Flex, Box, Spacer, VStack, HStack, Container, UnorderedList } from "@chakra-ui/react"
import { Checkbox } from "@chakra-ui/react"
import { MdInfoOutline } from "react-icons/md";

function ConceptInfoPopover(props: any) {
    const concept = props.concept;
    return (
        <Box p="4">
            <Popover trigger="hover" variant="responsive" >

                <PopoverTrigger >
                    <IconButton
                        variant="outline"
                        colorScheme="blue"
                        aria-label="Concept"
                        icon={<MdInfoOutline />}
                    />
                </PopoverTrigger>
                <PopoverContent>
                    <PopoverArrow />
                    <PopoverCloseButton />
                    <PopoverHeader>{concept.display}</PopoverHeader>
                    <PopoverBody> {concept.description}</PopoverBody>
                </PopoverContent>
            </Popover>
        </Box>
    )
}

function ConceptListPicker(props: any) {
    const concepts = props.concepts;
    const selected = props.selected;
    const onCheck = props.onCheck;
    return (
        <List height="100%" overflowY="scroll">
            {
                concepts.map((x: Concept) => {
                    return (
                        <ListItem key={x.id} >
                            <Flex>
                                <Box p="4">
                                    <Checkbox
                                        isChecked={selected.has(x.id)}
                                        onChange={e => onCheck(x.id)}>
                                        {x.display}
                                    </Checkbox>
                                </Box>
                                <Spacer />
                                <ConceptInfoPopover concept={x} />
                            </Flex>
                        </ListItem>
                    )
                })
            }
        </List>
    )
}

function SelectedConcepts(props: any) {
    const concepts = props.concepts;
    return (
        <Box h="100%">
            <h2> <b>Selected Concepts</b></h2>
            <br></br>
            <UnorderedList style={{ minWidth: '300px', overflowY: "auto", height: '100%' }}>
                {
                    concepts.map((x: Concept) => <ListItem key={x.id} style={{ textAlign: 'left' }}>{x.display}</ListItem>)
                }
            </UnorderedList>
        </Box>
    )
}

function areEqual(prevProps: any, nextProps: any): boolean {
    /*
    return true if passing nextProps to render would return
    the same result as passing prevProps to render,
    otherwise return false
    */
    return prevProps.concepts.length == nextProps.concepts.length && prevProps.didSelectionChange == nextProps.didSelectionChange;
}

function ConceptPicker(props: any) {

    if (props.concepts.length == 0) {
        return <div></div>
    }
    const [selected, setSelected] = useState(new Set<string>());
    const [_concepts, _setConcepts] = useState(props.concepts);
    const [filteredConcepts, setFilteredConcepts] = useState(props.concepts);
    const didSelectionChange = props.didSelectionChange;

    const onTextChange = (term: string) => {
        setFilteredConcepts(
            _concepts.filter(
                (concept: Concept) => {
                    if (term === "") {
                        return true;
                    } else {
                        return concept.display.toLowerCase().includes(term.toLowerCase()) ||
                            concept.description.toLowerCase().includes(term.toLowerCase())
                    }
                }
            )
        )
    }
    const onCheck = (key: string) => {
        if (selected.has(key)) {
            selected.delete(key);
        } else {
            selected.add(key);
        }
        setSelected(new Set<string>(selected));
        didSelectionChange(selected);
    }
    return (
        <HStack align="stretch" spacing={10} height="600px" marginBottom="10" marginLeft="5" marginRight="5">
            <VStack align="stretch" w="100%" h="100%">
                <Box>
                    <SearchView onTextChange={onTextChange}></SearchView>
                </Box>
                <Box h="100%">
                    <ConceptListPicker concepts={filteredConcepts} selected={selected} onCheck={onCheck} />
                </Box>
            </VStack>
            <Box h="100%">
                <SelectedConcepts concepts={_concepts.filter((x: Concept) => selected.has(x.id))} />
            </Box>

        </HStack>

    )
}

export default React.memo(ConceptPicker, areEqual);