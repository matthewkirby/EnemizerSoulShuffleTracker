import { useEffect, useState } from 'react'
import '@mantine/core/styles.css';
import { Accordion, Button, Container, MantineProvider, Popover, SimpleGrid, Text } from '@mantine/core';
import classes from './App.module.css';
import { IconPlus } from '@tabler/icons-react';
import RoomSetup from './RoomSetup';
import React from 'react';
import SoulList from './SoulList';
import { defaultDungeonStateString, defaultFoundSoulsString, defaultOverworldStateString, DungeonStateType, OverworldStateType } from './defaultStates';

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

  
  const [overworldSpawnState, setOverworldSpawnState] = useState<OverworldStateType>(
    JSON.parse(localStorage.getItem('overworldSpawnState') ?? defaultOverworldStateString)
  );
  const [overworldClearState, setOverworldClearState] = useState<OverworldStateType>(
    JSON.parse(localStorage.getItem('overworldClearState') ?? defaultOverworldStateString)
  );


  const [dungeonSpawnState, setDungeonSpawnState] = useState<DungeonStateType>(
    JSON.parse(localStorage.getItem('dungeonSpawnState') ?? defaultDungeonStateString)
  );
  const [dungeonClearState, setDungeonClearState] = useState<DungeonStateType>(
    JSON.parse(localStorage.getItem('dungeonClearState') ?? defaultDungeonStateString)
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


  // Handler to toggle an enemy as spawned or cleared in an overworld room setup (overworldClearState)
  const toggleOverworldEnemy = (roomName: string, enemyName: string, which: "spawn"|"clear") => {
    const newOverworldState = which === "spawn" ? { ...overworldSpawnState } : { ...overworldClearState };
    const setOverworldState = which === "spawn" ? setOverworldSpawnState : setOverworldClearState;

    if (newOverworldState[roomName].includes(enemyName)) {
      const newArray = newOverworldState[roomName].filter((name:string) => name !== enemyName);
      newOverworldState[roomName] = newArray;
    } else {
      newOverworldState[roomName] = [ ...newOverworldState[roomName], enemyName ].sort();
    }
    setOverworldState(newOverworldState);
  };

  // Handler to toggle an enemy as spawned or cleared in a dungeon room setup (dungeonClearState)
  const toggleDungeonEnemy = (sceneName: string, roomName: string, enemyName: string, which: "spawn"|"clear") => {
    const newDungeonState = which === "spawn" ? { ...dungeonSpawnState } : { ...dungeonClearState };
    const newDungeonSubState = { ...newDungeonState[sceneName] };
    const setDungeonState = which === "spawn" ? setDungeonSpawnState : setDungeonClearState;

    if (newDungeonSubState[roomName].includes(enemyName)) {
      const newArray = newDungeonSubState[roomName].filter((name:string) => name !== enemyName);
      newDungeonSubState[roomName] = newArray;
    } else {
      newDungeonSubState[roomName] = [ ...newDungeonSubState[roomName], enemyName].sort();
    }
    newDungeonState[sceneName] = newDungeonSubState;
    setDungeonState(newDungeonState);
  };


  // Handler for reset button
  const resetTracker = () => {
    setFoundSouls(JSON.parse(defaultFoundSoulsString));
    setOverworldSpawnState(JSON.parse(defaultOverworldStateString));
    setOverworldClearState(JSON.parse(defaultOverworldStateString));
    setDungeonSpawnState(JSON.parse(defaultDungeonStateString));
    setDungeonClearState(JSON.parse(defaultDungeonStateString));
    localStorage.clear();
  };


  // Save to localstorage
  useEffect(() =>
    localStorage.setItem('foundSouls', JSON.stringify(foundSouls)),
  [foundSouls]);
  useEffect(() =>
    localStorage.setItem('overworldSpawnState', JSON.stringify(overworldSpawnState)),
  [overworldSpawnState]);
  useEffect(() =>
    localStorage.setItem('overworldClearState', JSON.stringify(overworldClearState)),
  [overworldClearState]);
  useEffect(() =>
    localStorage.setItem('dungeonSpawnState', JSON.stringify(dungeonSpawnState)),
  [dungeonSpawnState]);
  useEffect(() =>
    localStorage.setItem('dungeonClearState', JSON.stringify(dungeonClearState)),
  [dungeonClearState]);

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
            {Object.keys(overworldSpawnState).map((roomSetupName, i) => (
              <RoomSetup
                key={i}
                roomSetupName={roomSetupName}
                spawnList={overworldSpawnState[roomSetupName]}
                clearedList={overworldClearState[roomSetupName]}
                toggleEnemy={
                  (enemyName: string, which: "spawn"|"clear") => toggleOverworldEnemy(roomSetupName, enemyName, which)}
                foundSouls={foundSouls}
                allSoulList={allSoulList}
              />
            ))}
          </SimpleGrid>

          <Accordion multiple={true} chevronPosition='left' variant='contained'>
            {Object.keys(dungeonSpawnState).map((sceneName) => (
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
                {Object.keys(dungeonSpawnState[sceneName]).map((roomName, i) => (
                  <Accordion.Panel key={i}>
                    <RoomSetup
                      roomSetupName={roomName}
                      spawnList={dungeonSpawnState[sceneName][roomName]}
                      clearedList={dungeonClearState[sceneName][roomName]}
                      toggleEnemy={
                        (enemyName: string, which: "spawn"|"clear") => toggleDungeonEnemy(sceneName, roomName, enemyName, which)}
                      foundSouls={foundSouls}
                      allSoulList={allSoulList}
                      variant='secondary'
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