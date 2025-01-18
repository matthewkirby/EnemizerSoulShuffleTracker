import { useState } from 'react'
import '@mantine/core/styles.css';
import { Button, Container, MantineProvider, Popover, SimpleGrid, Text } from '@mantine/core';
import classes from './App.module.css';
import { IconPlus } from '@tabler/icons-react';
import Scene from './Scene';
import React from 'react';
import SoulList from './SoulList';

// Some temporary data to build the app, import full data from json later.
const sceneList = ["Shadow Trial", "Spirit Trial", "Forest Trial", "Light Trial"];
const allSoulList = ["Stalfos", "Deku Baba", "Shabomb", "Tailsparan", "Gohma Larvae"];


const defaultTrackerState: { [key:string]: string[] }  = {};
for (const scene of sceneList) {
  defaultTrackerState[scene] = []
};


// Some more temp data
defaultTrackerState["Shadow Trial"] = ["Stalfos"];
defaultTrackerState["Spirit Trial"] = ["Shabomb"];
defaultTrackerState["Forest Trial"] = []
defaultTrackerState["Light Trial"] = ["Tailsparan", "Shabomb", "Stalfos"]




const App: React.FC = () => {

  const [foundSouls, setFoundSouls] = useState(["Shabomb"]);
  const [trackerState, setTrackerState] = useState(defaultTrackerState);

  // Handler to mark that a new soul item has been collected.
  const toggleFoundSoul = (soulName: string) => {
    if (foundSouls.includes(soulName)) {
      const newArray = foundSouls.filter(n => n!==soulName);
      setFoundSouls(newArray);
    } else {
      setFoundSouls([...foundSouls, soulName]);
    }
  };

  // Handler to toggle an enemy to a scene
  const toggleEnemyInScene = (scene: string, enemyName: string) => {
    const newTrackerState = { ...trackerState };
    if (newTrackerState[scene].includes(enemyName)) {
      const newArray = newTrackerState[scene].filter(n => n!==enemyName);
      newTrackerState[scene] = newArray;
    } else {
      newTrackerState[scene] = [ ...newTrackerState[scene], enemyName];
    }
    setTrackerState(newTrackerState);
  };


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
          <Button variant='light' color='red'>Reset</Button>
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
