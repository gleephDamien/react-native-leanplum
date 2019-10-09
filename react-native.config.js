
const path = require('path');
module.exports = {
    dependency: {
       platforms: {
         android:{
           packageInstance:"new RNLeanplumPackage(MainApplication.this)",
         },
         ios: {

             podspecPath:path.join(__dirname, 'react-native-leanplum.podspec')
         }
       }
    },
};
