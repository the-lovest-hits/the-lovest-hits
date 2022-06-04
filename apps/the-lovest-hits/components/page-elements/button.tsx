import {ReactNode } from "react";

export interface ButtonProps {
  className: string;
  type: 'submit' | 'reset' | 'button' | undefined;
  disabled: boolean;
  children: ReactNode;
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

function Button({className, type='button', disabled=false, children=null, onClick=null}: Partial<ButtonProps>) {
  const classes = `${className}`;

  return (
    <button
      type={type}
      disabled={disabled}
      className={classes}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
