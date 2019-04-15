# React Native Leanplum Bridge

## install
```bash
npm install --save @gleeph/react-native-leanplum
react-native link @gleeph/react-native-leanplum
```

##configuration

###android

Add Leanplum keys into the AndroidManifest.xml file.

```xml
<meta-data android:name="com.reactnativeleanplum.APP_ID" android:value="insert here the leanplum APP ID" />
<meta-data android:name="com.reactnativeleanplum.DEV_KEY" android:value="insert here the leanplum Developpement key" />
<meta-data android:name="com.reactnativeleanplum.PROD_KEY" android:value="insert here the leanplum Production key" />
```
check the MainApplication.java file and replace : 

~~new RNLeanplumPackage()~~

 by
 
new RNLeanplumPackage(MainApplication.this)


###ios

Add Leanplum keys into the Info.plist file.

```xml
<key>LeanplumAppId</key>
<string>insert here the leanplum APP ID</string>
<key>LeanplumDevSecret</key>
<string>insert here the leanplum Developpement key</string>
<key>LeanplumProdSecret</key>
<string>insert here the leanplum Production key</string>
```