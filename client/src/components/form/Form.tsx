import React from "react";
import classes from "./form.module.css";

type FormProps = {
  method?: "POST";
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
};

export default function Form({
  method,
  children,
  onSubmit,
  isLoading,
}: FormProps): JSX.Element {
  return (
    <form onSubmit={onSubmit} method={method} className={classes.form}>
      <fieldset disabled={isLoading} className={classes.fieldset}>
        {children}
      </fieldset>{" "}
    </form>
  );
}
