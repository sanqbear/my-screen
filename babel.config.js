module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@': './src',
          '@locales': './src/i18n',
        },
      },
    ],
    'react-native-reanimated/plugin',
  ],
};
