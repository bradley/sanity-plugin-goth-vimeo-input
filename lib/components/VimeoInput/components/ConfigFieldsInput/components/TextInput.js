import React from "react";
import { uniqueId } from "lodash";
import DefaultTextInput from "part:@sanity/components/textinputs/default";

import { Description, Label, Title } from "../../Label";

const TextInput = (props, ref) => {
  const {
    description,
    disabled,
    fieldId,
    label,
    name,
    onChange,
    value
  } = props;

  const handleChange = ({ target }) => {
    onChange(target.value);
  };

  const inputId = uniqueId(`${ fieldId }__text-field`);

  return (
    <div>
      <Label htmlFor={inputId}>
        <Title>
          { label }
        </Title>
        <Description>
          { description }
        </Description>
      </Label>
      <DefaultTextInput
        disabled={disabled}
        inputId={inputId}
        type="text"
        onChange={handleChange}
        value={value || ""}
      />
    </div>
  );
};

export default TextInput;
