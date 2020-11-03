import React from "react";
import DefaultSwitch from "part:@sanity/components/toggles/switch";

const Switch = (props, ref) => {
  const { checked, description, disabled, label, name, onChange } = props;

  const handleChange = ({ target }) => {
    onChange(target.checked);
  };

  return (
    <DefaultSwitch
      description={description}
      disabled={disabled}
      checked={checked}
      label={name}
      name={name}
      onChange={handleChange}
    />
  );
};

export default Switch;
