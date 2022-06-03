import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { AlbumCard, Breadcrumbs, Subtitle, Title, useBreadcrumbs } from '../../components/page-elements';

const Search = () => {

  const router = useRouter();
  const { q } = router.query;
  const [ artists, setArtists ] = useState<any[]>([]);

  const { setBreadcrumbs } = useBreadcrumbs();

  useEffect(() => {

    setBreadcrumbs([
      { name: 'Search' },
    ]);

    const query = new URLSearchParams();
    query.set('q', q as string);
    const artistsQuery = new URLSearchParams(query);
    artistsQuery.set('type', 'artist');

    fetch('/api/spotify/search?' + artistsQuery.toString())
      .then((res) => res.json())
      .then(({ artists }) => {
        setArtists(artists.items);
      })
  }, [ q ]);


  return <>

      <Breadcrumbs />

      <Title>Search results for `{q}`</Title>

      <section className="row row--grid">

        <Subtitle link="/artists">
          Artists
        </Subtitle>

        {artists.map(artist => {
          return (<>
              <AlbumCard
                key={artist.id}
                link={'/artists/' + artist.id}
                image={artist.images.find(({ height }) => height > 300)?.url}
              >
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
              </AlbumCard>
            </>
          );
        })}



      </section>

  </>;
}

export default Search;
