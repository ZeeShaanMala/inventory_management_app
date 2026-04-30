module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./frontend/src'],
        alias: {
          '@components': './frontend/src/components',
          '@screens': './frontend/src/screens',
          '@navigation': './frontend/src/navigation',
          '@store': './frontend/src/store',
          '@utils': './frontend/src/utils',
          '@services': './frontend/src/services'
        }
      }
    ],
    'react-native-reanimated/plugin' // ⚠️ ALWAYS LAST
  ]
};