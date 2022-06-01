import ConnectPolkadotApp from "./components/ConnectPolkadotApp/ConnectPolkadotApp";
import MnemonicPhraseAdd from "./components/MnemonicPhraseAdd/MnemonicPhraseAdd";
import UploadKeyFile from "./components/UploadKeyFile/UploadKeyFile";

function AccountAdd() {
  return (
    <div className="row row--grid">
      <MnemonicPhraseAdd className="col-4 mnemonic-phrase-add-cube"></MnemonicPhraseAdd>
      <UploadKeyFile className="col-4 upload-key-file-cube"></UploadKeyFile>
      <ConnectPolkadotApp className="col-4 polkadot-cube"></ConnectPolkadotApp>
    </div>
  )
}

export default AccountAdd;
