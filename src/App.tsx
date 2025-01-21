import { useEffect, useState } from 'react'
import '@mantine/core/styles.css';
import { Accordion, Button, Container, MantineProvider, Popover, SimpleGrid, Text } from '@mantine/core';
import classes from './App.module.css';
import { IconPlus } from '@tabler/icons-react';
import RoomSetup from './RoomSetup';
import React from 'react';
import SoulList from './SoulList';
import { overworldSetups, dungeonSetups, defaultFoundSoulsString } from './defaultStates';

import allSoulList from './enemylist.json';



const AppTheming: React.FC = () => {
  return (
    <MantineProvider defaultColorScheme='dark'>
      <App/>
    </MantineProvider>
  );
};




const App: React.FC = () => {

  const [foundSouls, setFoundSouls] = useState(
    JSON.parse(localStorage.getItem('foundSouls') ?? defaultFoundSoulsString)
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



  // Handler for reset button
  const resetTracker = () => {
    localStorage.clear();
    window.location.reload();
  };


  // Save to localstorage
  useEffect(() =>
    localStorage.setItem('foundSouls', JSON.stringify(foundSouls)),
  [foundSouls]);

  return (
    <>
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
          <SimpleGrid
            cols={1}
            verticalSpacing='md'
            className={classes.grid}
          >
            {Object.keys(overworldSetups).map((roomSetupName, i) => (
              <RoomSetup
                key={i}
                roomSetupName={roomSetupName}
                foundSouls={foundSouls}
                allSoulList={allSoulList}
              />
            ))}
          </SimpleGrid>

          <Accordion multiple={true} chevronPosition='left' variant='contained'>
            {Object.keys(dungeonSetups).map((sceneName) => (
              <Accordion.Item key={sceneName} value={sceneName}>
                <Accordion.Control>
                  <Text
                    size="xl"
                    fw={700}
                    className={classes.roomSetupName}
                  >
                    {sceneName}
                  </Text>
                </Accordion.Control>
                {Object.keys(dungeonSetups[sceneName]).map((roomName, i) => (
                  <Accordion.Panel key={i}>
                    <RoomSetup
                      roomSetupName={roomName}
                      foundSouls={foundSouls}
                      allSoulList={allSoulList}
                      variant='secondary'
                      sceneName={sceneName}
                    />
                  </Accordion.Panel>
                ))}
              </Accordion.Item>
            ))}
          </Accordion>
        </Container>
      </main>
    </>
  )
}

export default AppTheming;