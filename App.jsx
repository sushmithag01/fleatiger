import React, { useState, useRef, useEffect } from 'react';
import {
  NavigationContainer,
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from '@react-navigation/native';
import BottomTabNavigator from './navigation/TabNavigator';
import {
  AddActivityStackNavigator,
  AddNewMemberStackNavigator,
  HomeStackNavigator,
  MessagesStackNavigator,
  PublicStackNavigator,
  SubscriptionStackNavigator,
} from './navigation/StackNavigator';
import DrawerNavigator from './navigation/DrawerNavigator';
import 'react-native-gesture-handler';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  LogBox,
  Alert,
  AppState,
  Platform,
  Linking,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import TabNavigator from './navigation/TabNavigator';
import Home from './pages/Home';
import Onboarding1 from './pages/Onboarding1';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import NetInfo from '@react-native-community/netinfo';
import {
  acknowledgePurchaseAndroid,
  finishTransaction,
  getAvailablePurchases,
  getPurchaseHistory,
  setup,
  validateReceiptIos,
  withIAPContext,
} from 'react-native-iap';
import {
  GetPlanListApi,
  SubscribePlanApi,
  UserCurrentSubscriptionApi,
} from './pages/API/ApiCalls';
import moment from 'moment-timezone';
import { min } from 'react-native-reanimated';
import notifee, { EventType } from '@notifee/react-native';
import VersionCheck from 'react-native-version-check';
import SplashScreen from 'react-native-splash-screen';

let getAuthToken;
let getAuthPetCount;
let getAuthEmailVerified;

async function checkAuthUser() {
  getAuthToken = await AsyncStorage.getItem('token');
  getAuthEmailVerified = await AsyncStorage.getItem('userEmailVerified');
  getAuthPetCount = await AsyncStorage.getItem('userPetCount');
}

const App = () => {
  LogBox.ignoreAllLogs(true);

  const Stack = createNativeStackNavigator();
  const [authToken, setAuthToken] = useState('');
  const [authEmailVerified, setAuthEmailverified] = useState('');
  const [authPetCount, setAuthPetCount] = useState('');
  const [getCheckInternet, setCheckInternet] = useState(true);
  const appState = useRef(AppState.currentState);
  const __SANDBOX__ = true;

  useEffect(() => {
    checkAuthUser().then(() => {
      setAuthToken(getAuthToken);
      setAuthEmailverified(getAuthEmailVerified);
      setAuthPetCount(getAuthPetCount);
    });
  }, [getCheckInternet]);

  useEffect(() => {
    checkVersion();
  }, [])


  useEffect(() => {
    const splashTimer = setTimeout(() => {
      SplashScreen.hide(); // Hide the splash screen after 3 seconds
    }, 3000); // 3000 milliseconds = 3 seconds

    return () => {
      clearTimeout(splashTimer); // Clear the timeout to prevent memory leaks
    };
  }, []);

  const checkVersion = async () => {
    try {
      const currentVersionCode = await VersionCheck.getCurrentBuildNumber(); // Properly await this
      const latestVersionCode = await VersionCheck.getCurrentBuildNumber();
      const latestVersionNumber = await VersionCheck.getLatestVersion();
      const currentVersionNumber = await VersionCheck.getCurrentVersion();
      if (currentVersionCode !== latestVersionCode || currentVersionNumber !== latestVersionNumber) {
        Alert.alert(
          "Update Available",
          "A new version of the app is available. Please update to continue.",
          [
            {
              text: "Update Now",
              onPress: async () => {
                try {
                  let appStoreUrl;
                  if (Platform.OS === "ios") {
                    // Get iOS store URL
                    appStoreUrl = await (await VersionCheck.getStoreUrl({ appID: "6449488250" }));
                  } else {
                    // Get Android store URL
                    appStoreUrl = await (await VersionCheck.getStoreUrl({ packageName: "com.fleatiger" }));
                  }

                  // Ensure appStoreUrl is a valid string
                  if (typeof appStoreUrl === 'string') {
                    Linking.openURL(appStoreUrl);
                  } else {
                    console.error("Invalid app store URL, expected a string but got:", appStoreUrl);
                  }
                } catch (error) {
                  console.error("Failed to get store URL:", error);
                }
              },
            },
            {
              text: "Cancel",
              style: "cancel",
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.error("Failed to check version:", error);
    }
  };

  const getToken = async () => {
    return await AsyncStorage.getItem('token');
  };

  const getPlan = async latestPlan => {
    // when there is no previous user subscription available
    const data = await GetPlanListData();
    let plan = null;
    if (data != null) {
      data.map(pl => {
        if (pl.plan_name != 'free') {
          if (Platform.OS === 'android') {
            if (latestPlan.productId === pl.subscription_plan_id) {
              plan = pl;
            }
          } else {
            if (latestPlan.productId === pl.ios_subscription_plan_id) {
              plan = pl;
            }
          }
        }
      });
    }
    return plan;
  };

  const getPurchaseEndTime = (purchaseTime, days) => {
    let latestPlanEndTime = '';
    if (__SANDBOX__) {
      let minute = 5;
      if (days === 365) {
        if (Platform.OS === 'android') {
          minute = 30;
        } else {
          minute = 60;
        }
      }
      latestPlanEndTime = moment(purchaseTime)
        .utc(true)
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .add(minute, 'minutes')
        .format('YYYY-MM-DD HH:mm:ss');
    } else {
      latestPlanEndTime = moment(purchaseTime)
        .utc(true)
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .add(days, 'days')
        .format('YYYY-MM-DD HH:mm:ss');
    }
    return new Date(latestPlanEndTime);
  };

  const showStepAlertDialog = step => {
    Alert.alert('Subscription', `Step ${step}`, [
      { text: 'OK', onPress: () => { } },
    ]);
  };

  const restorePurchase = async () => {
    try {
      const token = await getToken();
      if (token != null && token != '') {
        // Alert.alert(
        //   "Alert",
        //   `Token ${token}`,
        //   [{ text: "OK", onPress: () => { } }]
        // );

        let purchasesAvailable = await getAvailablePurchases();

        // Alert.alert(
        //   "Alert",
        //   `Plan  Available ${JSON.stringify(purchasesAvailable)}`,
        //   [{ text: "OK", onPress: () => { } }]
        // );

        // if(purchasesAvailable != null && purchasesAvailable.length === 0) {
        //     purchasesAvailable = await getPurchaseHistory();
        //     Alert.alert(
        //       "Alert",
        //       `Plan History ${JSON.stringify(purchasesAvailable)}`,
        //       [{ text: "OK", onPress: () => { } }]
        //     );
        // }

        if (purchasesAvailable != null && purchasesAvailable.length > 0) {
          const sortedAvailablePurchases = purchasesAvailable.sort(
            (a, b) => b.transactionDate - a.transactionDate,
          );
          // Alert.alert(
          //   "Alert",
          //   `sortedAvailablePurchases ${JSON.stringify(sortedAvailablePurchases)}`,
          //   [{ text: "OK", onPress: () => { } }]
          // );
          if (sortedAvailablePurchases && sortedAvailablePurchases.length > 0) {
            const latestPlan = sortedAvailablePurchases[0];
            // Alert.alert(
            //   "Alert",
            //   `Latest Plan ${JSON.stringify(latestPlan)}`,
            //   [{ text: "OK", onPress: () => { } }]
            // );
            if (Platform.OS === 'android') {
              if (
                latestPlan.autoRenewingAndroid != null &&
                latestPlan.autoRenewingAndroid === true
              ) {
                // showStepAlertDialog('1');
                const userSubscriptionDetail =
                  await GetUserSubscriptionDetail();
                if (
                  userSubscriptionDetail != '' &&
                  userSubscriptionDetail.subscription_plan_id != 'free'
                ) {
                  // showStepAlertDialog('2');
                  if (
                    userSubscriptionDetail.purchase_token !=
                    latestPlan.purchaseToken
                  ) {
                    // when there is no previous user subscription available
                    const plan = await getPlan(latestPlan);
                    if (plan != null) {
                      const purchaseTime = latestPlan.transactionDate;
                      const days = plan.days;
                      const latestPlanEndDate = getPurchaseEndTime(
                        purchaseTime,
                        days,
                      );
                      const currentTime = moment()
                        .utc(true)
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .toDate();
                      if (latestPlanEndDate.getTime() < currentTime.getTime()) {
                        // subscribe plan user
                        subscribePlan(plan, latestPlan);
                        return;
                      }
                      // Alert.alert(
                      //   "Subscription",
                      //   `Step 4`,
                      //   [{ text: "OK", onPress: () => {} }]
                      // );
                      return;
                    }
                  } else {
                    // showStepAlertDialog('2');
                  }
                } else {
                  // Alert.alert(
                  //   "Subscription",
                  //   `Step 9`,
                  //   [{ text: "OK", onPress: () => {} }]
                  // );
                }
              } else {
                // Alert.alert(
                //   "Subscription",
                //   `Step 9`,
                //   [{ text: "OK", onPress: () => {} }]
                // );
              }
            } else if (Platform.OS === 'ios') {
              const result = await validateReceiptIos(
                { 'receipt-data': latestPlan.transactionReceipt },
                true,
              );
              if (result) {
                // Alert.alert(
                //   "Subscription",
                //   `Step 1`,
                //   [{ text: "OK", onPress: () => {} }]
                // );
                const userSubscriptionDetail =
                  await GetUserSubscriptionDetail();
                if (
                  userSubscriptionDetail != '' &&
                  userSubscriptionDetail.subscription_plan_id != 'free'
                ) {
                  // When user already subscribed one plan earlier
                  // Alert.alert(
                  //   "Subscription",
                  //   `Step 2`,
                  //   [{ text: "OK", onPress: () => {} }]
                  // );
                  if (
                    userSubscriptionDetail.purchase_token !=
                    latestPlan.transactionId
                  ) {
                    let plan = await getPlan(latestPlan);
                    if (plan != null) {
                      const currentTime = moment()
                        .utc(true)
                        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                        .toDate();
                      const purchaseTime = latestPlan.transactionDate;
                      const days = plan.days;
                      const endTime = getPurchaseEndTime(purchaseTime, days);
                      if (endTime.getTime() < currentTime.getTime()) {
                        // Alert.alert(
                        //   "Subscription",
                        //   `Step 3`,
                        //   [{ text: "OK", onPress: () => {} }]
                        // );
                        subscribePlan(plan, latestPlan);
                        return;
                      }
                      // Alert.alert(
                      //   "Subscription",
                      //   `Step 4`,
                      //   [{ text: "OK", onPress: () => {} }]
                      // );
                      return;
                    }
                    // Alert.alert(
                    //   "Subscription",
                    //   `Step 5`,
                    //   [{ text: "OK", onPress: () => {} }]
                    // );
                    return;
                  }
                  // Alert.alert(
                  //   "Subscription",
                  //   `Purchase Token Same or Downgrade not possible`,
                  //   [{ text: "OK", onPress: () => {} }]
                  // );
                  return;
                } else {
                  let plan = await getPlan(latestPlan);
                  if (plan != null) {
                    const currentTime = moment()
                      .utc(true)
                      .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
                      .toDate();
                    const purchaseTime = latestPlan.transactionDate;
                    const days = plan.days;
                    const endTime = getPurchaseEndTime(purchaseTime, days);
                    if (endTime.getTime() < currentTime.getTime()) {
                      subscribePlan(plan, latestPlan);
                      // Alert.alert(
                      //   "Subscription",
                      //   `Step 6`,
                      //   [{ text: "OK", onPress: () => {} }]
                      // );
                      return;
                    }
                    // Alert.alert(
                    //   "Subscription",
                    //   `Step 7`,
                    //   [{ text: "OK", onPress: () => {} }]
                    // );
                    return;
                  }
                  // Alert.alert(
                  //   "Subscription",
                  //   `Step 8`,
                  //   [{ text: "OK", onPress: () => {} }]
                  // );
                  return;
                }
              } else {
                // Alert.alert(
                //   "Subscription",
                //   `Step 9`,
                //   [{ text: "OK", onPress: () => {} }]
                // );
              }
            }
          } else {
            // Alert.alert(
            // "Alert",
            // `There is no subscription`,
            // [{ text: "OK", onPress: () => { } }]
            // );
          }
        } else {
          // Alert.alert(
          // "Alert",
          // `There is no purchase history`,
          // [{ text: "OK", onPress: () => {
          // } }]
          // );
        }
      } else {
        // Alert.alert(
        // "Alert",
        // `Token not found`,
        // [{ text: "OK", onPress: () => {
        // } }]
        // );
      }
    } catch (error) {
      // console.log(error);
      // Alert.alert(
      //   "Alert",
      //   `error ${error.message}`,
      //   [{ text: "OK", onPress: () => {
      //   } }]
      //   );
    }
  };

  // Getting plan list data to verify valid subscription and
  // get details of plan
  const GetPlanListData = async () => {
    const Response = await GetPlanListApi();
    if (Response.data.length > 0) {
      return Response.data;
    } else {
      return null;
    }
  };

  // Getting user subscription details
  const GetUserSubscriptionDetail = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const data = {
      user_id: UserID,
    };
    const Response = await UserCurrentSubscriptionApi(data);
    // console.log("User Response",JSON.stringify(Response));
    return Response;
  };

  const subscribePlan = async (plan, latestPlan) => {
    const UserID = await AsyncStorage.getItem('userId');
    // let data = {
    //   user_id: UserID,
    //   subscription_plan_id: latestPlan.productId,
    //   start_date: moment(latestPlan.purchaseTime).format("YYYY-MM-DD HH:mm:ss"),
    //   end_date: moment(latestPlan.purchaseTim).add(plan.days, "days").format("YYYY-MM-DD HH:mm:ss"),
    //   timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    //   payment_id: "",
    //   tax_amount: "",
    //   final_amount: "",
    //   discount_amount: "",
    //   cycle: "",
    //   payment_menthod: "",
    //   status: 1,
    //   created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
    //   purchase_token: latestPlan.purchaseToken
    // };

    let data = {};
    if (Platform.OS === 'ios') {
      let startDate = '';
      let endDate = '';
      if (__SANDBOX__) {
        let minute = 5;
        if (plan.days === 365) {
          minute = 60;
        }
        startDate = moment(latestPlan.transactionDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        endDate = moment(latestPlan.transactionDate)
          .add(minute, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        startDate = moment(latestPlan.transactionDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        endDate = moment(latestPlan.transactionDate)
          .add(plan.days, 'days')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      data = {
        user_id: UserID,
        subscription_plan_id: plan.ios_subscription_plan_id,
        start_date: startDate,
        end_date: endDate,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        payment_id: '',
        tax_amount: '',
        final_amount: '',
        discount_amount: '',
        cycle: '',
        payment_menthod: '',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        purchase_token: latestPlan.transactionId,
        platform: 'ios',
        ios_transaction_id: latestPlan.transactionId,
        ios_transaction_identifier: latestPlan.originalTransactionIdentifierIOS,
      };
    } else if (Platform.OS === 'android') {
      let startDate = '';
      let endDate = '';
      if (__SANDBOX__) {
        let minute = 5;
        if (plan.days === 365) {
          minute = 30;
        }
        startDate = moment(latestPlan.transactionDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        endDate = moment(latestPlan.transactionDate)
          .add(minute, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        startDate = moment(latestPlan.transactionDate).format(
          'YYYY-MM-DD HH:mm:ss',
        );
        endDate = moment(latestPlan.transactionDate)
          .add(plan.days, 'days')
          .format('YYYY-MM-DD HH:mm:ss');
      }
      data = {
        user_id: UserID,
        subscription_plan_id: plan.subscription_plan_id,
        start_date: startDate,
        end_date: endDate,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        payment_id: '',
        tax_amount: '',
        final_amount: '',
        discount_amount: '',
        cycle: '',
        payment_menthod: '',
        status: 1,
        created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
        purchase_token: '',
        platform: 'android',
      };
    }

    const subscriblePlanRes = await SubscribePlanApi(data);
    // console.log('subscriblePlanRes', subscriblePlanRes);
    if (subscriblePlanRes.success && subscriblePlanRes.status) {
      Alert.alert(
        'Subscribed Plan API Response',
        `success ${JSON.stringify(subscriblePlanRes)}`,
        [{ text: 'OK', onPress: () => { } }],
      );
      // Storing purchase token in preference

      if (Platform.OS === 'android') {
        if (latestPlan.purchaseToken && latestPlan.purchaseToken != null) {
          await AsyncStorage.setItem('purchaseToken', latestPlan.purchaseToken);
        } else {
          await AsyncStorage.setItem('purchaseToken', '');
        }
      } else if (Platform.OS === 'ios') {
        if (latestPlan.transactionId && latestPlan.transactionId != null) {
          await AsyncStorage.setItem('purchaseToken', latestPlan.transactionId);
        } else {
          await AsyncStorage.setItem('purchaseToken', '');
        }
      }

      if (Platform.OS === 'android') {
        // achknowledging app store / play store regarding subscription that
        // product has been consume
        await acknowledgePurchaseAndroid({
          token: latestPlan.purchaseToken,
          developerPayload: null,
        });
        await finishTransaction({
          purchase: latestPlan,
          isConsumable: false,
          developerPayloadAndroid: null,
        });
      } else {
        // finish transaction and consume purchased product
        // is consumable true because product can be purchased again
        await finishTransaction({
          purchase: latestPlan,
          isConsumable: false,
          developerPayloadAndroid: null,
        });
      }
    } else {
      // Show API response error
      // According to your requirements
      // Alert.alert(
      //   'Subscribed Plan API Response',
      //   `Error ${JSON.stringify(subscriblePlanRes)}`,
      //   [{text: 'OK', onPress: () => {}}],
      // );
    }
  };

  const UserSubscriptionDetail = async () => {
    const userSubscriptionDetail = await GetUserSubscriptionDetail();
    // console.log(
    //   'User Subscription Detail',
    //   JSON.stringify(userSubscriptionDetail),
    // );
    if (
      userSubscriptionDetail != '' &&
      userSubscriptionDetail.subscription_plan_id != 'free' &&
      userSubscriptionDetail.purchase_token != null
    ) {
      await AsyncStorage.setItem(
        'purchaseToken',
        userSubscriptionDetail.purchase_token,
      );
    } else {
      await AsyncStorage.setItem('purchaseToken', '');
    }
  };

  useEffect(() => {
    UserSubscriptionDetail();
    if (Platform.OS === 'ios') {
      setup({ storekitMode: 'STOREKIT_HYBRID_MODE' });
    }
    restorePurchase();

    const subscription = AppState.addEventListener('change', nextAppState => {
      // console.log("appstate",nextAppState);
      // Alert.alert(
      //   "Alert",
      //   `Last State -> ${appState.current} || Current State -> ${nextAppState}`,
      //   [{ text: "OK", onPress: () => { } }]
      // );
      if (Platform.OS === 'ios') {
        if (appState.current === 'background' && nextAppState === 'active') {
          // Alert.alert(
          //   "Alert",
          //   `Restoring Purchase iOS`,
          //   [{ text: "OK", onPress: () => { } }]
          // );
          restorePurchase();
        }
      } else if (Platform.OS === 'android') {
        // if (appState.current === "background" && nextAppState === "active") {
        //   Alert.alert(
        //     "Alert",
        //     `Restoring Purchase Android`,
        //     [{ text: "OK", onPress: () => { } }]
        //   );
        //   restorePurchase();
        // }
      }
      appState.current = nextAppState;
    });
    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setCheckInternet(state.isConnected);
      // if (state.isConnected) {
      //   Alert.alert("online")
      //   console.log("state.isConnected", state.isConnected)
      //   // Trigger a re-render or some action here
      // }
      // else {
      //   Alert.alert("offline")
      // }
    });

    return () => {
      unsubscribe();
    };
  }, [NetInfo, getCheckInternet]);
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      {/* {
        getCheckInternet === true ? */}
      <NavigationContainer>
        <Stack.Navigator>
          {authToken && authEmailVerified && authPetCount ? (
            <Stack.Group>
              <Stack.Screen
                name="DrawerNavigator"
                component={DrawerNavigator}
                navigation={undefined}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          ) : authPetCount === '0' ? (
            <Stack.Group>
              <Stack.Screen
                name="Onboarding1"
                component={Onboarding1}
                options={{ headerShown: false }}
                initialParams={{ status: '' }}
              />
            </Stack.Group>
          ) : (
            <Stack.Group>
              <Stack.Screen
                name="public"
                component={PublicStackNavigator}
                options={{ headerShown: false }}
              />
            </Stack.Group>
          )}
          <Stack.Group>
            <Stack.Screen
              name="Home"
              component={DrawerNavigator}
              navigation={undefined}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="HomeStackNavigator"
              component={DrawerNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddNewMember"
              component={AddNewMemberStackNavigator}
              navigation={undefined}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Public"
              component={PublicStackNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="AddActivityStackNavigator"
              component={AddActivityStackNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SubscriptionStackNavigator"
              component={SubscriptionStackNavigator}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Messages"
              component={MessagesStackNavigator}
              options={{headerShown: false}}
            />
          </Stack.Group>
        </Stack.Navigator>
      </NavigationContainer>
      {/* : <Text style={{ textAlign: "center", marginTop: 400, fontWeight: 800 }}>Please Check your internet connection...!!!</Text> */}
      {/* } */}
    </GestureHandlerRootView>
  );
};

export default withIAPContext(App);
