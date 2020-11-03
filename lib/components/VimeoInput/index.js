import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from "react";
import Axios from "axios";
import { uniqueId } from "lodash";
import WarningIcon from "part:@sanity/base/warning-icon";
import Alert from "part:@sanity/components/alerts/alert";
import Button from "part:@sanity/components/buttons/default";
import TextInput from "part:@sanity/components/textinputs/default";
import FormField from "part:@sanity/components/formfields/default";
import Fieldset from "part:@sanity/components/fieldsets/default";
import {
  FormBuilderInput,
  PatchEvent,
  patches,
  withDocument
} from "part:@sanity/form-builder";

import ConfigFieldsInput from "./components/ConfigFieldsInput";
import { Description, Label, Title } from "./components/Label";
import styles from "./styles/VimeoInput.css";

const O_EMBED_CONFIG_DATA_FIELD_NAME = "oEmbedConfigData";
const O_EMBED_DATA_FIELD_NAME = "oEmbedData";

const client = Axios.create({
  baseURL: "https://vimeo.com/api",
});

const VimeoInput = React.forwardRef((props, ref) => {
  const { focusPath, level, markers, onChange, type, value } = props;

  const configFieldsInputId =
    useMemo(() => uniqueId("video-o-embed-data__config-fields-input"), []);
  const urlSearchInputId =
    useMemo(() => uniqueId("video-o-embed-data__url-search-input"), []);
  const videoIdInputId =
    useMemo(() => uniqueId("video-o-embed-data__video-id-input"), []);
  const videoTitleInputId =
    useMemo(() => uniqueId("video-o-embed-data__video-title-input"), []);

  const oEmbedConfigDataField =
    type.fields.find(field => field.name === O_EMBED_CONFIG_DATA_FIELD_NAME);
  const oEmbedDataField =
    type.fields.find(field => field.name === O_EMBED_DATA_FIELD_NAME);

  const initialUrl = (value && value.url) ? value.url : "";

  const [
    didErrorFetching,
    setDidErrorFetching
  ] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fetchTrigger, setFetchTrigger] = useState(null);
  // `resolvedUrl` is used for keeping track of the initial url and updates to
  // the url that take place upon patch events (e.g.; when the search URL form
  // is submitted).
  const [resolvedUrl, setResolvedUrl] = useState(initialUrl);
  // `url` is used for keeping track of the url as represented in the search URL
  // form as the user types within it.
  const [url, setUrl] = useState(initialUrl);
  // `configIsDirty` is used to keep track of the saved state of the config
  // against the `resolvedUrl`. This is important because the returned `oEmbed`
  // data we get back for the `resolvedUrl` will have details that differ
  // according to the passed configuration payload, and we want to know when
  // our config values change so that we can prompt the user to re-resolve the
  // search URL.
  const [configIsDirty, setConfigIsDirty] = useState(false);
  // `configFieldValues` is used to hold the transient states of configuration
  // values, initially set from the persisted `oEmbedConfigDataField`. We dont
  // actually update the `oEmbedConfigDataField` until _after_ the search URL
  // is re-resolved so that we can always prompt our user to changes while
  // accurately showing config values that reflect the saved `oEmbed` data
  // (e.g.; a page refresh should refresh config values to their saved state
  // until the search URL is re-resolved (searched)).
  const [configFieldValues, setConfigFieldValues] = useState(() => {
    const initialConfigFieldValues =
      (value && value[O_EMBED_CONFIG_DATA_FIELD_NAME])
        ? value[O_EMBED_CONFIG_DATA_FIELD_NAME]
        : {};

    let configFieldValues = {};

    if (type.options && type.options.configurableFields) {
      configFieldValues = type.options.configurableFields
        .reduce((obj, configurableField) => {
          obj[configurableField] =
            initialConfigFieldValues[configurableField];

          if (
            obj[configurableField] == null &&
            type.options.defaultFieldValues[configurableField] != null
          ) {
            obj[configurableField] =
              type.options.defaultFieldValues[configurableField];
          }

          return obj;
        }, {});
    }

    return configFieldValues;
  });

  const urlRef = useRef(url);
  const searchUrlInputRef = useRef(null);

  useImperativeHandle(ref, () => ({
    focus: focusSearchUrlInput
  }));

  useEffect(() => {
    urlRef.current = url;
  }, [url]);

  useEffect(() => {
    if (!fetchTrigger) { return; }

    const cancelSource = Axios.CancelToken.source();
    let artificialTimeout; // Used to add a little tactile feeling to button.

    const fetch = () => {
      const url = urlRef.current;

      let configuration = {};

      if (type.options && type.options.defaultFieldValues) {
        configuration = type.options.defaultFieldValues;
      }

      if (configFieldValues) {
        configuration = { ...configuration, ...configFieldValues };
      }

      configuration.background = !configuration.controls;

      client.get("/oembed.json", {
        params: {
          url,
          ...configuration
        },
        options: {
          cancelToken: cancelSource.cancelToken
        }
      })
        .then(res => handleFetchSuccess(url, configuration, res))
        .catch(handleFetchError)
        .finally(() => {
          setFetching(false);
        })
    };

    setFetching(true);
    artificialTimeout = setTimeout(fetch, 500);

    return () => {
      cancelSource.cancel();
      clearTimeout(artificialTimeout);
    }
  }, [fetchTrigger]);

  const handleFetchSuccess = useCallback(
    (url, configuration, { data, status }) => {
      if (!status || status !== 200) {
        setDidErrorFetching(true);
        return;
      }

      const doc = {
        _type: type.name,
        url: url,
        oEmbedDataLastFetchedAt: new Date().toISOString(),
        oEmbedDataJsonResponse: JSON.stringify(data)
      };

      // Set values for oEmbedConfigData.
      doc[O_EMBED_CONFIG_DATA_FIELD_NAME] =
        Object.entries(configuration).reduce(
          (obj, [configFieldName, configFieldValue]) => {
            const configSchemaField =
              oEmbedConfigDataField.type.fields.find(
                field => field.name === configFieldName
              );

            if (!configSchemaField) {
              console.log("throwing away %s", configFieldName);
              return obj;
            }

            if (configSchemaField.type.jsonType === "number") {
              configFieldValue = Number(configFieldValue);
            }

            obj[configFieldName] = configFieldValue;

            return obj;
          }, {}
        );

      // Set values for oEmbedData.
      doc[O_EMBED_DATA_FIELD_NAME] =
        oEmbedDataField.type.fields.reduce(
          (obj, field) => {
            let fieldValue = data[field.name];

            if (!fieldValue) {
              return obj;
            }

            if (field.type.jsonType === "number") {
              fieldValue = Number(fieldValue);
            }

            obj[field.name] = fieldValue;

            return obj;
          }, {}
        );

      onChange(PatchEvent.from(patches.set(doc)));
      setResolvedUrl(url);
      setConfigIsDirty(false);
      setDidErrorFetching(false);
    },
    [oEmbedDataField]
  );

  const handleFetchError = useCallback((err) => {
    console.error(err);

    onChange(PatchEvent.from(patches.unset()));
    setResolvedUrl("");
    setDidErrorFetching(true);
  }, []);

  const handleConfigFieldValueChange = ({ field, value }) => {
    setConfigFieldValues({ ...configFieldValues, [field]: value });
    setConfigIsDirty(true);
  };

  const handleUrlSearchChange = ({ target: { value } }) => {
    setUrl(value);
  };

  const handleFetchClicked = () => {
    setFetchTrigger(+new Date());
  };

  const focusSearchUrlInput = () => {
    searchUrlInputRef.current.focus();
  };

  return (
    <Fieldset
      description={type.description}
      legend={type.title}
      markers={markers || []}
    >
      <ConfigFieldsInput
        inputId={configFieldsInputId}
        configFields={configFieldValues}
        disabled={fetching}
        defaultFieldValues={
          (type.options && type.options.defaultFieldValues)
            ? type.options.defaultFieldValues
            : {}
        }
        onFieldValueChange={handleConfigFieldValueChange}
      />
      {
        configIsDirty && (
          <div className={styles.warningMessage}>
            <Alert
              color="warning"
              icon={WarningIcon}
              title="Must Reload Vimeo Video!"
            >
              Changing configuration data requires that you re-load the Vimeo
              video. If you are using the same video as before and just
              updating configuration values, you just need to click "Load"
              again below.
            </Alert>
          </div>
        )
      }
      <div>
        <Label htmlFor={urlSearchInputId}>
          <Title>
            Load Vimeo Video by URL
          </Title>
          <Description>
            Input a valid Vimeo video URL and click to "Load" it. Once
            loaded, data necessary for embedding the video will be populated
            and may be saved.
          </Description>
        </Label>
        <div className={styles.search}>
          <div className={styles.input}>
            <TextInput
              ref={searchUrlInputRef}
              disabled={fetching}
              inputId={urlSearchInputId}
              onChange={handleUrlSearchChange}
              placeholder="Load Vimeo Video by URL"
              type="url"
              value={url === undefined ? "" : url}
            />
          </div>
          <Button
            className={styles.button}
            disabled={fetching}
            kind="default"
            loading={fetching}
            onClick={handleFetchClicked}
          >
            { fetching ? "Loading..." : "Load" }
          </Button>
        </div>
        {
          didErrorFetching && (
            <div className={styles.warningMessage}>
              <Alert
                color="warning"
                icon={WarningIcon}
                title="Failed to load Vimeo Video!"
              >
                The Vimeo video URL you attempted to load is either invalid or
                could not be found.
              </Alert>
            </div>
          )
        }
      </div>
      {
        resolvedUrl && (
          <React.Fragment>
            <div>
              <Label htmlFor={videoTitleInputId}>
                <Title>
                  Vimeo Video Title
                </Title>
              </Label>
              <TextInput
                disabled={true}
                inputId={videoTitleInputId}
                type="text"
                readOnly={true}
                value={
                  (value && value[O_EMBED_DATA_FIELD_NAME])
                    ? value[O_EMBED_DATA_FIELD_NAME]["title"]
                    : ""
                }
              />
            </div>
            <div>
              <Label htmlFor={videoIdInputId}>
                <Title>
                  Vimeo Video Thumbnail
                </Title>
              </Label>
              <img
                alt={"Video Thumbnail"}
                className={styles.thumbnail}
                src={
                  (value && value[O_EMBED_DATA_FIELD_NAME])
                    ? value[O_EMBED_DATA_FIELD_NAME]["thumbnail_url"]
                    : ""
                }
              />
            </div>
          </React.Fragment>
        )
      }
    </Fieldset>
  );
});

export default VimeoInput;
