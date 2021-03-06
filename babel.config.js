module.exports = function(api) {
  api.cache(true);

  const config = {
    plugins: [
      [
        "babel-plugin-module-resolver",
        {
          "root": ["./"],
          "alias": {
            "@sanity-plugin-vimeo-input/Base": "./lib/base",
            "@sanity-plugin-vimeo-input/Components": "./lib/components",
          }
        }
      ],
      [
        "transform-imports", {
          "react-router": {
            "transform": "react-router/${member}",
            "preventFullImport": true
          }
        }
      ],
      "lodash",
      "transform-react-remove-prop-types"
    ],
    presets: [
      [
        "@babel/preset-env", {
          // Browsers with usage more than 1% global usage.
          "targets": "> 1%"
        }
      ],
      "@babel/preset-react"
    ]
  };

  return config;
}
