import Link from 'next/link';
import { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const Item = ({ link, children }) => {
  const { asPath } = useRouter();
  const defaultClassName = "sidebar__nav-link";
  const [ className, setClassName ] = useState<string>(defaultClassName);

  useEffect(() => {

    let isActive = false;

    if (link === "/") {
      isActive = asPath === link;
    } else {
      isActive = asPath.startsWith(link);
    }

    if (isActive) {
      setClassName(
        [
          className,
          "sidebar__nav-link--active"
        ].join(" ")
      );
    }

    return () => {
      setClassName(defaultClassName);
    }
  }, [ asPath, link ]);

  return (
    <li className="sidebar__nav-item">
      <Link href={link} passHref>
        <a className={className}>
          { children }
        </a>
      </Link>
    </li>
  );
}


export const Sidebar: FC = () => {

  const router = useRouter();

  return (
    <div className="sidebar">
      {/*sidebar logo*/}
      <div className="sidebar__logo">
        <img src="/assets/img/logo.svg" alt="" />
      </div>
      {/*end sidebar logo*/}

      {/*sidebar nav*/}
      <ul className="sidebar__nav">
        <Item link="/">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M20,8h0L14,2.74a3,3,0,0,0-4,0L4,8a3,3,0,0,0-1,2.26V19a3,3,0,0,0,3,3H18a3,3,0,0,0,3-3V10.25A3,3,0,0,0,20,8ZM14,20H10V15a1,1,0,0,1,1-1h2a1,1,0,0,1,1,1Zm5-1a1,1,0,0,1-1,1H16V15a3,3,0,0,0-3-3H11a3,3,0,0,0-3,3v5H6a1,1,0,0,1-1-1V10.25a1,1,0,0,1,.34-.75l6-5.25a1,1,0,0,1,1.32,0l6,5.25a1,1,0,0,1,.34.75Z"></path>
          </svg>
          <span>Home</span>
        </Item>

        <Item link="/artists">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12.3,12.22A4.92,4.92,0,0,0,14,8.5a5,5,0,0,0-10,0,4.92,4.92,0,0,0,1.7,3.72A8,8,0,0,0,1,19.5a1,1,0,0,0,2,0,6,6,0,0,1,12,0,1,1,0,0,0,2,0A8,8,0,0,0,12.3,12.22ZM9,11.5a3,3,0,1,1,3-3A3,3,0,0,1,9,11.5Zm9.74.32A5,5,0,0,0,15,3.5a1,1,0,0,0,0,2,3,3,0,0,1,3,3,3,3,0,0,1-1.5,2.59,1,1,0,0,0-.5.84,1,1,0,0,0,.45.86l.39.26.13.07a7,7,0,0,1,4,6.38,1,1,0,0,0,2,0A9,9,0,0,0,18.74,11.82Z" />
          </svg>
          <span>Artists</span>
        </Item>

        <Item link="/releases">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M21.65,2.24a1,1,0,0,0-.8-.23l-13,2A1,1,0,0,0,7,5V15.35A3.45,3.45,0,0,0,5.5,15,3.5,3.5,0,1,0,9,18.5V10.86L20,9.17v4.18A3.45,3.45,0,0,0,18.5,13,3.5,3.5,0,1,0,22,16.5V3A1,1,0,0,0,21.65,2.24ZM5.5,20A1.5,1.5,0,1,1,7,18.5,1.5,1.5,0,0,1,5.5,20Zm13-2A1.5,1.5,0,1,1,20,16.5,1.5,1.5,0,0,1,18.5,18ZM20,7.14,9,8.83v-3L20,4.17Z" />
          </svg>
          <span>Releases</span>
        </Item>


        <Item link="/store">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M8.5,19A1.5,1.5,0,1,0,10,20.5,1.5,1.5,0,0,0,8.5,19ZM19,16H7a1,1,0,0,1,0-2h8.49121A3.0132,3.0132,0,0,0,18.376,11.82422L19.96143,6.2749A1.00009,1.00009,0,0,0,19,5H6.73907A3.00666,3.00666,0,0,0,3.92139,3H3A1,1,0,0,0,3,5h.92139a1.00459,1.00459,0,0,1,.96142.7251l.15552.54474.00024.00506L6.6792,12.01709A3.00006,3.00006,0,0,0,7,18H19a1,1,0,0,0,0-2ZM17.67432,7l-1.2212,4.27441A1.00458,1.00458,0,0,1,15.49121,12H8.75439l-.25494-.89221L7.32642,7ZM16.5,19A1.5,1.5,0,1,0,18,20.5,1.5,1.5,0,0,0,16.5,19Z" />
          </svg>
          <span>Store</span>
        </Item>

      </ul>
      {/*end sidebar nav*/}
    </div>
  );
};
