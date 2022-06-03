import Link from 'next/link';
import { ReactNode } from 'react';

export const Subtitle = ({ children, link, linkContent }: {
  link?: string;
  linkContent?: string;
  children: ReactNode;
}) => {

  return (
    <div className="col-12">
      <div className="main__title">
        <h2>{ children }</h2>

        {link && (
          <Link href={link}>
            <a className="main__link">{linkContent || 'See all'}
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path
                  d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/>
              </svg>
            </a>
          </Link>
        )}


      </div>
    </div>
  )
}
