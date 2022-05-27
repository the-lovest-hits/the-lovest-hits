import React from 'react';

import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { Main } from './components/Main';
import { Player } from './components/Player';
import { Sidebar } from './components/Sidebar';

function App() {
  return (
    <>
      <Header/>
      <Sidebar/>
      <Player/>
      <Main/>
      <Footer/>
    </>
  );
}

export default App;
