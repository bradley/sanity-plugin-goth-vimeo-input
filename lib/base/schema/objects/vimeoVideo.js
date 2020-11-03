import VimeoInput from "@sanity-plugin-vimeo-input/Components/VimeoInput";

const vimeoVideo = {
  name: "vimeoVideo",
  title: "Vimeo Video",
  type: "object",
  inputComponent: VimeoInput,
  fields: [
    {
      title: "Video Video URL",
      name: "url",
      type: "url"
    },
    {
      title: "oEmbed Data Last Fetched At",
      name: "oEmbedDataLastFetchedAt",
      type: "date"
    },
    {
      title: "oEmbed Data JSON Response",
      name: "oEmbedDataJsonResponse",
      type: "text"
    },
    {
      title: "oEmbed Data",
      name: "oEmbedData",
      type: "vimeoOEmbedData"
    },
    {
      title: "Configuration Data",
      name: "oEmbedConfigData",
      type: "vimeoOEmbedConfigData"
    }
  ]
};

export default vimeoVideo;
