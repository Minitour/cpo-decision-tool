import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
import axios from 'axios';
import Concept from './models/Concept';
import ConceptPicker from './components/ConceptPicker';
import { Accordion, AccordionButton, AccordionIcon, AccordionItem, AccordionPanel } from '@chakra-ui/accordion';
import { Box, Container } from '@chakra-ui/layout';

function getSignsAndSymptoms(): Promise<Concept[]> {
  return axios
    .get(`https://case-profile-ontology.herokuapp.com/api/symptoms`)
    .then(res => { return res.data; });
}


function App() {
  const [count, setCount] = useState(0);
  const [signsAndSymptoms, setSignsAndSymptoms] = useState(new Array<Concept>());

  getSignsAndSymptoms().then((concepts) => {
    if (signsAndSymptoms.length == 0) {
      setSignsAndSymptoms(concepts);
    };
  })

  return (
    <div className="App">
      {/* {signsAndSymptoms.map((x: Concept) => <div>{x.id}</div>)} */}
      <Accordion>
        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 1 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            <Container style={{maxWidth: '60%'}}>
              <ConceptPicker concepts={signsAndSymptoms} ></ConceptPicker>
            </Container>


          </AccordionPanel>
        </AccordionItem>

        <AccordionItem>
          <h2>
            <AccordionButton>
              <Box flex="1" textAlign="left">
                Section 2 title
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={4}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
            commodo consequat.
           </AccordionPanel>
        </AccordionItem>
      </Accordion>

      {/* {signsAndSymptoms.map(x => <div>{x.id}</div>)} */}
    </div>
  )
}

export default App
