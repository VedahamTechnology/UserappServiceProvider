const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withNativeWind } = require('nativewind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {
  resolver: {
    // Ignore transient build artifacts to prevent Metro from crashing during native builds
    blockList: [
      /.*\/android\/build\/.*/,
      /.*\/android\/\.cxx\/.*/,
      /.*\/ios\/build\/.*/,
      /.*\/node_modules\/.*\/android\/build\/.*/,
      /.*\/node_modules\/.*\/android\/\.cxx\/.*/,
    ],
  },
};

module.exports = withNativeWind(mergeConfig(getDefaultConfig(__dirname), config), {
  input: './global.css',
});
