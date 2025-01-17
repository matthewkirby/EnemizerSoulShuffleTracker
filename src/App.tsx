// import { useState } from 'react'
import '@mantine/core/styles.css';
import { Button, Container, MantineProvider } from '@mantine/core';
import classes from './App.module.css';
import { IconPlus } from '@tabler/icons-react';

function App() {

  return (
    <MantineProvider defaultColorScheme='dark'>
      <header className={classes.header}>
        <Container fluid className={classes.inner}>
          <Button variant='filled' leftSection={<IconPlus stroke={4}/>}>Enemy Souls</Button>
          <Button variant='light' color='red'>Reset</Button>
        </Container>
      </header>
      <main>
        <Container fluid>
          Main Body
        </Container>
      </main>

    </MantineProvider>
  )
}

export default App
