module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [
            "defaults",
            "ie >= 11"
          ]
        },
      }
    ],
  ],
};