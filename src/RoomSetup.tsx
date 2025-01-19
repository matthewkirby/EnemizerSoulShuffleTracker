import { Button, Container, Flex, Popover, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import classes from "./RoomSetup.module.css";
import SoulList from "./SoulList";


interface RoomSetupProps {
  roomSetupName: string;
  enemyList: string[];
  toggleEnemyInSetup: (enemyName: string) => void;
  foundSouls: string[];
  allSoulList: string[];
}

const defaultClearedEnemies = JSON.stringify([]);

const RoomSetup: React.FC<RoomSetupProps> = ({
  roomSetupName, enemyList, toggleEnemyInSetup, foundSouls, allSoulList
}) => {

  const roomSetupKey = `${roomSetupName} Enemies`;

  const [clearedEnemies, setClearedEnemies] = useState<string[]>(
    JSON.parse(localStorage.getItem(roomSetupKey) ?? defaultClearedEnemies)
  );
  const [opened, setOpened] = useState(false);
  const classNameList = `${classes.row} ${opened ? classes.raiseRow : ""}`;

  const toggleClearedEnemy = (enemyName: string) => {

    if (!foundSouls.includes(enemyName)) { return; }

    if (clearedEnemies.includes(enemyName)) {
      const newArray = clearedEnemies.filter(n => n !== enemyName);
      setClearedEnemies(newArray);
    } else {
      setClearedEnemies([ ...clearedEnemies, enemyName ]);
    }

  };

  useEffect(() => localStorage.setItem(roomSetupKey, JSON.stringify(clearedEnemies)), [roomSetupKey, clearedEnemies]);
  

  return (
    <Container fluid className={classNameList}>

      <Popover
        opened={opened}
        onChange={setOpened}
        width='75%'
        offset={15}
        withOverlay withArrow
        overlayProps={{blur: '8px'}}
      >


        <Popover.Target>
          <Button
            variant="default"
            size='compact-sm'
            className={classes.button}
            onClick={() => setOpened((o) => !o)}
          ><IconPlus stroke={2} size='1rem'/></Button>
        </Popover.Target>


        <Popover.Dropdown>
          <SoulList
            title={`Enemies In ${roomSetupName}`}
            allSoulList={allSoulList}
            highlightSouls={enemyList}
            onChildClick={toggleEnemyInSetup}
            selectedColor="grape"
          />
        </Popover.Dropdown>


      </Popover>

      <Text size='xl' fw={700} className={classes.roomSetupName}>{roomSetupName}:</Text>
      <Flex
        gap='md'
        justify='flex-start'
        align='flex-start'
        direction='row'
        wrap='wrap'
      >
        {enemyList.map((enemyName, i) => {

          const buttonColor = 
            !foundSouls.includes(enemyName) ? "red" // Not found soul
            : !clearedEnemies.includes(enemyName) ? "green" // In setup, have soul, not defeated
            : "rgba(122, 108, 108, 1)"; // In setup, have soul, defeated

          return (
            <Button
              key={i}
              variant="light"
              color={buttonColor}
              onClick={() => toggleClearedEnemy(enemyName)}
            >
              {enemyName}
            </Button>
          );

        })}
      </Flex>
    </Container>
  );
}

export default RoomSetup;