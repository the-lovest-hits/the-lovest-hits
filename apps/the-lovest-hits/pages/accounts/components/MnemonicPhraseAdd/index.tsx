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

export enum MnemonicFormFields {
  Phrase = "phrase",
  Password = "password",
}

function MnemonicPhraseAdd({className, active, children, setActiveCube, title}) {
  const [nextStepButtonsVisible, setNextStepButtonsVisible] = useState(false);
  const {register, setValue, handleSubmit, formState: { isValid }} = useForm({mode: 'onChange'});

  const mnemonicData = useMnemonicData();
  const mnemonicPhraseUseFormData = {...register(MnemonicFormFields.Phrase, {value: mnemonicData.mnemonic, required: true})};
  const mnemonicPasswordUseFormData = {...register(MnemonicFormFields.Password, {value: null, required: true})};
  const [accountStorageData, setAccountStorageData] = useLocalStorage('accountStorageData', '');

  const toFormSubmit = (data, e) => {
    e.preventDefault();

    setNextStepButtonsVisible(true);
  }

  const toNext = () => {
    // setActiveCube(CubeEntity.MnemonicPhraseAdd)
    mnemonicData.generateMnemonic();

    setValue(MnemonicFormFields.Password, null,{ shouldValidate: true });

    setNextStepButtonsVisible(false);
  };

  const toDownloadKeyJson = e => {
    e.preventDefault();
    // // setActiveCube(CubeEntity.UploadKeyFile)

    downloadKeyFile(mnemonicData.json, 'keyFile');
    setAccountStorageData(mnemonicData)
  };

  useEffect(() => {
    setValue(MnemonicFormFields.Phrase, mnemonicData.mnemonic, { shouldValidate: true });
  }, [mnemonicData])

  return (
    <div className={className} onClick={() => setActiveCube(CubeEntity.MnemonicPhraseAdd)}>
      <div className="plan plan--green">
        <form onSubmit={handleSubmit(toFormSubmit)}>
          <h3 className="plan__title">{ title }</h3>
          <span className="plan__price"><span>Add existing or generate</span></span>

          {
            !active ? children : (
              <>
                <div className="inputs-block">
                  <Input className="input" useFormData={mnemonicPhraseUseFormData} disabled={nextStepButtonsVisible} placeholder={'Phrase'}/>
                  <InputPassword useFormData={mnemonicPasswordUseFormData} disabled={nextStepButtonsVisible} placeholder={'Password'} />
                </div>

                <div className="buttons-block">
                  <Button type="submit" className="btn btn--success" disabled={!isValid || nextStepButtonsVisible}>Generate</Button>
                  { nextStepButtonsVisible
                    ? <>
                        <Button className="btn btn--success" onClick={(e) => toDownloadKeyJson(e)}>
                          Download KeyJson File
                        </Button>
                        <Button className="btn btn--success" onClick={toNext}>Next</Button>
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
