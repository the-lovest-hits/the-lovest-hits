import { useForm } from "react-hook-form";
import {
  useEffect,
  useState
} from "react";
import { CubeEntity } from "../../add";
import Input from "../../../../components/page-elements/input";
import Button from "../../../../components/page-elements/button";
import InputPassword from "../../../../components/page-elements/input-password";
import { useMnemonicData } from "../../../../providers/mnemonic-data";
import { downloadKeyFile } from "../../../../shared/services/generate-mnemonic.service";
import { useLocalStorage } from "../../../../shared/services/account-data-localstorage.service";
import { mnemonicGenerate, mnemonicToMiniSecret } from '@polkadot/util-crypto';
import { Keyring } from '@polkadot/keyring';
import { KeyringPair$Json } from '@polkadot/keyring/types';
import { useAccount } from '../../../../providers/account';

export enum MnemonicFormFields {
  Phrase = "phrase",
  Password = "password",
}

function MnemonicPhraseAdd({className, active, children, setActiveCube, title}) {
  const [downloadBtnVisible, setDownloadBtnVisible] = useState(false);
  const {register, getValues, setValue, handleSubmit, formState: { isValid }} = useForm({mode: 'onChange'});
  const { addAccount } = useAccount();
  const [account, setAccount] = useState(null);

  const mnemonicPhraseUseFormData = {
    ...register(
      MnemonicFormFields.Phrase, {value: '', required: true},
    ),
  };
  const mnemonicPasswordUseFormData = {
    ...register(
      MnemonicFormFields.Password,
      {value: '', required: true},
    ),
  };

  const toFormSubmit = (data, e) => {
    e.preventDefault();

    const { phrase, password } = data;

    const seed = mnemonicToMiniSecret(phrase, password);
    const account = new Keyring({ type: 'sr25519' }).addFromSeed(
      seed,
      // { name: 'some name' } todo collect name?
    );
    setAccount(account);

    setDownloadBtnVisible(true);
  }

  useEffect(() => {
    if (!account) return;
    addAccount({
      address: account.address,
      name: account.meta.name, // todo collect meta
      sign: (payload) => {
        return account.sign(payload.signerPayloadHex).toHex();
      },
    });
  }, [ account ]);

  const toDownloadKeyJson = e => {
    e.preventDefault();
    const password = getValues(MnemonicFormFields.Password);
    const keyfile: KeyringPair$Json = account.toJson(password);
    downloadKeyFile(JSON.stringify(keyfile), `${account.address}.json`);
  };

  const generate = e => {
    e.preventDefault();
    setValue(
      MnemonicFormFields.Phrase, mnemonicGenerate(),{ shouldValidate: true },
    );
  }

  return (
    <div className={className} onClick={() => setActiveCube(CubeEntity.MnemonicPhraseAdd)}>
      <div className="plan plan--green">
        <form onSubmit={handleSubmit(toFormSubmit)}>
          <h3 className="plan__title">{ title }</h3>
          <span className="plan__price"><span>Add existing or <a href="javascript:void(0)" onClick={generate}>generate</a></span></span>

          {
            !active ? children : (
              <>
                <div className="inputs-block">
                  <Input className="input" useFormData={mnemonicPhraseUseFormData} disabled={downloadBtnVisible} placeholder={'Seed phrase'}/>
                  <InputPassword useFormData={mnemonicPasswordUseFormData} disabled={downloadBtnVisible} placeholder={'Password'} />
                </div>

                <div className="buttons-block">
                  <Button
                    type="submit"
                    className="btn btn--success"
                    disabled={!isValid}
                  >Add</Button>
                  { downloadBtnVisible
                    ? <>
                        <a href="javascript:void(0)"  onClick={(e) => toDownloadKeyJson(e)}>
                          Download KeyFile.json
                        </a>
                      </>
                    : null
                  }
                </div>
              </>
            )
          }

        </form>
      </div>
    </div>
  );
}

export default MnemonicPhraseAdd;
