import type { PropsWithChildren } from "react";
import React from "react";

export interface MatIconProps {
  fontSize?: string;
}

const MatIcon = ({
  children,
  fontSize = "1em",
}: PropsWithChildren<MatIconProps>) => {
  return (
    <span
      aria-hidden="true"
      style={{ fontSize }}
      className="material-symbols-outlined"
    >
      {children}
    </span>
  );
};

export default React.memo(MatIcon);
