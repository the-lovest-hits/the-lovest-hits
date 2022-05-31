import { Header } from '../Header';
import { Sidebar } from '../Sidebar';
import { Player } from '../Player';
import { Main } from '../Main';
import { Footer } from '../Footer';

export const Layout = ({children}) => {
  return (
    <main className="main">
      <div className="container-fluid">
        {children}
      </div>
    </main>
  );
};
