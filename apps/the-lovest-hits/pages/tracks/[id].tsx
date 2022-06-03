import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function Track() {

  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    fetch(`/api/tracks/${id}`)
      .then(res => res.json())
      .then(({ artistId }) => {
        if (!artistId) {
          return router.push('/');
        }
        router.push(`/artists/${artistId}`);
      })
  }, [ id ]);

  return <></>;
}
