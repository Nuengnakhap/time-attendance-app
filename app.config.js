import "dotenv/config";

export default ({ config }) => ({
  ...config,
  ios: {
    ...config.ios,
    config: { googleMapsApiKey: process.env.MAP_API_KEY },
  },
  android: {
    ...config.android,
    config: { googleMaps: { apiKey: process.env.MAP_API_KEY } },
  },
  runtimeVersion: {
    policy: "sdkVersion",
  },
  updates: {
    fallbackToCacheTimeout: 0,
    url: "https://u.expo.dev/e3cb49a6-14c2-45ed-88eb-9cc6db2d7a0b",
  },
  extra: {
    mapsApiKey: process.env.MAP_API_KEY,
    eas: {
      projectId: "e3cb49a6-14c2-45ed-88eb-9cc6db2d7a0b",
    },
  },
});
