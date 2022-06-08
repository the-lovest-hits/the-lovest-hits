import { UseFormRegisterReturn } from "react-hook-form/dist/types/form";

export interface InputProps {
  type: 'text' | 'password';
  className: string;
  useFormData: UseFormRegisterReturn;
  disabled: boolean;
  placeholder: string;
}

function Input({type, className, useFormData, disabled = false, placeholder}: Partial<InputProps>) {
  const classes = `${className}`;

  return (
    <input
      type={type}
      className={classes}
      {...useFormData}
      disabled={disabled}
      placeholder={placeholder}
    />
  )
}

export default Input;
