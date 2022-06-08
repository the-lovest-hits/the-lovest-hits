import { useState } from "react";
import Input from "./input";
import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

interface InputPasswordInputProps {
  useFormData: UseFormRegisterReturn;
  disabled: boolean;
  placeholder: string;
}

function InputPassword({useFormData, disabled, placeholder}: InputPasswordInputProps) {
  const [passwordShown, setPasswordShown] = useState(false);

  const togglePassword = (e) => {
    setPasswordShown(!passwordShown);

    e.preventDefault();
  };

  return (
    <div className={'password-input-container'}>
      <Input type={passwordShown ? "text" : "password"} className="input" useFormData={useFormData} disabled={disabled} placeholder={placeholder}/>

      <button className={'password-input-button'} onClick={togglePassword}>
        icon
      </button>
    </div>
  );
}

export default InputPassword;
