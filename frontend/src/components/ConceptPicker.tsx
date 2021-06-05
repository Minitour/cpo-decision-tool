import React, { useState } from 'react'
import SearchView from './SearchView'
import Concept from '../models/Concept'
import { List, ListItem, PopoverTrigger, PopoverContent, PopoverArrow, PopoverCloseButton, PopoverHeader, PopoverBody, Popover, IconButton, Flex, Box, Spacer, VStack, HStack, Container, UnorderedList } from "@chakra-ui/react"
import { Checkbox } from "@chakra-ui/react"
import { MdInfoOutline } from "react-icons/md";


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
        <HStack align="stretch" spacing={10}>
            <VStack align="stretch" w="100%">
                <Box h="100%">
                    <SearchView onTextChange={onTextChange}></SearchView>
                </Box>
                <Box>
                    <List style={{ height: '600px', overflowY: 'scroll' }}>
                        {
                            filteredConcepts.map((x: Concept) => {
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
                                            <Box p="4">
                                                <Popover trigger="hover" variant="responsive">
                                                    <PopoverTrigger >
                                                        <IconButton
                                                            variant="outline"
                                                            colorScheme="blue"
                                                            aria-label="Send email"
                                                            icon={<MdInfoOutline />}
                                                        />
                                                    </PopoverTrigger>
                                                    <PopoverContent>
                                                        <PopoverArrow />
                                                        <PopoverCloseButton />
                                                        <PopoverHeader>{x.display}</PopoverHeader>
                                                        <PopoverBody>{x.description}</PopoverBody>
                                                    </PopoverContent>
                                                </Popover>
                                            </Box>
                                        </Flex>
                                    </ListItem>
                                )
                            })
                        }
                    </List>

                </Box>
            </VStack>
            <Box>
                <h2> <b>Selected Concepts</b></h2>
                <br></br>
                <UnorderedList style={{ minWidth: '200px' }}>
                    {
                        _concepts
                            .filter((x: Concept) => selected.has(x.id))
                            .map((x: Concept) => <ListItem key={x.id} style={{ textAlign: 'left' }}>{x.display}</ListItem>)
                    }
                </UnorderedList>

            </Box>
        </HStack>

    )
}

export default React.memo(ConceptPicker, areEqual);