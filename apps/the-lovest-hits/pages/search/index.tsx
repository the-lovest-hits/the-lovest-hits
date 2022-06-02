import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const Search = () => {

  const router = useRouter();
  const { q } = router.query;
  const [ artists, setArtists ] = useState<any[]>([]);


  useEffect(() => {

    const query = new URLSearchParams();
    query.set('q', q as string);
    const artistsQuery = new URLSearchParams(query);
    artistsQuery.set('type', 'artist');

    fetch('/api/spotify/search?' + artistsQuery.toString())
      .then((res) => res.json())
      .then(({ artists }) => {
        console.log('artists', artists.items);
        setArtists(artists.items);
      })
  }, [ q ]);


  return <>
    <div className="row row--grid">
      <div className="col-12">
        <ul className="breadcrumb">
          <li className="breadcrumb__item"><Link href="/">Home</Link></li>
          <li className="breadcrumb__item breadcrumb__item--active">Search</li>
        </ul>
      </div>

      <div className="col-12">
        <div className="main__title main__title--page">
          <h1>Search results for `{q}`</h1>
        </div>
      </div>

      <section className="row row--grid">
        <div className="col-12">
          <div className="main__title">
            <h2>Artists</h2>

            <Link href="/artists">
              <a className="main__link">See all
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M17.92,11.62a1,1,0,0,0-.21-.33l-5-5a1,1,0,0,0-1.42,1.42L14.59,11H7a1,1,0,0,0,0,2h7.59l-3.3,3.29a1,1,0,0,0,0,1.42,1,1,0,0,0,1.42,0l5-5a1,1,0,0,0,.21-.33A1,1,0,0,0,17.92,11.62Z"/>
                </svg>
              </a>
            </Link>
          </div>
        </div>

        {artists.map(artist => {
          return (
            <div className="col-6 col-sm-4 col-lg-2">
              <div className="album">
                <div className="album__cover">
                  <Link href={'/artists/' + artist.id}>
                    <img src={artist.images.find(({ height }) => height > 300)?.url} alt="" />
                  </Link>
                </div>
                <div className="album__title">
                  <h3><Link href={'/artists/' + artist.id}>
                    <a>{artist.name}</a>
                  </Link></h3>
                  <span>
                    {artist.genres.map((genre, index) => {
                      const addAmpers = index < artist.genres.length - 1;
                      return <><Link href={'/genre/' + genre}>
                        <a>{ genre }</a>
                      </Link>{ addAmpers && ' & '}</>
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}



      </section>

    </div>
  </>;
}

export default Search;
