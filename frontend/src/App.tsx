import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios';
import Concept from './models/Concept';
import ConceptPicker from './components/ConceptPicker';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';
import { Box, Container, Divider, HStack, SimpleGrid, VStack } from '@chakra-ui/layout';
import Condition from './models/Condition';
import ConditionResult from './components/ConditionResult';
import { Button } from '@chakra-ui/button';
import { Spinner } from '@chakra-ui/spinner';
import Card from './components/Card';

function getSignsAndSymptoms(): Promise<Concept[]> {
  return axios
    .get(`https://case-profile-ontology.herokuapp.com/api/symptoms`)
    .then(res => { return res.data; });
}

function getInterventions(): Promise<Concept[]> {
  return axios
    .get(`https://case-profile-ontology.herokuapp.com/api/interventions`)
    .then(res => { return res.data; });
}

function inferConditions(symptoms: Array<string>, interventions: Array<string>): Promise<Condition[]> {
  return axios
    .post(`https://case-profile-ontology.herokuapp.com/api/conditions/infer`,
      { symptoms: symptoms, interventions: interventions })
    .then(res => { return res.data; });
}

function App() {
  const [count, setCount] = useState(0);
  const [inferLoader, setInferLoader] = useState(false);
  const [signsAndSymptoms, setSignsAndSymptoms] = useState(new Array<Concept>());
  const [interventions, setInterventions] = useState(new Array<Concept>());
  const [chosenConcepts, setChosenConcepts] = useState([new Set<string>(), new Set<string>()]);
  const [inferedConditions, setInferedConditions] = useState(new Array<Condition>());

  if (signsAndSymptoms.length == 0) {
    getSignsAndSymptoms().then((concepts) => {
      setSignsAndSymptoms(concepts);
    });
  };

  if (interventions.length == 0) {
    getInterventions().then((concepts) => {
      setInterventions(concepts);
    });
  };

  const didRequestConditionInfer = () => {
    let symptoms: string[] = [];
    let interventions: string[] = [];
    for (let x of chosenConcepts[0]) {
      symptoms.push(x);
      console.log(x);
    }
    for (let x of chosenConcepts[1]) {
      interventions.push(x);
      console.log(x);
    }
    setInferLoader(true);
    inferConditions(symptoms, interventions)
      .then(conditions => {
        setInferedConditions(conditions);
        setInferLoader(false);
      });
  }

  const mainView = (
    <Accordion overflow="hidden">
      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Signs and Symptoms
              </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4} style={{ display: 'block', overflowY: 'auto' }}>
          <ConceptPicker
            concepts={signsAndSymptoms}
            didSelectionChange={(selected: Set<string>) => { setChosenConcepts([selected, chosenConcepts[1]]); }}>
          </ConceptPicker>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              Interventions
              </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          <ConceptPicker
            concepts={interventions}
            didSelectionChange={(selected: Set<string>) => { setChosenConcepts([chosenConcepts[0], selected]) }}>
          </ConceptPicker>
        </AccordionPanel>
      </AccordionItem>

      <AccordionItem>
        <h2>
          <AccordionButton>
            <Box flex="1" textAlign="left">
              <b>Decision</b>
            </Box>
            <AccordionIcon />
          </AccordionButton>
        </h2>
        <AccordionPanel pb={4}>
          {
            inferLoader
              ? <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" margin="20" />
              : inferedConditions.length > 0
                ? <ConditionResult conditions={inferedConditions} signsAndSymptoms={chosenConcepts[0]} interventions={chosenConcepts[1]} />
                : <></>
          }
          <br></br>
          <Button colorScheme="blue" onClick={didRequestConditionInfer}> Find Possible Conditions </Button>
        </AccordionPanel>
      </AccordionItem>
    </Accordion>
  )

  return (
    <div className="App" style={{ textAlign: 'center' }}>
      <HStack align="center" justify="center" spacing="40" padding="5">
        <Card title="How to use?" description={
          <div style={{ textAlign: 'start' }}>
            1) Select the signs and symptoms
              <br />
              2) Select the interventions
              <br />
              3) Evaluate all possible conditions
          </div>
        } />

        <Card title="About"
          description={`This project is a recreation of the medical decision support tool introduced in the paper "An ontology-based personalization of health-care knowledge to support clinical decisions for chronically ill patients" by Riano et al.`}
          actionTitle="View Publication"
          actionLink="https://doi.org/10.1016/j.jbi.2011.12.008" />

        <Card title="Open Source"
          description="View the source code on GitHub!"
          actionTitle="View Repository"
          actionLink="https://github.com/Minitour/cpo-decision-tool" />
      </HStack>

      <Divider />
      {
        signsAndSymptoms.length > 0 && interventions.length > 0
          ? mainView
          : <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="blue.500" size="xl" margin="20" />
      }
    </div>
  )
}

export default App
