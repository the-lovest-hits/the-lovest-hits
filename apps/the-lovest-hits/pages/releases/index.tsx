import { AlbumCard, Breadcrumbs, Title, useBreadcrumbs } from '../../components/page-elements';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Track {
  id: string;
  name: string;
  artistId: string;
  artist: {
    name: string;
    id: string;
  };
  ipfsPin: string;
  spotifyUri: string;
}

export default function Releases() {

  const [ page, setPage ] = useState<number>(1);
  const [ pages, setPages ] = useState<number>(1);
  const [ tracks, setTracks ] = useState<Track[]>([]);

  const { setBreadcrumbs } = useBreadcrumbs();

  function loadMore() {
    const query = new URLSearchParams();
    query.set('page', String(page));

    fetch(`/api/tracks/releases?${query.toString()}`)
      .then(res => res.json())
      .then(({ items, pages }) => {
        setTracks([... tracks, ... items]);
        setPages(pages);
      });
  }

  function incPage() {
    if (pages > page) {
      setPage(page + 1);
    }
  }

  useEffect(() => {
    loadMore();
  }, [ page ]);

  useEffect(() => {

    setTracks([]);

    setPage(1);

    setBreadcrumbs([{
      name: 'Releases',
    }]);
  }, [ setBreadcrumbs, setTracks ]);

  return (<>

    <Breadcrumbs />

    <Title>Releases</Title>

    <div className="row row--grid">
      <div className="col-12">
        <div className="main__filter">
          <form action="#" className="main__filter-search">
            <input type="text" placeholder="Search..." />
              <button type="button">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M21.71,20.29,18,16.61A9,9,0,1,0,16.61,18l3.68,3.68a1,1,0,0,0,1.42,0A1,1,0,0,0,21.71,20.29ZM11,18a7,7,0,1,1,7-7A7,7,0,0,1,11,18Z"/>
                </svg>
              </button>
          </form>

          <div className="main__filter-wrap">
            <select className="main__select" name="genres">
              <option value="all">All artists</option>
              <option value="legacy">Legacy artists</option>
              <option value="active">Active artists</option>
            </select>

            <select className="main__select" name="years">
              <option value="All genres">All genres</option>
              <option value="1">Alternative</option>
              <option value="2">Blues</option>
              <option value="3">Classical</option>
              <option value="4">Country</option>
              <option value="5">Electronic</option>
              <option value="6">Hip-Hop/Rap</option>
              <option value="7">Indie</option>
              <option value="8">Jazz</option>
              <option value="8">Latino</option>
              <option value="8">R&B/Soul</option>
              <option value="8">Rock</option>
            </select>
          </div>

          <div className="slider-radio">
            <input type="radio" name="grade" id="featured" /><label
              htmlFor="featured">Featured</label>
              <input type="radio" name="grade" id="popular" /><label htmlFor="popular">Popular</label>
                <input type="radio" name="grade" id="newest" /><label htmlFor="newest">Newest</label>
          </div>
        </div>

        <div className="row row--grid">
          {tracks.map(({id, name, ipfsPin, artist, spotifyUri}, index) => {
            return <AlbumCard
              key={index}
              image={"https://ipfs.unique.network/ipfs/" + ipfsPin}
              clickOnPlay={() => console.log('play', spotifyUri)}
              link={"/tracks/" + id}
            >
              <h3>
                <Link href={"/tracks/" + id}>
                  <a>{ name }</a>
                </Link>
              </h3>
              <span>
                <Link href={"/artists/" + artist.id}>
                  <a>{ artist.name }</a>
                </Link>
              </span>
            </AlbumCard>;
          })}
        </div>
        {
          (page < pages) && (
            <button className="main__load" type="button" onClick={() => incPage()}>Load more</button>
          )
        }

      </div>
    </div>
  </>)
}
