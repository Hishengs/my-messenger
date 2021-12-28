module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: {
          browsers: [
            "defaults",
            "ie >= 9"
          ]
        },
        // useBuiltIns: "entry",
        // corejs: "3.20.1",
      }
    ],
  ],
};