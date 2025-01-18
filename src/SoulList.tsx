import { Button, Flex, Stack, Title } from "@mantine/core";
import React from "react";
import classes from "./SoulList.module.css";


interface SoulListProps {
  title: string;
  allSoulList: string[];
  highlightSouls: string[];
  onChildClick: (soulName: string) => void;
  selectedColor?: string;
}

const SoulList: React.FC<SoulListProps> = ({
  title, allSoulList, highlightSouls, onChildClick, selectedColor
}) => {
  
  const color = selectedColor == null ? 'green' : selectedColor;


  return (
    <Stack align='stretch' justify="flex-start">


      <Title order={1} className={classes.title}>
        {title}
      </Title>


      <Flex
        gap='md'
        justify='center'
        align='flex-start'
        direction='row'
        wrap='wrap'
      >
        {allSoulList.map((name, i) => (
          <Button
            key={i}
            variant={highlightSouls.includes(name) ? 'filled' : 'default'}
            color={color}
            onClick={() => onChildClick(name)}
          >
            {name}
          </Button>
        ))}
      </Flex>


    </Stack>
  );

};

export default SoulList;