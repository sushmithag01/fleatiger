import React, {useEffect, useRef, useState} from 'react';
import {Tab, TabView} from '@rneui/themed';
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import styles from '../Common.css';
import MeHome from './MeHome';
import NewsFeed from './NewsFeed';
import DashboardDateSelector from './DashboardDateSelector';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MonthlySubscription from './MonthlySubscription';
import PremiumSubscription from './PremiunSubscription';
import {
  endConnection,
  finishTransaction,
  getSubscriptions,
  flushFailedPurchasesCachedAsPendingAndroid,
  getProducts,
  initConnection,
  purchaseUpdatedListener,
  requestSubscription,
  purchaseErrorListener,
  useIAP,
  PurchaseError,
  getAvailablePurchases,
  acknowledgePurchaseAndroid,
  SubscriptionPurchase,
  ProductPurchase,
  setup,
  clearTransactionIOS,
  validateReceiptAndroid,
  ProrationModesAndroid,
  getPurchaseHistory,
} from 'react-native-iap';
import {
  GetPlanListApi,
  SubscribePlanApi,
  UserCurrentSubscriptionApi,
  userSubscriptionInfoApi,
} from './API/ApiCalls';
import Loader from './CommonScreens/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment-timezone';
import {SubscriptionHeaderLeft} from '../navigation/CustomBackNavigation';
import SubscriptonSuccessPopUp from './Popups/SubscriptionSuccessPopUp';
import { tapGestureHandlerProps } from 'react-native-gesture-handler/lib/typescript/handlers/TapGestureHandler';

