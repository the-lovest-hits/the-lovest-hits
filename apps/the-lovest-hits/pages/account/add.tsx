import { useState } from "react";
import MnemonicPhraseAdd from "./components/MnemonicPhraseAdd";
import UploadKeyFile from "./components/UploadKeyFile";
import ConnectPolkadotApp from "./components/ConnectPolkadotApp";

export enum CubeEntity {
  MnemonicPhraseAdd = 'MnemonicPhraseAdd',
  UploadKeyFile = 'UploadKeyFile',
  ConnectPolkadotApp = 'ConnectPolkadotApp'
}

export default function AccountAdd() {
  const [activeCube, setActiveCube] = useState(CubeEntity.MnemonicPhraseAdd);

  const setActiveCubeHandler = (activeCube: CubeEntity) => {
    setActiveCube(activeCube);
  };

  return (
    <div className="row row--grid account-add-container">
      <MnemonicPhraseAdd
        className={`${activeCube === CubeEntity.MnemonicPhraseAdd ? 'col-6 active': 'col-3'} account-add-cube account-add-cube--phrase`}
        setActiveCube={setActiveCubeHandler}
      ></MnemonicPhraseAdd>

      <UploadKeyFile
        className={`${activeCube === CubeEntity.UploadKeyFile ? 'col-6 active': 'col-3'} account-add-cube account-add-cube--upload-key`}
        setActiveCube={setActiveCubeHandler}
      ></UploadKeyFile>

      <ConnectPolkadotApp
        className={`${activeCube === CubeEntity.ConnectPolkadotApp ? 'col-6 active': 'col-3'} account-add-cube account-add-cube--polkadot`}
        setActiveCube={setActiveCubeHandler}
      ></ConnectPolkadotApp>
    </div>
  )
}
