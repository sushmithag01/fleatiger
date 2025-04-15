# fleatiger_App

"email":"sushmitha.g@iverbinden.com",
"password":"Admin123$"

To GENERATE APK FILE --> create a new folder inside main

1. android/app/src/main/assets/index.android.bundle
2. Run in terminal —> npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
3. Run in terminal —> cd android && ./gradlew assembleDebug or ./gradlew assembleRelease or ./gradlew app:assembleRelease

Generated APK --> FILE LOCATION --> android/app/build/outputs/apk/debug/app-debug.apk

<!-- to git -->

git rm -r --cached .
git add .
git commit -m ""
git push

npm i
npx react-native start --reset-cache <!--to run the project  -->
xed ios <!-- to open the xcode -->
npx kill-port 8081  <!-- to kill the port -->
npm cache clean --force

adb logcat | grep -i "your.package.name" <!-- help identify any runtime errors causing the app to crash. -->

<!-- keystore  -->
keytool -list -v -keystore android/app/my-upload-key.keystore
keystore password : Fleatiger@2023
Alias name: my-key-alias

<!-- clear simulator cache -->

xcrun simctl erase all
xcrun simctl shutdown all <!-- restart or shutdown all simulator  -->



<!-- upgrade to new version -->
npx react-native upgrade
npx react-native -version
https://gradle.org/install/


<!-- pod cache clean -->
rm -rf ~/Library/Caches/CocoaPods
rm -rf ~/Library/Developer/Xcode/DerivedData/*
pod cache clean --all
pod setup
pod install

xcrun simctl list devices <!-- list of devices -->
npx react-native run-ios --device "iPhone 15"  <!-- perticular simulator device  -->
npx react-native log-ios  <!-- check logs  -->
killall -9 node <!-- Kill any instances of the development server -->


<!-- to create a simulator with ios version -->

xcrun simctl list devicetypes
xcrun simctl list runtimes

<!-- to clean the project -->
 npx react-native-clean-project clean-project-auto


 watchman watch-del-all &&
rm -rf node_modules &&
rm -rf ios/build &&
rm -rf ios/Pods &&
rm -rf ios/Podfile.lock &&
rm -rf android/build &&
npm cache clean --force &&
npm install &&
cd ios && pod install && cd .. 


rvm use system



pet credentials

JAX 
email : sushmithag@iverbinden.com
password : Admin123$


oreo1
email: sushmitha.g@iverbinden.com
password : Admin123$

cookie
email: sushmitha.g@gmail.com
password : Admin123$