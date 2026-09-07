const { withDangerousMod, WarningAggregator } = require('@expo/config-plugins');
const fs = require('fs');
const path = require('path');

/**
 * Custom Expo config plugin to add Firebase initialization to Swift AppDelegate.
 * Required because @react-native-firebase/app v17 only supports Objective-C AppDelegate.
 * Expo SDK 54 + RN 0.81 generates Swift AppDelegate by default.
 */
const withFirebaseSwiftAppDelegate = (config) => {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const projectRoot = config.modRequest.projectRoot;
      const iosDir = path.join(projectRoot, 'ios');

      // Find AppDelegate.swift
      let appDelegatePath = null;
      const projectName = config.modRequest.projectName;
      const candidate = path.join(iosDir, projectName, 'AppDelegate.swift');
      if (fs.existsSync(candidate)) {
        appDelegatePath = candidate;
      } else {
        // Fallback: search for AppDelegate.swift recursively (max 2 levels)
        const entries = fs.readdirSync(iosDir);
        for (const entry of entries) {
          const dir = path.join(iosDir, entry);
          if (fs.statSync(dir).isDirectory()) {
            const swiftFile = path.join(dir, 'AppDelegate.swift');
            if (fs.existsSync(swiftFile)) {
              appDelegatePath = swiftFile;
              break;
            }
          }
        }
      }

      if (!appDelegatePath) {
        WarningAggregator.addWarningIOS(
          'with-firebase-swift',
          'AppDelegate.swift not found. Skipping Firebase initialization injection.'
        );
        return config;
      }

      let contents = fs.readFileSync(appDelegatePath, 'utf8');

      // Skip if already injected
      if (contents.includes('FirebaseApp.configure()') || contents.includes('FirebaseCore')) {
        return config;
      }

      // Add FirebaseCore import after last import line
      if (!contents.includes('import FirebaseCore')) {
        contents = contents.replace(
          /(import\s+\w+[^\n]*\n)(?!import)/,
          (match) => match + 'import FirebaseCore\n'
        );
      }

      // Inject FirebaseApp.configure() at the start of didFinishLaunchingWithOptions
      // Pattern matches the Swift function signature
      const swiftDidFinishPattern = /(func application\s*\(_\s*application\s*:\s*UIApplication\s*,\s*didFinishLaunchingWithOptions[^{]*\{)/;
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

      fs.writeFileSync(appDelegatePath, contents, 'utf8');
      return config;
    },
  ]);
};

module.exports = withFirebaseSwiftAppDelegate;
