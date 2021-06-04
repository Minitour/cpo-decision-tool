import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'
// import ConceptPicker from './components/ConceptPicker'
import { AppBar, Button, createStyles, IconButton, makeStyles, Theme, Toolbar, Typography } from '@material-ui/core'
import Concept from './models/Concept'
import axios from 'axios'
import { BASE_URL, PROTOCOL } from './constants'
import ConceptPicker from './components/ConceptPicker'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);

function getSignsAndSymptoms(): Promise<Concept[]> {
  return axios.get(`${PROTOCOL}://${BASE_URL}/api/symptoms`)
    .then(res => { return res.data; });
}


function App() {
  const [_concepts, _setConcepts] = useState(new Array<Concept>());
  const [concepts, setConcepts] = useState(new Array<Concept>());
  const classes = useStyles();

  if (_concepts.length == 0) {
    getSignsAndSymptoms().then(concepts => {
      _setConcepts(concepts);
      setConcepts(concepts);
    });
  }

  const searchTerm = (term: string) => {
    console.log(term);
    setConcepts(
      _concepts.filter(concept => {
        if (term === "") {
          return true;
        } else {
          return concept.display.toLowerCase().includes(term.toLowerCase()) ||
            concept.description.toLowerCase().includes(term.toLowerCase())
        }
      })
    )
  }

  return (
    <div className="App">
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            {/* <MenuIcon /> */}
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            News
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      
      <ConceptPicker onTextChange={searchTerm} concepts={concepts}></ConceptPicker>
      
    </div>
  )
}

export default App
