import React from "react";
import GenericSanityLabel from "part:@sanity/components/labels/default";
import formFieldStyles from "part:@sanity/components/formfields/default-style";

const Title = props => {
  const { children } = props;

  return (
    <div className={formFieldStyles.title}>
      <GenericSanityLabel className={formFieldStyles.label}>
        { children }
      </GenericSanityLabel>
    </div>
  );
};

export default Title;
