import React from "react";
import formFieldStyles from "part:@sanity/components/formfields/default-style";

const Description = props => {
  const { children } = props;

  return (
    <div className={formFieldStyles.description}>
      { children }
    </div>
  );
};

export default Description;
