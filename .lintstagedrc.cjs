const quote = require("shell-quote").quote;

module.exports = {
  "*.{ts,tsx}": (filenames) => {
    return quote([
      "bun",
      "fix",
      ...filenames.map((filename) => `\`${filename}\``),
    ]);
  },
};
