import Link from 'next/link';
import { createContext, Dispatch, useContext, useState } from 'react';

interface Breadcrumb {
  name: string;
  link?: string;
}

export const BreadcrumbsContext = createContext<{ breadcrumbs: Breadcrumb[], setBreadcrumbs: Dispatch<Breadcrumb[]> }>({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});
export const useBreadcrumbs = () => useContext(BreadcrumbsContext);

export const BreadcrumbsProvider = ({ children }) => {
  const [breadcrumbs, setBreadcrumbs] = useState<Breadcrumb[]>([]);

  return (
    <BreadcrumbsContext.Provider value={{ breadcrumbs, setBreadcrumbs }}>
      {children}
    </BreadcrumbsContext.Provider>
  );
};


export const Breadcrumbs = () => {

  const { breadcrumbs } = useBreadcrumbs();

  return (
    <section className="row">
      <div className="col-12">
        <ul className="breadcrumb">
          <li className="breadcrumb__item"><Link href="/">Home</Link></li>
          {breadcrumbs.map(({name, link}, index) => {
            let className = "breadcrumb__item";
            if (index === breadcrumbs.length - 1 || !link) {
              className = [ className, "breadcrumb__item--active"].join(" ");
              return <li className={className} key={index}>{ name }</li>
            }
            return <li className={className} key={index}><Link href={link}>{name}</Link></li>;
          })}
        </ul>
      </div>
    </section>
  )
}
