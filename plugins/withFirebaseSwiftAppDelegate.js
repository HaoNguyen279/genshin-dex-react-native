const path = require('path');
const fs = require('fs');

let configPlugins;
try {
  configPlugins = require('@expo/config-plugins');
} catch (_) {
  try {
    const expoPath = require.resolve('expo/package.json', { paths: [__dirname, process.cwd()] });
    const configPluginsPath = require.resolve('@expo/config-plugins', {
      paths: [path.dirname(expoPath)]
    });
    configPlugins = require(configPluginsPath);
  } catch (e) {
    throw new Error('Could not resolve @expo/config-plugins: ' + e.message);
  }
}

const { withDangerousMod, WarningAggregator, IOSConfig } = configPlugins;

/**
 * Custom Expo config plugin to add Firebase initialization to Swift AppDelegate.
 * Required because @react-native-firebase/app v17 only supports Objective-C AppDelegate.
 * Expo SDK 54 + RN 0.81 generates Swift AppDelegate by default.
 */
const withFirebaseSwiftAppDelegate = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      let fileInfo;
      try {
        fileInfo = IOSConfig.Paths.getAppDelegate(config.modRequest.projectRoot);
      } catch (e) {
        WarningAggregator.addWarningIOS(
          'with-firebase-swift',
          'Could not locate AppDelegate: ' + e.message
        );
        return config;
      }

      const { path: appDelegatePath, language } = fileInfo;
      if (language !== 'swift') {
        return config;
      }

      let contents = fs.readFileSync(appDelegatePath, 'utf8');

      if (contents.includes('FirebaseApp.configure()') && contents.includes('import FirebaseCore')) {
        return config;
      }

      if (!contents.includes('import FirebaseCore')) {
        contents = contents.replace(
          /(import\s+[^\n]+\n)(?!import)/,
          '$1import FirebaseCore\n'
        );
      }

      if (!contents.includes('FirebaseApp.configure()')) {
        const swiftDidFinishPattern = /(func application\s*\([\s\S]*?didFinishLaunchingWithOptions[\s\S]*?\{)/;
        if (swiftDidFinishPattern.test(contents)) {
          contents = contents.replace(
            swiftDidFinishPattern,
            '$1\n    FirebaseApp.configure()'
          );
        } else {
          WarningAggregator.addWarningIOS(
            'with-firebase-swift',
            'Could not find didFinishLaunchingWithOptions in AppDelegate.swift. Firebase may not initialize correctly.'
          );
        }
      }

      fs.writeFileSync(appDelegatePath, contents, 'utf8');
      return config;
    },
  ]);
};

module.exports = withFirebaseSwiftAppDelegate;

