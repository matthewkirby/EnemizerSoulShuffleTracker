import { Button, Container, Flex, Popover, Text } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import React, { useState } from "react";
import classes from "./RoomSetup.module.css";
import SoulList from "./SoulList";


interface RoomSetupProps {
  roomSetupName: string;
  spawnList: string[];
  clearedList: string[];
  toggleEnemy: (enemyName: string, which: "spawn"|"clear") => void;
  foundSouls: string[];
  allSoulList: string[];
  variant?: "primary" | "secondary";
}

const RoomSetup: React.FC<RoomSetupProps> = ({
  roomSetupName, spawnList, clearedList, toggleEnemy, foundSouls, allSoulList, variant = "primary"
}) => {

  const [opened, setOpened] = useState(false);
  const classNameList = `${classes.row} ${opened ? classes.raiseRow : ""}`;

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
              className={classes.button}
              onClick={() => setOpened((o) => !o)}
            ><IconPlus stroke={2} size='1rem'/></Button>
          </Popover.Target>

          <Popover.Dropdown>
            <SoulList
              title={`Enemies In ${roomSetupName}`}
              allSoulList={allSoulList}
              highlightSouls={spawnList}
              onChildClick={(enemyName) => toggleEnemy(enemyName, "spawn")}
              selectedColor="grape"
            />
          </Popover.Dropdown>

        </Popover>

        <Text
          size={variant === "secondary" ? "md" : "xl"}
          fw={700}
          className={classes.roomSetupName}
        >
          {roomSetupName}:
        </Text>


        {spawnList.map((enemyName, i) => {

          const buttonColor = 
            !foundSouls.includes(enemyName) ? "red" // Not found soul
            : !clearedList.includes(enemyName) ? "green" // In setup, have soul, not defeated
            : "rgba(122, 108, 108, 1)"; // In setup, have soul, defeated

          return (
            <Button
              key={i}
              variant="light"
              color={buttonColor}
              onClick={() => toggleEnemy(enemyName, "clear")}
              size={variant === "secondary" ? "xs" : "sm"}
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