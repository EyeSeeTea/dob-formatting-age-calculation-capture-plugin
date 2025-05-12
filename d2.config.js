const config = {
  name: "dob-formatting-age-calculation-capture-plugin",
  title: "Date of Birth and Age formatting Capture Plugin",
  description:
    "A Capture Plugin to validate and format date of birth and calculate age field.",
  type: "app",
  author: "EyeSeeTea team",

  entryPoints: {
    plugin: "./src/Plugin.tsx",
  },
};

module.exports = config;
