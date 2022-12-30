module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      [
        "module-resolver",
        {
          alias: {
            "@screens": "./screens",
            "@hooks": "./hooks",
            "@contexts": "./contexts",
            "@components": "./components",
            "@constants": "./constants",
            "@navigation": "./navigation",
            "@assets": "./assets",
            "@configs": "./configs",
          },
        },
      ],
    ],
  };
};
