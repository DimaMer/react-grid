import React from 'react'

import CssBaseline from '@material-ui/core/CssBaseline'
import My1 from './components/My1'
import GridMain from './gridMain'
// import My from './components/My'
import styled from "styled-components";
import matchSorter from 'match-sorter'
import { BrowserRouter as Router, Switch, Route, Redirect, Link } from 'react-router-dom';
import {Tab, TabList, TabPanel, Tabs} from "react-tabs";
import My from "./components/My";


const App = () => {

  return (
    <div>

        <Router>
            <Tabs >
                <TabList>
                    <Tab>Title 1</Tab>
                    <Tab>Title 2</Tab>
                    <Tab>Title 3</Tab>
                </TabList>
                <TabPanel>
                    <GridMain/>
                </TabPanel>
                <TabPanel>
                    <My1/>
                </TabPanel>
                <TabPanel>
                    <My/>
                </TabPanel>
            </Tabs>
        </Router>
    </div>
  )
}

export default App
