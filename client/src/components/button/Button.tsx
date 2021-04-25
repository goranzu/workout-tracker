import React from "react";
import classes from "./button.module.css";

type ButtonProps = {
  type?: "button" | "submit";
  children: React.ReactNode;
  onClick?: (e: any) => void;
  variant?: "small" | "regular";
};

export default function Button({
  type = "button",
  children,
  onClick,
  variant = "regular",
}: ButtonProps): JSX.Element {
  const cssClass =
    variant === "regular"
      ? `${classes.button}`
      : `${classes.button} ${classes.button__small}`;

  console.log(variant);

  return (
    <button onClick={onClick} type={type} className={cssClass}>
      {children}
    </button>
  );
}
