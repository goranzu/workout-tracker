import React from "react";
import classes from "./wrapper.module.css";

type WrapperProps = {
  children: React.ReactNode;
};

export default function Wrapper({ children }: WrapperProps): JSX.Element {
  return <div className={classes.wrapper}>{children}</div>;
}
