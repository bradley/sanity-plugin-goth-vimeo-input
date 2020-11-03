# Sanity Plugin Vimeo Input

* ???? `sanity-plugin-vimeo-input` was taken so it's named `sanity-plugin-goth-vimeo-input`.

A Sanity Plugin for Inputting Vimeo Videos by their URL and Pre-Loading oEmbed Data.

Through this plugin, your users will simply be required to input a valid Vimeo video URL. The plugin will use the [Vimeo oEmbed API](https://developer.vimeo.com/api/oembed) to then verify the video and import the full oEmbed payload for the video, which includes the video's title, ID, iFrame embed code, and thumbnail URL.

Additionally, the plugin allows the developer to set both defaults and available configuration options for the user to further customize the player included in the oEmbed response (e.g.; setting the video to autoplay or to use custom player control colors).

![Plugin Example](https://github.com/bradley/sanity-plugin-vimeo-input/blob/assets/images/simple-vimeo-input.gif)

## Install

While in your Sanity project directory, run the following command:

```
sanity install goth-vimeo-input
```

You can read more about Sanity Plugin usage in the [official guide](https://www.sanity.io/docs/plugins).


## Usage

#### Basic

To have your user simply input a Vimeo URL without additional configuration, you may include the `type`, `vimeoVideo`, in your schema without additional options.

```javascript
export default {
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    {
      name: "vimeoVideo",
      title: "Vimeo Video",
      type: "vimeoVideo",
      validation: Rule => Rule.required()
    },
  ],
  preview: {
    select: {
      vimeoVideo: "vimeoVideo"
    },
    prepare(selection) {
      let oEmbedData = selection.vimeoVideo
        ? selection.vimeoVideo.oEmbedData
        : {};

      return {
        title: oEmbedData.title || ""
      }
    }
  }
};
```

See: https://vimeo.com/475247102

#### With Configuration

To include additional configuration, you may utilize either or both of the options provided with this plugin: `configurableFields` and `defaultFieldValues`. The `configurableFields` option tells the plugin which of the [Vimeo oEmbed Arguments](https://developer.vimeo.com/api/oembed/videos) to allow your user to set when loading the video, and the `defaultFieldValues` option tells the plugin the default values for any such arguments (whether configurable by the user or not).

For example, the follow example will expose controls for toggling `autoplay` and `controls` on the player, and set default values for several other important oEmbed arugments:

```javascript
export default {
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    {
      name: "vimeoVideo",
      title: "Vimeo Video",
      type: "vimeoVideo",
      options: {
        configurableFields: [
          "autoplay",
          "controls"
        ],
        defaultFieldValues: {
          autopause: false,
          // Autoplay will also prevent the graceful loading of the player with
          // the blurred thumbnail. If you want autoplay but also to keep the
          // graceful thumbnail you should likely use javascript to trigger play
          // on load. Most libs for vimeo players, including the official
          // player.js from Vimeo, which you simply wrap around the iframe we
          // get back here, supports this.
          autoplay: true,
          // Keep this false. We can enable this effectively using other
          // options, and having it set to true prevents graceful loading of the
          // player with the blurred thumbnail.
          background: false,
          byline: false,
          controls: false,
          dnt: true,
          loop: true,
          muted: true,
          portrait: false,
          quality: "auto",
          title: false,
          // Load a reasonably large thumbnail up front. Note this will add
          // relevant width/height attributes to the iframe. If youre making
          // your player responsive on the frontend this will be ok, but keep
          // it in mind.
          width: "960"
        }
      },
      validation: Rule => Rule.required()
    },
  ],
  preview: {
    select: {
      vimeoVideo: "vimeoVideo"
    },
    prepare(selection) {
      let oEmbedData = selection.vimeoVideo
        ? selection.vimeoVideo.oEmbedData
        : {};

      return {
        title: oEmbedData.title || ""
      }
    }
  }
};
```

See: https://vimeo.com/475247026

## Additional Cases

#### User Updates to Configuration
> :warning: **Important**

The user will be asked to reload the video any time they make changes to configurable fields. This is because configuration options are used during the _request_ to Vimeo for oEmbed data, and as such updated configurations require an updated request to Vimeo. The plugin will alert the user to this automatically.

See: https://vimeo.com/475246939

#### Non-Existent Vimeo URLs / Fail Case
Should the user ever attempt to load a non-existent or errant Vimeo URL, the plugin will alert the user automatically.

See: https://vimeo.com/475247012

## Configuration

All configurable fields exposed through the `configurableFields` option match the configuration arguments available for use with [Vimeo's oEmbed API](https://developer.vimeo.com/api/oembed/videos). To expose a field for user configuration, simply add its name to the `configurableFields` array within the `options` object when adding the `vimeoVideo` type to your schema (see "Usage" section above). Further, each configurable field exposed to the user will include the description from the matching argument in Vimeo's API. To override any default value, use `defaultFieldValues` (see "Usage" section above).

This is taken directly from Vimeo's documentation:

<table>
  <thead>
    <tr><th>Argument</th><th>Default Value</th><th>Description</th></tr>
  </thead>
  <tbody>
    <tr><td><code>url</code></td><td>None</td><td>The URL of the video on Vimeo. This is a required value.</td></tr>
    <tr><td><code>api</code></td><td><code>true</code></td><td><span>Whether to enable the <a href="https://developer.vimeo.com/player/sdk"><span>Vimeo player SDK</span></a>.</span></td></tr>
    <tr><td><code>autopause</code></td><td><code>true</code></td><td>Whether to pause the current video when another Vimeo video on the same page starts to play.</td></tr>
    <tr><td><code>autoplay</code></td><td><code>false</code></td><td>Whether to start playback of the video automatically. This feature might not work on all devices.</td></tr>
    <tr><td><code>background</code></td><td><code>false</code></td><td><span>For videos on a Vimeo Plus account or higher: whether to hide all video controls, loop the video automatically, enable autoplay, and mute the video. The loop and autoplay behaviors can't be overridden, but the mute behavior can be; see the <strong>muted</strong> argument below.</span></td></tr>
    <tr><td><code>byline</code></td><td><code>true</code></td><td>Whether to display the video owner's name.</td></tr>
    <tr><td><code>callback</code></td><td>None</td><td>The name of JavaScript function to use as the callback parameter of a JSONP call. The indicated function wraps the JSON response.</td></tr>
    <tr><td><code>controls</code></td><td><code>true</code></td><td><span>Whether to display (<code>true</code>) or hide (<code>false</code>) all interactive elements in the player interface. To start video playback when controls are hidden, set <strong>autoplay</strong> to <code>true</code> or use our <a href="https://developer.vimeo.com/player/sdk/basics"><span>player API</span></a>. This argument is available only for Vimeo Pro and Business accounts.</span></td></tr>
    <tr><td><code>color</code></td><td>None</td><td><span>The hexadecimal color value of the video controls, which is normally <code>00ADEF</code>.</span></td></tr>
    <tr><td><code>dnt</code></td><td><code>false</code></td><td><span>Whether to prevent the player from tracking session data, including cookies. Keep in mind that setting this argument to <code>true</code> also blocks <a href="https://vimeo.com/stats"><span>video stats</span></a>.</span></td></tr>
    <tr><td><code>fun</code></td><td><code>true</code></td><td><span>Whether to disable informal error messages in the player, such as <em>Oops</em>.</span></td></tr>
    <tr><td><code>height</code></td><td>None</td><td>The height of the video in pixels.</td></tr>
    <tr><td><code>loop</code></td><td><code>false</code></td><td>Whether to restart the video automatically after reaching the end.</td></tr>
    <tr><td><code>maxheight</code></td><td>None</td><td>The height of the video in pixels, where the video won't exceed its native height, no matter the value of this field.</td></tr>
    <tr><td><code>maxwidth</code></td><td>None</td><td>The width of the video in pixels, where the video won't exceed its native width, no matter the value of this field.</td></tr>
    <tr><td><code>muted</code></td><td><code>false</code></td><td>Whether to mute playback by default. The user can increase the volume manually.</td></tr>
    <tr><td><code>player_id</code></td><td>None</td><td>The unique ID for the player, which comes back with all JavaScript API responses.</td></tr>
    <tr><td><code>playsinline</code></td><td><code>true</code></td><td>Whether the video plays inline on supported mobile devices.</td></tr>
    <tr><td><code>portrait</code></td><td><code>true</code></td><td>Whether to display the video owner's portrait.</td></tr>
    <tr><td><code>quality</code></td><td><code>auto</code></td><td><span>For videos on a Vimeo Plus account or higher: the playback quality of the video. Use <code>auto</code> for the best possible quality given available bandwidth and other factors. You can also specify 360p, 540p, 720p, 1080p, 2k, and 4k.</span></td></tr>
    <tr><td><code>responsive</code></td><td><code>false</code></td><td><span>Whether to return a <em>responsive embed code</em>, or one that provides intelligent adjustments based on viewing conditions. We recommend this option for mobile-optimized sites.</span></td></tr>
    <tr><td><code>speed</code></td><td><code>false</code></td><td>For videos on a Vimeo Plus account or higher: whether to include playback speed among the player preferences.</td></tr>
    <tr><td><code>texttrack</code></td><td>None</td><td><span>The text track to display with the video. Specify the text track by its language code (<code>en</code>), the language code and locale (<code>en-US</code>), or the language code and kind (<code>en.captions</code>). For this argument to work, the video must already have a text track of the given type; see our <a href="https://vimeo.zendesk.com/hc/en-us/articles/224968828"><span>Help Center</span></a> or <a href="https://developer.vimeo.com/api/upload/texttracks"><span>Working with Text Track Uploads</span></a> for more information.</span></td></tr>
    <tr><td><code>title</code></td><td><code>true</code></td><td>Whether to display the video's title.</td></tr>
    <tr><td><code>transparent</code></td><td><code>true</code></td><td>Whether the background of the player area is transparent on Vimeo. When this value is false, the background of the player area is black. Depending on the video's aspect ratio, there might be visible black bars around the video.</td></tr>
    <tr><td><code>width</code></td><td>None</td><td>The width of the video in pixels.</td></tr>
    <tr><td><code>xhtml</code></td><td><code>false</code></td><td>Whether to make the embed code XHTML-compliant.</td></tr>
  </tbody>
</table>


## Payload
Once loaded, a field of type `vimeoVideo` will include the following.

#### `url`
The Vimeo video [URL](https://www.sanity.io/docs/url-type) input by the user.

#### `oEmbedDataLastFetchedAt`
The last [date](https://www.sanity.io/docs/date-type) at which the user updated the oEmbed data for the video by clicking "load".

#### `oEmbedDataJsonResponse`
The raw JSON response, encoded as a string, returned by the Vimeo oEmbed API.

#### `vimeoOEmbedData`
All fields returned by the Vimeo oEmbed API, as individual Sanity fields within a sub-object on the sanity `vimeoVideo` object. See the source code [here](https://github.com/bradley/sanity-plugin-vimeo-input/blob/main/lib/base/schema/objects/vimeoOEmbedData.js) and "oEmbed response fields" [here](https://developer.vimeo.com/api/oembed/videos).

#### `vimeoOEmbedConfigData`
All configuration used by the plugin when the oEmbed data was last updated, as individual Sanity fields within a sub-object on the sanity `vimeoVideo` object. See the source code [here](https://github.com/bradley/sanity-plugin-vimeo-input/blob/main/lib/base/schema/objects/vimeoOEmbedConfigData.js).
