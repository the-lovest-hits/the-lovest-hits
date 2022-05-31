import { AppProps } from 'next/app';
import Head from 'next/head';

import '../assets/styles/bootstrap-reboot.min.css';
import '../assets/styles/bootstrap-grid.min.css';
import './styles.scss';

// TODO: разнести по ксс-модулям
import '../components/Header/Header.scss';
import '../components/Main/Main.scss';
import '../components/Footer/Footer.scss';
import '../components/Player/Player.scss';
import '../components/Sidebar/Sidebar.scss';
import { Header } from '../components/Header';
import { Sidebar } from '../components/Sidebar';
import { Player } from '../components/Player';
import { Main } from '../components/Main';
import { Footer } from '../components/Footer';
import { Layout } from '../components/Layout';

const LovelyHitsApp = ({ Component, pageProps }: AppProps) => {
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <title>The lovest hits - index page</title>
      </Head>

      <Header />
      <Sidebar />
      <Player />
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <Footer />
    </>
  );
};

export default LovelyHitsApp;
