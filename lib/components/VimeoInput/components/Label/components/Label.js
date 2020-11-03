import React from "react";
import formFieldStyles from "part:@sanity/components/formfields/default-style";

/* Label
 *
 * This component and its sub-components, Title and Description, essentially
 * mimic the current makeup of labels and descriptions for fields provided
 * within Sanity's `DefaultFormField`. However, due to a combination of Sanity
 * lacking better documentation for building complicated custom input components
 * and to Sanity's various existing components doing **magic** on the backend
 * in an attempt to hook some of its components into its own stores, it was
 * simply not an option to use the `DefaultFormField` in order to *just* get the
 * form field's label styling. Therefore, we had to cut it out ourselves. Enjoy!
 *
 * See: https://github.com/sanity-io/sanity/blob/next/packages/%40sanity/components/src/formfields/DefaultFormField.tsx
 */
const Label = props => {
  const { children, htmlFor } = props;

  return (
    <label className={formFieldStyles.inner} htmlFor={htmlFor}>
      <div className={formFieldStyles.header}>
        <div className={formFieldStyles.headerMain}>
          { children }
        </div>
      </div>
    </label>
  );
};

export default Label;
