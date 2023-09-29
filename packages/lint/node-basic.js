module.exports = {
  root: true,
  env: {
    browser: false,
    node: true,
  },
  extends: [
    'airbnb-base',
    // Prettier goes last to turn off any rules related to formatting since they will conflict.
    'prettier',
  ],
  plugins: ['import', 'prettier'],
  rules: {
    // Prettier formatting is set in the .prettierrc file at the repo root
    'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    // Allow in for-loops. Elsewhere should use `+=`.
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    // This puts 'builtin', 'external', and 'internal' above all other import
    // types (the rest are grouped together). Also each group (the above 3 and
    // the 'the rest' group) has its impots alphabetized internally. This way
    // the import order should be deterministic. (Note that it is alphabetized
    // by the string you are importing from, not the name of the variable you
    // are importing).
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal'],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: '2022',
  },
};
