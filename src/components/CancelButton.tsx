import { ButtonHTMLAttributes } from "react";
type CancelButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

const CancelButton = ({ children, ...props }: CancelButtonProps) => {
  return (
    <button {...props} className="bg-red-500 hover:bg-red-700">
      {children}
    </button>
  );
};

export default CancelButton;
