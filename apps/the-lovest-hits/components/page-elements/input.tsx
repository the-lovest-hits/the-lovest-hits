import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

export interface InputProps {
  className: string;
  useFormData: UseFormRegisterReturn;
  disabled: boolean;
}

function Input({className, useFormData, disabled = false}: Partial<InputProps>) {
  const classes = `${className}`;

  return (
    <input
      className={classes}
      {...useFormData}
      disabled={disabled}
    />
  )
}

export default Input;
