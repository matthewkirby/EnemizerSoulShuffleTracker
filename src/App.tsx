import { useEffect, useState } from 'react'
import '@mantine/core/styles.css';
import { Button, Container, MantineProvider, Popover, SimpleGrid, Text } from '@mantine/core';
import classes from './App.module.css';
import { IconPlus } from '@tabler/icons-react';
import Scene from './Scene';
import React from 'react';
import SoulList from './SoulList';

import allSoulList from './enemylist.json';


// Some temporary data to build the app, import full data from json later.
const sceneList = ["Shadow Trial", "Spirit Trial", "Forest Trial", "Light Trial"];


const defaultTrackerState: { [key:string]: string[] }  = {};
for (const scene of sceneList) {
  defaultTrackerState[scene] = []
};


// Some more temp data
defaultTrackerState["Shadow Trial"] = ["Stalfos"];
defaultTrackerState["Spirit Trial"] = ["Shabom"];
defaultTrackerState["Forest Trial"] = []
defaultTrackerState["Light Trial"] = ["Tailpasaran", "Shabom", "Stalfos"]

const defaultFoundSoulsString = JSON.stringify([]);
const defaultTrackerStateString = JSON.stringify(defaultTrackerState);



const App: React.FC = () => {

  const [foundSouls, setFoundSouls] = useState(
    JSON.parse(localStorage.getItem('foundSouls') ?? defaultFoundSoulsString)
  );
  const [trackerState, setTrackerState] = useState(
    JSON.parse(localStorage.getItem('trackerState') ?? defaultTrackerStateString)
  );

  // Handler to mark that a new soul item has been collected.
  const toggleFoundSoul = (soulName: string) => {
    if (foundSouls.includes(soulName)) {
      const newArray = foundSouls.filter((n:string) => n!==soulName);
      setFoundSouls(newArray);
    } else {
      setFoundSouls([...foundSouls, soulName]);
    }
  };

  // Handler to toggle an enemy to a scene
  const toggleEnemyInScene = (scene: string, enemyName: string) => {
    const newTrackerState = { ...trackerState };
    if (newTrackerState[scene].includes(enemyName)) {
      const newArray = newTrackerState[scene].filter((n:string) => n !== enemyName);
      newTrackerState[scene] = newArray;
    } else {
      newTrackerState[scene] = [ ...newTrackerState[scene], enemyName].sort();
    }
    setTrackerState(newTrackerState);
  };

  // Handler for reset button
  const resetTracker = () => {
    setFoundSouls(JSON.parse(defaultFoundSoulsString));
    setTrackerState(JSON.parse(defaultTrackerStateString));
    localStorage.clear();
  }


  // Save to localstorage
  useEffect(() => localStorage.setItem('foundSouls', JSON.stringify(foundSouls)), [foundSouls]);
  useEffect(() => localStorage.setItem('trackerState', JSON.stringify(trackerState)), [trackerState]);


  return (
    <MantineProvider defaultColorScheme='dark'>

      <header className={classes.header}>
        <Container fluid className={classes.inner}>
          <Popover
            width='75%'
            offset={15}
            withOverlay
            overlayProps={{blur: '8px'}}
          >
            <Popover.Target>
              <Button variant='filled' leftSection={<IconPlus stroke={3}/>}>My Enemy Souls</Button>
            </Popover.Target>
            <Popover.Dropdown>
              <SoulList
                title="The Souls I Have"
                allSoulList={allSoulList}
                highlightSouls={foundSouls}
                onChildClick={toggleFoundSoul}
              />
            </Popover.Dropdown>
          </Popover>
          <Text>Search Bar</Text>
          <Button variant='light' color='red' onClick={() => resetTracker()}>Reset</Button>
        </Container>
      </header>

      <main>
        <Container fluid>
          <SimpleGrid cols={1} verticalSpacing={0}>
            {sceneList.map((sceneName, i) => (
              <Scene
                key={i}
                sceneName={sceneName}
                enemyList={trackerState[sceneName]}
                toggleEnemyInScene={(enemyName: string) => toggleEnemyInScene(sceneName, enemyName)}
                foundSouls={foundSouls}
                allSoulList={allSoulList}
              />
            ))}
          </SimpleGrid>
        </Container>
      </main>

    </MantineProvider>
  )
}

export default App
