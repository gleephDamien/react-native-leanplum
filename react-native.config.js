
const path = require('path');
module.exports = {
    dependency: {
       platforms: {
         android:{
         packageImportPath: 'import com.reactnativeleanplum.RNLeanplumPackage;',
           packageInstance:"new RNLeanplumPackage(MainApplication.this)",
             sourceDir:'./android'
         },
         ios: {

             podspecPath:path.join(__dirname, 'react-native-leanplum.podspec')
         }
       }
    },
};
