// Define suffix-less index module for unit tests
var Platform = require('react-native').Platform;
module.exports = (Platform.OS==='ios'&&require('./index.ios.js')) ||(Platform.OS==='android'&&require('./index.android.js')) ||({
  state: {},
  component: {}
});
