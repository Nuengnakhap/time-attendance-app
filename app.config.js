import "dotenv/config";

export default ({ config }) => ({
  ...config,
  ios: { config: { googleMapsApiKey: process.env.MAP_API_KEY } },
  android: { config: { googleMaps: { apiKey: process.env.MAP_API_KEY } } },
  extra: { mapsApiKey: process.env.MAP_API_KEY },
});
