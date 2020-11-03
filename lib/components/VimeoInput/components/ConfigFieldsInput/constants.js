export const CONFIGURATION_FIELD_TYPES = {
  BOOLEAN: "boolean",
  STRING: "string"
};

export const CONFIGURATION_FIELDS = [
  {
    argument: "api",
    default: true,
    description: "Whether to enable the Vimeo player SDK.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "autopause",
    default: true,
    description: "Whether to pause the current video when another Vimeo video on the same page starts to play.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "autoplay",
    default: false,
    description: "Whether to start playback of the video automatically. This feature might not work on all devices.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "background",
    default: false,
    description: "For videos on a Vimeo Plus account or higher: whether to hide all video controls, loop the video automatically, enable autoplay, and mute the video. The loop and autoplay behaviors can't be overridden, but the mute behavior can be; see the muted argument below.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "byline",
    default: true,
    description: "Whether to display the video owner's name.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "callback",
    default: null,
    description: "The name of JavaScript function to use as the callback parameter of a JSONP call. The indicated function wraps the JSON response.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "controls",
    default: true,
    description: "Whether to display (true) or hide (false) all interactive elements in the player interface. To start video playback when controls are hidden, set autoplay to true or use our player API. This argument is available only for Vimeo Pro and Business accounts.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "color",
    default: null,
    description: "The hexadecimal color value of the video controls, which is normally 00ADEF.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "dnt",
    default: false,
    description: "Whether to prevent the player from tracking session data, including cookies. Keep in mind that setting this argument to true also blocks video stats.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "fun",
    default: true,
    description: "Whether to disable informal error messages in the player, such as Oops.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "height",
    default: null,
    description: "The height of the video in pixels.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "loop",
    default: false,
    description: "Whether to restart the video automatically after reaching the end.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "maxheight",
    default: null,
    description: "The height of the video in pixels, where the video won't exceed its native height, no matter the value of this field.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "maxwidth",
    default: null,
    description: "The width of the video in pixels, where the video won't exceed its native width, no matter the value of this field.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "muted",
    default: false,
    description: "Whether to mute playback by default. The user can increase the volume manually.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "player_id",
    default: null,
    description: "The unique ID for the player, which comes back with all JavaScript API responses.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "playsinline",
    default: true,
    description: "Whether the video plays inline on supported mobile devices.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "portrait",
    default: true,
    description: "Whether to display the video owner's portrait.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "quality",
    default: "auto",
    description: "For videos on a Vimeo Plus account or higher: the playback quality of the video. Use auto for the best possible quality given available bandwidth and other factors. You can also specify 360p, 540p, 720p, 1080p, 2k, and 4k.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "responsive",
    default: false,
    description: "Whether to return a responsive embed code, or one that provides intelligent adjustments based on viewing conditions. We recommend this option for mobile-optimized sites.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "speed",
    default: false,
    description: "For videos on a Vimeo Plus account or higher: whether to include playback speed among the player preferences.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "texttrack",
    default: null,
    description: "The text track to display with the video. Specify the text track by its language code (en), the language code and locale (en-US), or the language code and kind (en.captions). For this argument to work, the video must already have a text track of the given type; see our Help Center or Working with Text Track Uploads for more information.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "title",
    default: true,
    description: "Whether to display the video's title.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "transparent",
    default: true,
    description: "Whether the background of the player area is transparent on Vimeo. When this value is false, the background of the player area is black. Depending on the video's aspect ratio, there might be visible black bars around the video.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  },
  {
    argument: "width",
    default: null,
    description: "The width of the video in pixels.",
    type: CONFIGURATION_FIELD_TYPES.STRING
  },
  {
    argument: "xhtml",
    default: false,
    description: "Whether to make the embed code XHTML-compliant.",
    type: CONFIGURATION_FIELD_TYPES.BOOLEAN
  }
];
