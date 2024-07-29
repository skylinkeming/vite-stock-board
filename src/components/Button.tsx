import { ReactElement, ReactNode } from "react";

const Button: (props: {
  children: ReactNode;
  classes?: string;
  onClick: () => void;
}) => ReactElement = ({ children, classes, onClick }) => {
  return (
    <button
      className={`text-white py-1 px-2 rounded w-full xl:w-auto flex items-center justify-center ${classes}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
