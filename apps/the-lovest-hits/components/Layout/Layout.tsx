import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Player } from '../Player';
import { Main } from '../Main';
import { Footer } from '../Footer';

export const Layout = () => {
  return (
    <>
      <Header />
      <Sidebar />
      <Player />
      <Main />
      <Footer />
    </>
  );
};
