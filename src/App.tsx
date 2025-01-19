import { useEffect, useState } from 'react'
import '@mantine/core/styles.css';
import { Accordion, Button, Container, MantineProvider, Popover, SimpleGrid, Text } from '@mantine/core';
import classes from './App.module.css';
import { IconPlus } from '@tabler/icons-react';
import RoomSetup from './RoomSetup';
import React from 'react';
import SoulList from './SoulList';

import allSoulList from './enemylist.json';
import allRoomSetupsList from './roomSetupList.json';

localStorage.clear()

// TOOOOOOOOOOODOOOOOOOOOOOOOOOOO
// child/adult/scene props of each room setup shouldnt be stored in the 
// component state variable. 

const sceneList: string[] = [];
const roomSetupList: string[] = [];

const defaultTrackerState: { [key:string]: string[] }  = {};
for (const [name, details] of Object.entries(allRoomSetupsList)) {
  if (!details.scene) {
    defaultTrackerState[name] = []
    roomSetupList.push(name);
  } else {
    sceneList.push(name);
    for (const setupRoomName of details.rooms) {
      defaultTrackerState[setupRoomName] = [];
    }
  }
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

  // Handler to toggle an enemy to a setup
  const toggleEnemyInSetup = (roomSetupName: string, enemyName: string) => {
    const newTrackerState = { ...trackerState };
    if (newTrackerState[roomSetupName].includes(enemyName)) {
      const newArray = newTrackerState[roomSetupName].filter((n:string) => n !== enemyName);
      newTrackerState[roomSetupName] = newArray;
    } else {
      newTrackerState[roomSetupName] = [ ...newTrackerState[roomSetupName], enemyName].sort();
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
            {roomSetupList.map((roomSetupName, i) => (
              <RoomSetup
                key={i}
                roomSetupName={roomSetupName}
                enemyList={trackerState[roomSetupName]}
                toggleEnemyInSetup={(enemyName: string) => toggleEnemyInSetup(roomSetupName, enemyName)}
                foundSouls={foundSouls}
                allSoulList={allSoulList}
              />
            ))}
          </SimpleGrid>

          <Accordion multiple={true} chevronPosition='left' variant='contained'>
            {sceneList.map((sceneName) => (
              <Accordion.Item key={sceneName} value={sceneName}>
                <Accordion.Control>{sceneName}</Accordion.Control>
                {allRoomSetupsList[sceneName].rooms.map((roomName, i) => (
                  <Accordion.Panel key={i}>
                    <RoomSetup
                      roomSetupName={roomName}
                      enemyList={trackerState[roomName]}
                      toggleEnemyInSetup={(enemyName: string) => toggleEnemyInSetup(roomName, enemyName)}
                      foundSouls={foundSouls}
                      allSoulList={allSoulList}
                    />
                  </Accordion.Panel>
                ))}
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </main>

    </MantineProvider>
  )
}

export default App
