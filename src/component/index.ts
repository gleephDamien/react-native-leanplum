// Define suffix-less index module for unit tests
import {Platform} from 'react-native';
let comp={
  state: {},
  component: {}
};
if(Platform.OS==='ios'){
  comp=require('./index.ios.js');
} else if(Platform.OS==='android'){
  comp=require('./index.android.js');
}
export default comp;