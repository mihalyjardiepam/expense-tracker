import type { PropsWithChildren } from "react";
import "./FormField.scss";
import React, { useEffect, useState } from "react";

export interface FormFieldProps extends PropsWithChildren {
  label: string;
  hint?: string;
  error?: string;
}

const FormField = ({ children, label, hint, error }: FormFieldProps) => {
  let required = false;

  React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      const props = (child as React.ReactElement<HTMLInputElement>).props;
      if (props.required) {
        required = true;
      }
    }
  });

  return (
    <div className="field-wrapper">
      <label className="form-field-label">
        <span>
          {label}
          {required && (
            <span className="required" aria-hidden="true">
              &nbsp;*
            </span>
          )}
        </span>
        {children}
      </label>
      {hint && <span className="hint">{hint}</span>}
      {error && <span className="error">{error}</span>}
    </div>
  );
};

export default React.memo(FormField);
