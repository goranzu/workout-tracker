import React from "react";

type ErrorTextProps = {
  children: React.ReactNode;
  visible: boolean;
};

export default function ErrorText({
  children,
  visible,
}: ErrorTextProps): JSX.Element {
  return (
    <p className="fs-100 error-text" aria-hidden={!visible}>
      {children || "some placeholder text to prevent shifting"}
    </p>
  );
}
