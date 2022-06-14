import { useEffect, useState } from 'react';
import MnemonicPhraseAdd from "./components/MnemonicPhraseAdd";
import UploadKeyFile from "./components/UploadKeyFile";
import ConnectPolkadotApp from "./components/ConnectPolkadotApp";
import { Breadcrumbs, Title, useBreadcrumbs } from '../../components/page-elements';
import { MnemonicDataProvider } from "../../providers/mnemonic-data";

export enum CubeEntity {
  MnemonicPhraseAdd = 'MnemonicPhraseAdd',
  UploadKeyFile = 'UploadKeyFile',
  ConnectPolkadotApp = 'ConnectPolkadotApp'
}

export default function AccountAdd() {
  const [activeCube, setActiveCube] = useState<CubeEntity>(null);

  const { setBreadcrumbs } = useBreadcrumbs();

  const defaultClassNames = 'col-12 col-md-6 col-lg-4';
  const activeClassNames = 'col-8 col-md-12 col-lg-8';
  const nonActiveClassNames = 'col-2 col-md-6 col-lg-2 hide-info';

  function getClassNamesFor(cube: CubeEntity): string {
    if (activeCube) {
      if (activeCube === cube) {
        return activeClassNames;
      } else {
        return nonActiveClassNames;
      }
    } else {
      if (cube === CubeEntity.UploadKeyFile) {
        return 'col-12 col-md-12 col-lg-4';
      }
      return defaultClassNames;
    }
  }

  const setActiveCubeHandler = (activeCube: CubeEntity) => {
    setActiveCube(activeCube);
  };

  useEffect(() => {
    setBreadcrumbs([
      {
        name: 'Accounts',
        link: '/accounts',
      },
      {
        name: 'Add',
      }
    ]);
  }, [ setBreadcrumbs ]);

  return (<>

    <Breadcrumbs />

    <Title>Add Account via</Title>

    <div className="row row--grid">
      <MnemonicDataProvider>
        <MnemonicPhraseAdd
          className={`order-md-2 order-lg-1 ` + getClassNamesFor(CubeEntity.MnemonicPhraseAdd)}
          active={activeCube === CubeEntity.MnemonicPhraseAdd}
          setActiveCube={setActiveCubeHandler}
          title="Mnemonic Phrase"
        >
          <button
            onClick={() => setActiveCubeHandler(CubeEntity.MnemonicPhraseAdd)}
            className="plan__btn" type="button"
          >Select</button>
        </MnemonicPhraseAdd>
      </MnemonicDataProvider>

      <UploadKeyFile
        className={`order-md-1 order-lg-2 ` + getClassNamesFor(CubeEntity.UploadKeyFile)}
        active={activeCube === CubeEntity.UploadKeyFile}
        setActiveCube={setActiveCubeHandler}
        title="JSON KeyFile"
      >

        <button
          onClick={() => setActiveCubeHandler(CubeEntity.UploadKeyFile)}
          className="plan__btn" type="button"
        >Select</button>
      </UploadKeyFile>

      <ConnectPolkadotApp
        className={`order-md-3 order-lg-3 ` + getClassNamesFor(CubeEntity.ConnectPolkadotApp)}
        active={activeCube === CubeEntity.ConnectPolkadotApp}
        setActiveCube={setActiveCubeHandler}
        title="Polkadot App"
      >
        <button
          onClick={() => setActiveCubeHandler(CubeEntity.ConnectPolkadotApp)}
          className="plan__btn" type="button"
        >Select</button>
      </ConnectPolkadotApp>
    </div>
  </>)
}
