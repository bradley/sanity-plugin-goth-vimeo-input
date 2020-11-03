import schemaTypes from "all:part:@sanity/base/schema-type";
import createSchema from "part:@sanity/base/schema-creator";

import vimeoOEmbedConfigData from "./objects/vimeoOEmbedConfigData";
import vimeoOEmbedData from "./objects/vimeoOEmbedData";
import vimeoVideo from "./objects/vimeoVideo";

const schema = createSchema({
  name: "default",
  types: schemaTypes.concat([
    vimeoOEmbedConfigData,
    vimeoOEmbedData,
    vimeoVideo,
  ])
});

export default schema;
