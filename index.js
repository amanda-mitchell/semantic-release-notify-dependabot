const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

function readFileAsync(path, options) {
  return new Promise((resolve, reject) => {
    fs.readFile(path, options, (error, data) =>
      error ? reject(error) : resolve(data)
    );
  });
}

async function getDependabotOptions(
  pluginConfig,
  { env, nextRelease, cwd, logger }
) {
  const packageManager = pluginConfig.packageManager || 'npm_and_yarn';
  let packageName = pluginConfig.packageName;
  if (!packageName && packageManager === 'npm_and_yarn') {
    const packageJsonPath = path.join(
      pluginConfig.packageRoot || cwd,
      'package.json'
    );

    try {
      const packageJson = JSON.parse(
        await readFileAsync(packageJsonPath, { encoding: 'utf-8' })
      );
      packageName = packageJson.name;
    } catch (x) {
      // If we fail to load the package json,
      // we'll throw an error for missing the
      // package name, so we don't need to
      // do anything special here.
    }
  }

  if (!packageName) {
    throw new Error(
      "No package name specified. Either ensure that this value is included in package.json or specify explicitly in this plugin's configuration."
    );
  }

  const packageVersion = nextRelease.version;
  if (!packageVersion) {
    throw new Error('Next package version not found.');
  }

  token = env.DEPENDABOT_TOKEN || env.GITHUB_TOKEN || env.GH_TOKEN;
  if (!token) {
    throw new Error('Missing DEPENDABOT_TOKEN environment variable.');
  }

  return {
    token,
    body: {
      name: packageName,
      version: nextRelease.version,
      'package-manager': packageManager,
    },
  };
}

module.exports = {
  success: async (pluginConfig, context) => {
    const { token, body } = await getDependabotOptions(pluginConfig, context);

    const response = await fetch(
      'https://api.dependabot.com/release_notifications/private',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Personal ${token}`,
        },
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      context.logger.error('Unexpected API response');
      context.logger.error(await response.json());
      throw new Error(`Unexpected response code ${response.status}`);
    }
  },
};
