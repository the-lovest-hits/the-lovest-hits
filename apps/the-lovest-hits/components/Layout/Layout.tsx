import { BreadcrumbsProvider } from '../page-elements';


export const Layout = ({children}) => {
  return (
    <main className="main">
      <div className="container-fluid">
        <BreadcrumbsProvider>
          {children}
        </BreadcrumbsProvider>
      </div>
    </main>
  );
};
