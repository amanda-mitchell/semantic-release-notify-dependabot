module.exports = {
  branches: ['main'],
  plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator',
    [
      '@amanda-mitchell/semantic-release-npm-multiple',
      { registries: { github: {}, public: {} } },
    ],
    require('./index'),
    '@semantic-release/github',
  ],
};
