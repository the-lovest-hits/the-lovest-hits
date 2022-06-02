import { Breadcrumbs, Title, useBreadcrumbs } from '../../../components/page-elements';
import Link from 'next/link';
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react';

const Artist = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ artist, setArtist ] = useState<any>(null);
  const [ image, setImage ] = useState<string>('');
  const [ collection, setCollection ] = useState(null);
  const [ price, setPrice ] = useState({ commission: 20, price: 0 });
  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {
    if (id) {
      fetch('/api/artists/' + id).then(
        (res) => res.json(),
      ).then(setArtist);
    }
  }, [ id ]);

  useEffect(() => {

    if (!artist) return;

    if (artist.images) {
      setImage(artist.images.find(({ height }) => height === 640)?.url)
    }

    if (!artist.collectionId) {
      fetch('/api/artists/' + id + '/price').then(
        (res) => res.json(),
      ).then(setPrice);
    }

    setBreadcrumbs([
      { name: 'Artists', link: '/artists' },
      { name: artist.name },
    ]);
  }, [ artist ]);

  return (
    <>

      <Breadcrumbs />

      <Title>{artist?.name}</Title>

      <div className="col-12">
        <div className="release">
          <div className="release__content">
            <div className="release__cover">
              <img src={image} alt="" />
            </div>
            {collection &&
            <>
              <div className="release__stat">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path
                      d="M21.65,2.24a1,1,0,0,0-.8-.23l-13,2A1,1,0,0,0,7,5V15.35A3.45,3.45,0,0,0,5.5,15,3.5,3.5,0,1,0,9,18.5V10.86L20,9.17v4.18A3.45,3.45,0,0,0,18.5,13,3.5,3.5,0,1,0,22,16.5V3A1,1,0,0,0,21.65,2.24ZM5.5,20A1.5,1.5,0,1,1,7,18.5,1.5,1.5,0,0,1,5.5,20Zm13-2A1.5,1.5,0,1,1,20,16.5,1.5,1.5,0,0,1,18.5,18ZM20,7.14,9,8.83v-3L20,4.17Z"
                    /></svg>
                    10 tracks
                  </span>
                <span><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path
                  d="M20,13.18V11A8,8,0,0,0,4,11v2.18A3,3,0,0,0,2,16v2a3,3,0,0,0,3,3H8a1,1,0,0,0,1-1V14a1,1,0,0,0-1-1H6V11a6,6,0,0,1,12,0v2H16a1,1,0,0,0-1,1v6a1,1,0,0,0,1,1h3a3,3,0,0,0,3-3V16A3,3,0,0,0,20,13.18ZM7,15v4H5a1,1,0,0,1-1-1V16a1,1,0,0,1,1-1Zm13,3a1,1,0,0,1-1,1H17V15h2a1,1,0,0,1,1,1Z"/></svg> 19 503</span>
              </div>
            </>
            }

            {price?.price &&
            <>
              <Link href={artist.id + '/create'}>
                <a className="release__buy">Create for {price.price} KSM</a>
              </Link>
            </>
            }
          </div>

          <div className="release__list">
            <ul className="main__list main__list--playlist main__list--dashbox">
              <li className="single-item">
                <a data-playlist data-title="1. Got What I Got" data-artist="Jason Aldean"
                   data-img="/assets/img/covers/cover.svg"
                   href="https://dmitryvolkov.me/demo/blast2.0/audio/12071151_epic-cinematic-trailer_by_audiopizza_preview.mp3"
                   className="single-item__cover">
                  <img src="/assets/img/covers/cover.svg" alt="" />
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M18.54,9,8.88,3.46a3.42,3.42,0,0,0-5.13,3V17.58A3.42,3.42,0,0,0,7.17,21a3.43,3.43,0,0,0,1.71-.46L18.54,15a3.42,3.42,0,0,0,0-5.92Zm-1,4.19L7.88,18.81a1.44,1.44,0,0,1-1.42,0,1.42,1.42,0,0,1-.71-1.23V6.42a1.42,1.42,0,0,1,.71-1.23A1.51,1.51,0,0,1,7.17,5a1.54,1.54,0,0,1,.71.19l9.66,5.58a1.42,1.42,0,0,1,0,2.46Z"/>
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                      <path
                        d="M16,2a3,3,0,0,0-3,3V19a3,3,0,0,0,6,0V5A3,3,0,0,0,16,2Zm1,17a1,1,0,0,1-2,0V5a1,1,0,0,1,2,0ZM8,2A3,3,0,0,0,5,5V19a3,3,0,0,0,6,0V5A3,3,0,0,0,8,2ZM9,19a1,1,0,0,1-2,0V5A1,1,0,0,1,9,5Z"/>
                    </svg>
                </a>
                <div className="single-item__title">
                  <h4><a href="#">1. Got What I Got</a></h4>
                  <span><a href="artist.html">Jason Aldean</a></span>
                </div>
                <a href="#" className="single-item__add">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M19,11H13V5a1,1,0,0,0-2,0v6H5a1,1,0,0,0,0,2h6v6a1,1,0,0,0,2,0V13h6a1,1,0,0,0,0-2Z"/>
                  </svg>
                </a>
                <a href="#" className="single-item__export">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <path
                      d="M21,14a1,1,0,0,0-1,1v4a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V15a1,1,0,0,0-2,0v4a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V15A1,1,0,0,0,21,14Zm-9.71,1.71a1,1,0,0,0,.33.21.94.94,0,0,0,.76,0,1,1,0,0,0,.33-.21l4-4a1,1,0,0,0-1.42-1.42L13,12.59V3a1,1,0,0,0-2,0v9.59l-2.29-2.3a1,1,0,1,0-1.42,1.42Z"></path>
                  </svg>
                </a>
                <span className="single-item__time">2:58</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-8">
        <div className="article">
          <div className="article__content">
            <h4>About new album</h4>

            <p>There are many <b>variations</b> of passages of Lorem Ipsum available, but the majority
              have <a href="#">suffered</a> alteration in some form, by injected humour, or randomised words
              which don't look even slightly believable.</p>

            <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
              passages, and more recently with desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Artist;
