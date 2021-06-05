import { Button, IconButton } from '@chakra-ui/button';
import { Table, Tbody, Td, Tfoot, Th, Thead, Tr } from '@chakra-ui/table'
import React, { useState } from 'react'
import Condition from '../models/Condition'
import { FaHeartbeat } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { useDisclosure } from '@chakra-ui/hooks';
import { Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/modal';
import Concept from '../models/Concept';
import { AiFillCheckCircle, AiFillCloseCircle, AiFillWarning } from "react-icons/ai";
import { Tooltip } from "@chakra-ui/react"
import { Box, Container, HStack, VStack, WrapItem } from '@chakra-ui/layout';

function getInformation(condition: any, signsAndSymptoms: Set<string>, interventions: Set<string>, mode: number): Array<any> {
    console.log(condition);
    if (condition === undefined) {
        return []
    }

    if (mode == 1) {
        return condition.signsAndSymptoms.map((x: Concept) => { return { concept: x, isConfirmed: signsAndSymptoms.has(x.id) } });
    }
    if (mode == 2) {
        return condition.interventions.map((x: Concept) => { return { concept: x, isConfirmed: interventions.has(x.id) } });
    }
    return []
}

function getModalTitle(mode: number): string {
    if (mode == 1) {
        return "Symptoms";
    }
    if (mode == 2) {
        return "Interventions";
    }
    return ""
}

function getIndicationIconForSymptoms(confirmed: boolean) {
    if (confirmed) {
        return (
            <VStack textAlign='center' >
                <AiFillCheckCircle color="green" />
                <p>This symptom is confirmed.</p>
            </VStack>
        )
    } else {
        return (
            <VStack textAlign='center'>
                <AiFillWarning color="orange" />
                <p>This symptom is not confirmed.</p>
            </VStack>
        )
    }
}

function getIndicationIconForInterventions(confirmed: boolean) {
    if (confirmed) {
        return (
            <VStack textAlign='center' >
                <AiFillCheckCircle color="green" />
                <p>This intervention is confirmed</p>
            </VStack>
        )
    } else {
        return (
            <VStack textAlign='center'>
                <AiFillCloseCircle color="red" />
                <p>This intervention not confirmed</p>
            </VStack>
        )
    }
}

export default function ConditionResult(props: any) {
    const conditions: Array<Condition> = props.conditions;
    const signsAndSymptoms: Set<string> = props.signsAndSymptoms;
    const interventions: Set<string> = props.interventions;
    const [modalMode, setModalMode] = useState(0)
    const [modalCondition, setModalCondition] = useState<any>();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const handleClick = () => {
        onOpen()
    }

    return (
        <>
            <Table size="sm">
                <Thead>
                    <Tr>
                        <Th>Condition</Th>
                        <Th>Description</Th>
                        <Th isNumeric>Percentage</Th>
                        <Th>Signs and Symptoms</Th>
                        <Th>Interventions</Th>
                    </Tr>
                </Thead>
                <Tbody>
                    {conditions.map((c: Condition) => {
                        return (
                            <Tr>
                                <Td><b>{c.concept.display}</b></Td>
                                <Td>{c.concept.description}</Td>
                                <Td isNumeric> {Math.round(c.percentage * 100) / 100}%</Td>
                                <Td style={{ textAlign: 'center' }}>
                                    <IconButton
                                        colorScheme="red"
                                        aria-label="signs and symptoms"
                                        icon={<FaHeartbeat />}
                                        onClick={() => {
                                            setModalCondition(c);
                                            setModalMode(1);
                                            handleClick();
                                        }}
                                    />
                                </Td>
                                <Td style={{ textAlign: 'center' }}>
                                    <IconButton
                                        colorScheme="purple"
                                        aria-label="interventions"
                                        icon={<GiMedicines />}
                                        onClick={() => {
                                            setModalCondition(c);
                                            setModalMode(2);
                                            handleClick();
                                        }}
                                    />
                                </Td>
                            </Tr>
                        )
                    })}
                </Tbody>
            </Table>
            <Modal onClose={onClose} size='4xl' isOpen={isOpen} scrollBehavior='inside'>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{getModalTitle(modalMode) + `for ${modalCondition.concept.display}`}</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Table size="sm">
                            <Thead>
                                <Tr>
                                    <Th>Name</Th>
                                    <Th>Description</Th>
                                    <Th>Confirmed</Th>
                                </Tr>
                            </Thead>
                            <Tbody>
                                {getInformation(modalCondition, signsAndSymptoms, interventions, modalMode).map((item) => {
                                    return (
                                        <Tr backgroundColor={item.isConfirmed ? 'green.100' : 'clear' }>
                                            <Td><b>{item.concept.display}</b></Td>
                                            <Td>{item.concept.description}</Td>
                                            <Td> {modalMode == 1 ? getIndicationIconForSymptoms(item.isConfirmed) : getIndicationIconForInterventions(item.isConfirmed)} </Td>
                                        </Tr>
                                    )
                                })}
                            </Tbody>
                        </Table>
                    </ModalBody>
                    <ModalFooter>
                        <Button onClick={onClose}>Close</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}
