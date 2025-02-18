import React from "react";
import "./RequiredFieldExplanation.scss";

const RequiredFieldExplanation = () => {
  return (
    <span className="required-note" aria-hidden="true">
      <span className="required">*</span> - required
    </span>
  );
};

export default React.memo(RequiredFieldExplanation);
