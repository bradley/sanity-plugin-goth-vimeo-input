import React from "react";
import Fieldset from "part:@sanity/components/fieldsets/default";

import Switch from "./components/Switch";
import TextInput from "./components/TextInput";

import { CONFIGURATION_FIELD_TYPES, CONFIGURATION_FIELDS } from "./constants";

const ConfigFieldsInput = (props, ref) => {
  const {
    configFields,
    disabled,
    defaultFieldValues,
    inputId,
    onFieldValueChange
  } = props;

  const renderedFields = Object.entries(configFields).map(([configFieldName, configFieldValue], i) => {
    const configFieldSettings = CONFIGURATION_FIELDS.find(configFieldSettings =>
      configFieldSettings.argument === configFieldName
    );

    if (!configFieldSettings) {
      console.error(
        `Could not locate a known configuration field for name ${ configFieldName }`
      );
      return null;
    }

    const fieldId = `${ inputId }__field-${ i }`;

    const fieldValue = configFieldValue == null
      ? (
        (configFieldName in defaultFieldValues)
          ? defaultFieldValues[configFieldName]
          : configFieldSettings.default
      )
      : configFieldValue;

    switch (configFieldSettings.type) {
      case CONFIGURATION_FIELD_TYPES.BOOLEAN:
        return (
          <Switch
            key={fieldId}
            checked={fieldValue}
            disabled={disabled}
            description={configFieldSettings.description}
            fieldId={fieldId}
            label={configFieldName}
            name={configFieldName}
            onChange={value => {
              onFieldValueChange({ field: configFieldName, value: value });
            }}
          />
        );
        break;
      case CONFIGURATION_FIELD_TYPES.STRING:
        return (
          <TextInput
            key={fieldId}
            description={configFieldSettings.description}
            fieldId={fieldId}
            name={configFieldName}
            label={configFieldName}
            disabled={disabled}
            onChange={value => {
              onFieldValueChange({ field: configFieldName, value: value });
            }}
            value={fieldValue}
          />
        );
        break;
      default:
        return null;
    }
  });

  if (renderedFields.length === 0) {
    return null;
  }

  return (
    <Fieldset
      isCollapsed={false}
      isCollapsible
      legend="Configure Video"
    >
      { renderedFields }
    </Fieldset>
  );
};

export default ConfigFieldsInput;
