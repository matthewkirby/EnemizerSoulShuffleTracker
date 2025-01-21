import { Button, Container, Flex, Popover, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React, { useEffect, useState } from "react";
import classes from "./RoomSetup.module.css";
import SoulList from "./SoulList";


interface RoomSetupProps {
  roomSetupName: string;
  foundSouls: string[];
  allSoulList: string[];
  variant?: "primary" | "secondary";
  sceneName?: string;
  enableNoSoulToggleWarning?: boolean;
}

const defaultStorageString = JSON.stringify([]);

const RoomSetup: React.FC<RoomSetupProps> = ({
  roomSetupName, foundSouls, allSoulList, variant = "primary", sceneName = "", enableNoSoulToggleWarning = true
}) => {

  const uniqueName = `${sceneName.slice(0,2)}:${roomSetupName}`;
  const spawnString = `${uniqueName}Spawns`;
  const clearString = `${uniqueName}Cleared`;

  const [spawns, setSpawns] = useState<string[]>(JSON.parse(localStorage.getItem(spawnString) ?? defaultStorageString));
  const [clears, setClears] = useState<string[]>(JSON.parse(localStorage.getItem(clearString) ?? defaultStorageString));

  const [opened, setOpened] = useState(false);
  const classNameList = `${classes.row} ${opened ? classes.raiseRow : ""}`;


  const toggleEnemy = (enemyName: string, which: "spawn" | "clear") => {
    const whichState = which === "spawn" ? [ ...spawns ] : [ ...clears ];
    const whichSetter = which === "spawn" ? setSpawns : setClears;

    if (whichState.includes(enemyName)) {
      const newArray = whichState.filter((name:string) => name !== enemyName);
      whichSetter(newArray);
    } else {
      whichSetter([ ...whichState, enemyName ].sort());
    }
  };

  useEffect(() => localStorage.setItem(spawnString, JSON.stringify(spawns)), [spawnString, spawns]);
  useEffect(() => localStorage.setItem(clearString, JSON.stringify(clears)), [clearString, clears]);


  return (
    <Container fluid className={classNameList}>
      <Flex
        gap='md'
        justify='flex-start'
        align='flex-start'
        direction='row'
        wrap='wrap'
      >

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
              size={variant === "secondary" ? 'compact-xs' : 'compact-sm'}
              onClick={() => setOpened((o) => !o)}
            ><IconPlus stroke={2} size='1rem'/></Button>
          </Popover.Target>

          <Popover.Dropdown>
            <SoulList
              title={`Enemies In ${roomSetupName}`}
              allSoulList={allSoulList}
              highlightSouls={spawns}
              onChildClick={(enemyName) => toggleEnemy(enemyName, "spawn")}
              selectedColor="grape"
            />
          </Popover.Dropdown>

        </Popover>

        <Text
          size={variant === "secondary" ? "md" : "xl"}
          fw={700}
        >
          {roomSetupName}:
        </Text>


        {spawns.map((enemyName: string, i:number) => {

          const buttonColor = 
            clears.includes(enemyName) ? "rgba(122, 108, 108, 1)" // Defeated
            : foundSouls.includes(enemyName) ? "green" // Have the soul, undefeated
            : "red"; // Don't have the soul, undefeated

          const buttonClasses = (
            enableNoSoulToggleWarning &&
            !foundSouls.includes(enemyName) &&
            clears.includes(enemyName)
          )
            ? classes.warningButton : "";

          return (
            <Button
              key={i}
              variant="light"
              color={buttonColor}
              onClick={() => toggleEnemy(enemyName, "clear")}
              size={variant === "secondary" ? "xs" : "sm"}
              className={buttonClasses}
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