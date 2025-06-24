const config = {
  name: "dob-formatting-age-calculation-wdk-capture-plugin",
  title:
    "Date of Birth and Age formatting Capture Plugin (with date known support)",
  description:
    "A Capture Plugin to calculate date of birth or age field depending of a 'date known' flag",
  type: "app",
  author: "EyeSeeTea team",

  entryPoints: {
    plugin: "./src/Plugin.tsx",
  },
};

module.exports = config;
