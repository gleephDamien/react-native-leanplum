
const path = require('path');
module.exports = {
    dependency: {
       platforms: {
         android:{
         packageImportPath: 'import com.reactnativeleanplum.RNLeanplumPackage;',
           packageInstance:"new RNLeanplumPackage(getApplication())"
         },
         ios: {

             podspecPath:path.join(__dirname, 'react-native-leanplum.podspec')
         }
       }
    },
};
