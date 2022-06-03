import Link from 'next/link';
import { FC, MouseEvent, ReactNode } from 'react';

interface Image {
  height: number;
  width: number;
  url: string;
}

export function AlbumCard({
  images,
  link,
  clickOnPlay,
  image,
  children,
}: {
  children?: any,
  images?: Image[];
  image?: string;
  link: string;
  clickOnPlay?: () => void;
}) {

  function click(e: MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (typeof clickOnPlay === "function") {
      clickOnPlay();
    }
  }

  return (<>
    <div className="col-6 col-sm-4 col-lg-2">
      <div className="album">
        <div className="album__cover">
          <Link href={link}>
            <img src={image} alt="" />
          </Link>
            {clickOnPlay && (
              <a href="#" onClick={click}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z"/>
                </svg>
              </a>
            )}
        </div>
        <div className="album__title">
          { children }
        </div>
      </div>
    </div>
  </>);
}
