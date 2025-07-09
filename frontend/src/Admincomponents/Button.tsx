import React from "react";

interface ButtonProps {
  onClick?: () => void;
  className?: string;
  type?: "button" | "submit";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({ onClick, className, type = "button", children }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`px-4 py-2 rounded shadow transition transform hover:scale-105 ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