const Subscription = props => {
  const {route} = props;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [index, setIndex] = React.useState('');
  const [ShowDates, setShowDates] = useState(false);
  const isPlay = Platform.OS === 'android';

  const [ownedSubscriptions, setOwnedSubscriptions] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [premiumPlanList, setPremiumPlanList] = useState([]);
  const [starterPlanList, setStarterPlanList] = useState([]);
  const days = useRef(0);
  const [loading, setLoading] = useState(false);
  let purchaseUpdatedListener = useRef(null);
  let purchaseErrorListener = useRef(null);
  const [activePlan, setActivePlan] = useState('');
  const [successPopUp, setSuccessPopUp] = useState(false);
  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    getAvailablePurchases,
    finishTransaction,
  } = useIAP();
  const __SANDBOX__ = false;

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        headerLeft: () => <SubscriptionHeaderLeft navigation={navigation} />,
      });
      GetPlanListData();
      handleSubscriptionInfo();
    }
    // setGetPetId(route.params.state.petId)
  }, [isFocused]);

  const handleSubscriptionInfo = async () => {
    let payload = {
      user_id: await AsyncStorage.getItem('userId'),
    };
    const getUserSubscriptionPlan = await userSubscriptionInfoApi(payload);
    // console.log('getUserSubscriptionPlan', getUserSubscriptionPlan);
    if (getUserSubscriptionPlan.status === 200) {
      if (
        getUserSubscriptionPlan.data.subscription_info.plan_name === 'starter'
      ) {
        setIndex(1);
      } else {
        setIndex(0);
      }
      setActivePlan(getUserSubscriptionPlan.data.subscription_info);
      // setSuccessPopUp(true);
    } else {
      setActivePlan('');
    }
  };

  // Get Plans data from the server
  const GetPlanListData = async () => {
    // setLoading(true)
    const Response = await GetPlanListApi();
    // setLoading(false)
    if (Response.data.length == 0) {
      setPlanList(Response.data);
    } else {
      setPlanList(Response.data);
      let iOSSkus = [];
      let androidSkus = [];
      let premiumPlans = [];
      let starterPlans = [];
      Response.data.map(plan => {
        if (plan.plan_name != 'free') {
          if (Platform.OS === 'android') {
            androidSkus.push(plan.subscription_plan_id);
          } else {
            iOSSkus.push(plan.ios_subscription_plan_id);
          }
          if (plan.plan_name === 'premium') {
            premiumPlans.push(plan);
          } else if (plan.plan_name === 'starter') {
            starterPlans.push(plan);
          }
        }
      });
      setPremiumPlanList(premiumPlans);
      setStarterPlanList(starterPlans);
      const subscriptionSkus = Platform.select({
        ios: iOSSkus,
        android: androidSkus,
        default: [],
      });
      handleGetSubscriptions(subscriptionSkus);
    }
  };

  // Get the subscriptions details from the App store / Play store
  const handleGetSubscriptions = async subscriptionSkus => {
    try {
      await getSubscriptions({skus: subscriptionSkus});
    } catch (error) {
      console.log('handleGetSubscriptions', error);
    }
  };

  // Sending subscription plan details to api
  const subscribePlan = async (
    plan,
    subscribedPlan,
    purchaseTime,
    purchaseToken,
  ) => {
    // Alert.alert(
    //   "handleBuySubscription Method",
    //   `Subscription detail ${JSON.stringify(subscribedPlan)}`,
    //   [{
    //     text: "OK", onPress: () => {

    //     }
    //   }]
    // );

    const UserID = await AsyncStorage.getItem('userId');
    let data = {};
    if (Platform.OS === 'ios') {
      let startDate = '';
      let endDate = '';
      if (__SANDBOX__ === true) {
        let minute = 5;
        if (plan.days === 365) {
          minute = 60;
        }
        startDate = moment(purchaseTime).format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(purchaseTime)
          .add(minute, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        startDate = moment(purchaseTime).format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(purchaseTime)
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
        purchase_token: '',
        ios_transaction_id: subscribedPlan.transactionId,
        ios_transaction_identifier:
          subscribedPlan.originalTransactionIdentifierIOS,
        platform: 'ios',
      };
    } else if (Platform.OS === 'android') {
      let startDate = '';
      let endDate = '';
      if (__SANDBOX__ === true) {
        let minute = 5;
        if (plan.days === 365) {
          minute = 30;
        }
        startDate = moment(purchaseTime).format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(purchaseTime)
          .add(minute, 'minutes')
          .format('YYYY-MM-DD HH:mm:ss');
      } else {
        startDate = moment(purchaseTime).format('YYYY-MM-DD HH:mm:ss');
        endDate = moment(purchaseTime)
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
        purchase_token: purchaseToken,
        platform: 'android',
      };
    }
    // Alert.alert(
    //   "handleBuySubscription Method",
    //   `Step 11 ${JSON.stringify(data)}`,
    //   [{
    //     text: "OK", onPress: () => {

    //     }
    //   }]
    // );

    // setLoading(true)
    const subscriblePlanRes = await SubscribePlanApi(data);
    // setLoading(false)
    if (subscriblePlanRes.success && subscriblePlanRes.status) {
      handleSubscriptionInfo();
      setSuccessPopUp(true);
      // Alert.alert(
      //   "Subscribed Plan API Response",
      //   `success ${JSON.stringify(subscriblePlanRes)}`,
      //   [{
      //     text: "OK", onPress: () => {

      //     }
      //   }]
      // );
      // Storing purchase token in preference

      if (Platform.OS === 'android') {
        await AsyncStorage.setItem('purchaseToken', purchaseToken);
        // achknowledging app store / play store regarding subscription that
        // product has been consume
        await acknowledgePurchaseAndroid({token: purchaseToken});
        await finishTransaction({
          purchase: subscribedPlan,
          isConsumable: false,
          developerPayloadAndroid: UserID,
        });
      } else if (Platform.OS === 'ios') {
        // finish transaction and consume purchased product
        // is consumable true because product can be purchased again
        await finishTransaction({
          purchase: subscribedPlan,
          isConsumable: false,
          developerPayloadAndroid: null,
        });
      }
    } else {
      handleSubscriptionInfo();
      // setSuccessPopUp(true);
      // Show API response error
      // According to your requirements
      // Alert.alert(
      //   "Subscribed Plan API Response",
      //   `Error ${JSON.stringify(subscriblePlanRes)}`,
      //   [{
      //     text: "OK", onPress: () => {

      //     }
      //   }]
      // );
    }
  };

  // Getting user subscription details
  const GetUserSubscriptionDetail = async () => {
    const UserID = await AsyncStorage.getItem('userId');
    const data = {
      user_id: UserID,
    };
    const Response = await UserCurrentSubscriptionApi(data);
    return Response;
  };

  // handle subscription plan
  const handleBuySubscription = async (
    plan,
    offerToken?: string,
    downgrade: boolean = false,
  ) => {
    const UserID = await AsyncStorage.getItem('userId');
    try {
      // invoke requestSubscription to make subscription by product id and offerToken
      if (Platform.OS === 'ios') {
        // Alert.alert(
        //   "handleBuySubscription Method",
        //   `Step 10 ${downgrade}`,
        //   [{
        //     text: "OK", onPress: () => {

        //     }
        //   }]
        // );
        await clearTransactionIOS();
        var subscribedPlan = await requestSubscription({
          sku: plan.ios_subscription_plan_id,
          andDangerouslyFinishTransactionAutomaticallyIOS: false,
          appAccountToken: UserID,
        });

        if (subscribedPlan != null) {
          // Alert.alert("Subscription details iOS", `${JSON.stringify(subscribedPlan)}`, [{
          //   text: "OK",
          //   onPress: () => { },
          // },
          // ]);

          if (downgrade === false) {
            const purchastTime = subscribedPlan.purchaseTime;
            const purchaseToken = subscribedPlan.transactionId;
            subscribePlan(plan, subscribedPlan, purchastTime, purchaseToken);
          } else {
            Alert.alert(
              'Subscription details',
              'Subscription details will be updated on renewal date',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
          }
        } else {
          Alert.alert(
            'Subscription details',
            'Subscription done but no subscription data received',
            [
              {
                text: 'OK',
                onPress: () => {},
              },
            ],
          );
        }
      } else if (Platform.OS === 'android') {
        if (!offerToken) {
          Alert.alert(
            'Handle by subscription',
            `There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${plan.subscription_plan_id}`,
            [{text: 'OK', onPress: () => {}}],
          );
        } else {
          var subpurchase = null;
          let oldPurchaseToken = await AsyncStorage.getItem('purchaseToken');
          if (oldPurchaseToken != null && oldPurchaseToken != '') {
            // console.log('Downgrade', downgrade)
            if (downgrade === true) {
              subpurchase = await requestSubscription({
                sku: plan.subscription_plan_id,
                purchaseTokenAndroid: oldPurchaseToken,
                prorationModeAndroid: ProrationModesAndroid.DEFERRED, // Downgrade plan
                ...(offerToken && {
                  subscriptionOffers: [
                    {sku: plan.subscription_plan_id, offerToken},
                  ],
                }),
                obfuscatedAccountIdAndroid: UserID,
                obfuscatedProfileIdAndroid: UserID,
              });
            } else {
              subpurchase = await requestSubscription({
                sku: plan.subscription_plan_id,
                purchaseTokenAndroid: oldPurchaseToken,
                prorationModeAndroid:
                  ProrationModesAndroid.IMMEDIATE_AND_CHARGE_PRORATED_PRICE, // Upgrade plan
                ...(offerToken && {
                  subscriptionOffers: [
                    {sku: plan.subscription_plan_id, offerToken},
                  ],
                }),
                obfuscatedAccountIdAndroid: UserID,
                obfuscatedProfileIdAndroid: UserID,
              });
            }
          } else {
            subpurchase = await requestSubscription({
              sku: plan.subscription_plan_id,
              ...(offerToken && {
                subscriptionOffers: [
                  {sku: plan.subscription_plan_id, offerToken},
                ],
              }),
              obfuscatedAccountIdAndroid: UserID,
              obfuscatedProfileIdAndroid: UserID,
            });
          }
          if (subpurchase != null && subpurchase.length > 0) {
            // Alert.alert("Subscription details Android", `${JSON.stringify(subpurchase[0])}`, [{
            //   text: "OK",
            //   onPress: () => {},
            //   },
            // ]);
            const purchaseTime = subpurchase[0].purchaseTime;
            const purchaseToken = subpurchase[0].purchaseToken;
            subscribePlan(plan, subpurchase[0], purchaseTime, purchaseToken);
          } else {
            Alert.alert(
              'Subscription details',
              'Subscription done but no subscription data received',
              [
                {
                  text: 'OK',
                  onPress: () => {},
                },
              ],
            );
          }
        }
      }
    } catch (error) {
      // setLoading(false)
      if (error instanceof PurchaseError) {
        Alert.alert(
          'Purchase Error',
          `message: [${error.code}]: ${error.message}, ${error}`,
          [{text: 'OK', onPress: () => {}}],
        );
      } else {
        Alert.alert(
          'Payment cancelled',
          `message: [handleBuySubscription]: ${error}`,
          [{text: 'OK', onPress: () => {}}],
        );
      }
    }
  };

  const showStepAlertDialog = step => {
    Alert.alert('Subscription', `Step ${step}`, [
      {
        text: 'OK',
        onPress: () => {},
      },
    ]);
  };

  const getPlan = async latestPlan => {
    // when there is no previous user subscription available
    const data = await GetPlanListApi();
    let plan = null;
    // console.log('Plan id', latestPlan.subscription_plan_id)
    // console.log('Plan data', JSON.stringify(data))
    if (data.data != null) {
      data.data.map(pl => {
        if (pl.subscription_plan_id != 'free') {
          // console.log('Plan id1', pl.subscription_plan_id)
          if (Platform.OS === 'android') {
            if (latestPlan.subscription_plan_id === pl.subscription_plan_id) {
              plan = pl;
            }
          } else {
            if (
              latestPlan.subscription_plan_id === pl.ios_subscription_plan_id
            ) {
              plan = pl;
            }
          }
        }
      });
    }
    return plan;
  };

  const subscribeSubscription = (plan, offer_, downgrade = false) => {
    if (Platform.OS === 'android') {
      handleBuySubscription(plan, offer_.offerToken, downgrade);
    } else if (Platform.OS === 'ios') {
      handleBuySubscription(plan, null, downgrade);
    }
  };

  // Initiate the subscription
  const startSubscription = async plan => {
    const userSubscriptionDetail = await GetUserSubscriptionDetail();
    console.log("asdfghjkjhgfdsd",userSubscriptionDetail)
    if (
      userSubscriptionDetail != '' &&
      userSubscriptionDetail.subscription_plan_id != 'free'
    ) {
      // showStepAlertDialog('1');
      let offer_ = null;
      if (Platform.OS === 'android') {
        subscriptions.map((subscription, index) => {
          'subscriptionOfferDetails' in subscription &&
            subscription?.subscriptionOfferDetails?.map(offer => {
              if (subscription.productId === plan.subscription_plan_id) {
                // console.log('Plan Id found')
                offer_ = offer;
                console.log('offer_', offer_);
              }
            });
        });
        if (offer_ === null) {
          Alert.alert(
            'Alert',
            `Offer Token not available,please try again after sometime..!!`,
            [{text: 'OK', onPress: () => {}}],
          );
          return;
        }
      }
      const subscribedPlanEndTime = new Date(userSubscriptionDetail.end_date);
      const subscribedPlanStartTime = new Date(
        userSubscriptionDetail.start_date,
      );
      const currentTime = moment()
        .utc(true)
        .tz(Intl.DateTimeFormat().resolvedOptions().timeZone)
        .toDate();
      const planId =
        Platform.OS === 'android'
          ? plan.subscription_plan_id
          : plan.ios_subscription_plan_id;

      if (planId === userSubscriptionDetail.subscription_plan_id) {
        // showStepAlertDialog('2');
        // check current time is not exceeding the subscribed end time
        if (currentTime.getTime() >= subscribedPlanEndTime.getTime()) {
          // Handling subscription
          await AsyncStorage.setItem('purchaseToken', '');
          console.log('Step 1');
          subscribeSubscription(plan, offer_);
          return;
        }
        // Show prompt that plan already subscribed
        Alert.alert('Subscription', `Already subscribed`, [
          {text: 'OK', onPress: () => {}},
        ]);
        return;
      } else {
        // Case => Upgrading the plan by checking price of the subscribedPlan
        // if price is greater than subscribed plan then upgrade the plan
        if (plan.price > userSubscriptionDetail.price) {
          // showStepAlertDialog('3');
          // for iOS only required Product ID to subscribe
          console.log('Step 2');
          subscribeSubscription(plan, offer_);
          return;
        } else {
          // Case => Downgrading the plan by checking time
          // if Remaining time less or equal to 24 hours then allow
          // user to downgrade the plan
          // Check if current time is greater than subscribed Plan end date
          // if Yes, then allow user to downgrade the plan
          if (currentTime.getTime() >= subscribedPlanEndTime.getTime()) {
            // showStepAlertDialog('5');
            // for iOS only required Product ID to subscribe
            console.log('Step 3');
            subscribeSubscription(plan, offer_);
            return;
          } else {
            // SANDBOX
            // If user trying to downgrade before 15 mins left, User will be prompted
            // Otherwise can downgrade the plan
            if (__SANDBOX__ === true) {
              // showStepAlertDialog('6');
              const latestPlan = userSubscriptionDetail;
              const plan_ = await getPlan(latestPlan);

              if (plan_ != null) {
                const diffTime =
                  subscribedPlanEndTime.getTime() -
                  subscribedPlanStartTime.getTime();
                const seconds = Math.floor(Math.abs(diffTime) / 1000);
                if (seconds <= 2 * 60) {
                  // showStepAlertDialog('7');
                  console.log('Step 4');
                  subscribeSubscription(plan, offer_, true);
                  return;
                }
                Alert.alert('Subscription', `You can not downgrade the plan `, [
                  {text: 'OK', onPress: () => {}},
                ]);
                return;
              }
              Alert.alert('Subscription', `Existing plan not found`, [
                {text: 'OK', onPress: () => {}},
              ]);
              return;
            } else {
              // PRODUCTION
              // Check if user downgrading subscription before last 24 hours of paid cycle.
              const diffTime =
                currentTime.getTime() - subscribedPlanEndTime.getTime();
              const seconds = Math.floor(Math.abs(diffTime) / 1000);
              // if remaining days 0 left to over paid cycle then user can downgrade subscription
              if (seconds <= 24 * 60 * 60) {
                // showStepAlertDialog('9');
                // for iOS only required Product ID to subscribe
                console.log('Step 5');
                subscribeSubscription(plan, null, true);
                return;
              }
              Alert.alert('Subscription', `You can not downgrade the plan`, [
                {text: 'OK', onPress: () => {}},
              ]);
            }
          }
        }
      }
    } else {
      await AsyncStorage.setItem('purchaseToken', '');
      if (Platform.OS === 'android') {
        // Alert.alert('Subscription', `Detail not found or plan is free`, [
        //   {
        //     text: 'OK',
        //     onPress: () => {},
        //   },
        // ])
        subscriptions.map((subscription, index) => {
          'subscriptionOfferDetails' in subscription &&
            subscription?.subscriptionOfferDetails?.map(offer => {
              if (subscription.productId === plan.subscription_plan_id) {
                console.log('Step 6');
                subscribeSubscription(plan, offer);
              }
            });
        });
      } else if (Platform.OS === 'ios') {
        subscribeSubscription(plan, null);
      }
    }

    // setLoading(false)
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <View style={styles.tabmain_subs}>
        <Tab
          value={index}
          onChange={e => setIndex(e)}
          containerStyle={{backgroundColor: '#fff'}}
          indicatorStyle={{
            backgroundColor: '#495F75',
            marginTop: 0,
            flex: 1,
          }}>
          <Tab.Item
            title="PREMIUM"
            titleStyle={active => ({
              textAlign: 'right',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              fontSize: 21,
              fontFamily: 'Montserrat-Bold',
              color: active ? '#495F75' : '#CED4D8',
              padding: 2,
            })}
            containerStyle={active => ({
              borderBottomColor: active ? '#495F75' : '#CED4D8',
              borderBottomWidth: 4,
              padding: 0,
              margin: 0,
            })}
          />
          <Tab.Item
            title="STARTER"
            titleStyle={active => ({
              fontSize: 12,
              textAlign: 'right',
              alignContent: 'flex-end',
              alignItems: 'flex-end',
              justifyContent: 'flex-end',
              fontSize: 21,
              fontFamily: 'Montserrat-Bold',
              color: active ? '#495F75' : '#CED4D8',
            })}
            containerStyle={active => ({
              borderBottomColor: active ? '#495F75' : '#CED4D8',
              borderBottomWidth: 4,
            })}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{backgroundColor: '#fff', flex: 1}}>
            {premiumPlanList.length > 0 ? (
              <PremiumSubscription
                premiumPlanList={premiumPlanList}
                handlePremierYearlySubscription={plan => {
                  startSubscription(plan);
                }}
                handlePremierMonthlySubscription={plan => {
                  startSubscription(plan);
                }}
                active_plan={activePlan}
              />
            ) : null}
          </TabView.Item>
          <TabView.Item style={{backgroundColor: '#fff', width: '100%'}}>
            {starterPlanList.length > 0 ? (
              <MonthlySubscription
                starterPlanList={starterPlanList}
                handleStarterYearlySubscription={plan => {
                  startSubscription(plan);
                }}
                handleStarterMonthlySubscription={plan => {
                  startSubscription(plan);
                }}
                active_plan={activePlan}
              />
            ) : null}
          </TabView.Item>
          {successPopUp ? (
            <SubscriptonSuccessPopUp
              setSuccessPopUp={setSuccessPopUp}
              successPopUp={successPopUp}
            />
          ) : null}
        </TabView>
      </View>
    </>
  );
};

export default Subscription;
