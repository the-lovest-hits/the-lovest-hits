import ConnectPolkadotApp from "./components/ConnectPolkadotApp/ConnectPolkadotApp";
import MnemonicPhraseAdd from "./components/MnemonicPhraseAdd/MnemonicPhraseAdd";
import UploadKeyFile from "./components/UploadKeyFile/UploadKeyFile";
import { AccountAddContext } from "../../context/account-add.context";
import { useState } from "react";

export enum CubeEntity {
  MnemonicPhraseAdd = 'MnemonicPhraseAdd',
  UploadKeyFile = 'UploadKeyFile',
  ConnectPolkadotApp = 'ConnectPolkadotApp'
}

function AccountAdd() {
  const [activeCube, setActiveCube] = useState(CubeEntity.MnemonicPhraseAdd);

  const setActiveCubeHandler = (activeCube: CubeEntity) => {
    setActiveCube(activeCube);
  };

  return (
    <AccountAddContext.Provider value={ {activeCube: 'UploadKeyFile'} }>
      <div className="row row--grid">
        <MnemonicPhraseAdd
          className={`${activeCube === CubeEntity.MnemonicPhraseAdd ? 'col-6': 'col-3'} account-add-cube account-add-cube--mnemonic-phrase`}
          setActiveCube={setActiveCubeHandler}
        ></MnemonicPhraseAdd>

        <UploadKeyFile
          className={`${activeCube === CubeEntity.UploadKeyFile ? 'col-6': 'col-3'} account-add-cube account-add-cube--upload-key`}
          setActiveCube={setActiveCubeHandler}
        ></UploadKeyFile>

        <ConnectPolkadotApp
          className={`${activeCube === CubeEntity.ConnectPolkadotApp ? 'col-6': 'col-3'} account-add-cube account-add-cube--polkadot"`}
          setActiveCube={setActiveCubeHandler}
        ></ConnectPolkadotApp>
      </div>
    </AccountAddContext.Provider>
  )
}

export default AccountAdd;
