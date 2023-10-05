const config = require('@tpr/lint/node-basic');

const { parserOptions, ...other } = config;

module.exports = {
  ...other,
  parserOptions: {
    ...parserOptions,
    project: require.resolve('./tsconfig.json'),
  },
};
