import Link from 'next/link';
import { useRouter } from 'next/router';
import { createRef, useEffect, useRef, useState } from 'react';

const CreateArtist = () => {
  const router = useRouter();
  const { id } = router.query;
  const [ artist, setArtist ] = useState<any>(null);
  const [ image, setImage ] = useState<string>('');
  const [ collection, setCollection ] = useState(null);
  const [ price, setPrice ] = useState({ commission: 20, price: 0 });
  const formRef = useRef<HTMLFormElement>();

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

    if (artist.collectionId) {
      router.push('../' + artist.id);
    } else {
      fetch('/api/artists/' + id + '/price').then(
        (res) => res.json(),
      ).then(setPrice);
    }
  }, [ artist ]);

  async function buy() {
    const formData = new FormData(formRef.current);
    const fields = {};
    formData.forEach((value, key) => {
      fields[key] = value;
    });

    // todo account address
    const extrinsic = await fetch(`/api/artists/${artist.id}/mint?address=DGT1sQcfGG1JapVRN4v3MHVmkqCHgijHrHxvo3M1U7ZGo6s`)
      .then(res => res.json());

    // todo sign extrinsic
    confirm('sign?');

    const response = await fetch(`/api/artists/${artist.id}/mint`,{
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        extrinsic,
        fields,
      }),
    }).then((res) => res.json());
    console.log('res', response);
  }

  return <>
    <div className="row row--grid">
      <div className="col-12">
        <ul className="breadcrumb">
          <li className="breadcrumb__item"><Link href="/">Home</Link></li>
          <li className="breadcrumb__item"><Link href={ artist ? '../' + artist?.id : '/'}>
            <a>{artist?.name}</a>
          </Link></li>
          <li className="breadcrumb__item breadcrumb__item--active">Minting NFT</li>
        </ul>
      </div>

      <div className="col-12">
        <div className="main__title main__title--page">
          <h1>{artist?.name}</h1>
        </div>
      </div>

      <div className="col-12">
        <div className="release">
          <div className="release__content">
            <div className="release__cover">
              <img src={image} alt="" />
            </div>

            {price?.price &&
            <>
              <a className="release__buy" onClick={() => buy()}>Create for {price.price} KSM</a>
            </>
            }
          </div>

          <div className="release__list">
            <form className="sign__form sign__form--contacts" ref={formRef}>
              <div className="row">

                <div className="col-12">
                  <div className="sign__group">
                    <input type="text" name="name" className="sign__input" readOnly value={artist?.name} />
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <input type="text" name="tokenPrefix" className="sign__input" placeholder="TKPX" />
                    token prefix hint
                  </div>
                </div>

                <div className="col-12">
                  <div className="sign__group">
                    <textarea
                      name="description"
                      className="sign__textarea"
                      placeholder="About this artist"
                    ></textarea>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="col-12 col-lg-8">
        <div className="article">
          <div className="article__content">
            <h4>TODO About creation</h4>

            <p>There are many <b>variations</b> of passages of Lorem Ipsum available, but the majority
              have <a href="#">suffered</a> alteration in some form, by injected humour, or randomised words
              which don't look even slightly believable.</p>

            <p>It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum
              passages, and more recently with desktop publishing software like Aldus PageMaker including
              versions of Lorem Ipsum.</p>
          </div>
        </div>
      </div>
    </div>
  </>
}

export default CreateArtist;
