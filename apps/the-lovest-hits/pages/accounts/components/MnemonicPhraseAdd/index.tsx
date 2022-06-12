import { useForm } from "react-hook-form";
import { useState } from "react";
import { CubeEntity } from "../../add";
import Input from "../../../../components/page-elements/input";
import Button from "../../../../components/page-elements/button";
import InputPassword from "../../../../components/page-elements/input-password";

export enum MnemonicFormFields {
  Phrase = "phrase",
  Password = "password",
}

function MnemonicPhraseAdd({className, active, children, setActiveCube, title}) {
  const [nextStepButtonsVisible, setNextStepButtonsVisible] = useState(false);
  const {register, setValue, handleSubmit, formState: { isValid }} = useForm({mode: 'onChange'});

  const mnemonicPhraseUseFormData = {...register(MnemonicFormFields.Phrase, {required: true})};
  const mnemonicPasswordUseFormData = {...register(MnemonicFormFields.Password, {required: true})};

  const toFormSubmit = (data, e) => {
    setNextStepButtonsVisible(true);

    e.preventDefault();
  }

  const toNext = () => {
    // setActiveCube(CubeEntity.MnemonicPhraseAdd)

    setValue(MnemonicFormFields.Phrase, null, { shouldValidate: true });
    setValue(MnemonicFormFields.Password, null, { shouldValidate: true });

    setNextStepButtonsVisible(false);
  };

  const toDownloadKeyJson = e => {
    // setActiveCube(CubeEntity.UploadKeyFile)
    e.stopPropagation();
  };

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
