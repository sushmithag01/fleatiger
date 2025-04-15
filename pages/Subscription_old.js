import React, { useEffect, useRef, useState } from "react";
import { Tab, TabView } from "@rneui/themed";
import {
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native";
import styles from "../Common.css";
import MeHome from "./MeHome";
import NewsFeed from "./NewsFeed";
import DashboardDateSelector from "./DashboardDateSelector";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import MonthlySubscription from "./MonthlySubscription";
import PremiumSubscription from "./PremiunSubscription";
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
  ProductPurchase
} from "react-native-iap";
import { GetPlanListApi, SubscribePlanApi } from "./API/ApiCalls";
import Loader from "./CommonScreens/Loader";
import AsyncStorage from "@react-native-async-storage/async-storage";
import moment from "moment";

const Subscription = (props) => {
  const { route } = props;
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [index, setIndex] = React.useState(0);
  const [ShowDates, setShowDates] = useState(false);
  const isPlay = Platform.OS === "android";
  // const subscriptionSkus = Platform.select({
  //   ios: ['ft_PR_CHF149.00_1y_1mfree', 'cft_PR_CHF14.90_1m_1mfree','ft_ST_CHF89.00_1y_1mfree', 'ft_ST_CHF8.90_1m_1mfree'],
  //   android: ['ft_PR_CHF149.00_1y_1mfree', 'cft_PR_CHF14.90_1m_1mfree','ft_ST_CHF89.00_1y_1mfree', 'ft_ST_CHF8.90_1m_1mfree'],
  //   default: [],
  // });
  const [ownedSubscriptions, setOwnedSubscriptions] = useState([]);
  const [planList, setPlanList] = useState([]);
  const [premiumPlanList, setPremiumPlanList] = useState([]);
  const [starterPlanList, setStarterPlanList] = useState([]);
  const days = useRef(0);
  const [loading, setLoading] = useState(false);
  let purchaseUpdatedListener = useRef(null);
  let purchaseErrorListener = useRef(null);

  const {
    connected,
    subscriptions,
    getSubscriptions,
    currentPurchase,
    getAvailablePurchases,
    finishTransaction,
  } = useIAP();
 

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({
        header: (props) => (
          <>
            <View style={[styles.headerhomesingle, styles.chatsignlemain]}>
              <TouchableOpacity
                style={[
                  styles.backbtnmain,
                  styles.backinnert,
                  styles.chatsingle,
                ]}
                onPress={() =>
                  navigation.navigate("HomeStackNavigator", { screen: "Home" })
                }
              >
                <Ionicons
                  color="#92bcbf"
                  name="chevron-back"
                  style={styles.backicon}
                  size={23}
                />
              </TouchableOpacity>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "center",
                  alignItems: "center",
                }}
              ></View>
            </View>
          </>
        ),
      });
      GetPlanListData();
    }
    // setGetPetId(route.params.state.petId)
  }, [isFocused]);
  // console.log(route.params.state.petId,"lllll")

  // Get Plans data from the server
  const GetPlanListData = async () => {
    setLoading(true);
    const Response = await GetPlanListApi();
    setLoading(false);
    console.log("premiumPlans", JSON.stringify(Response.data));
    if (Response.data.length == 0) {
      setPlanList(Response.data);
    } else {
      setPlanList(Response.data);
      let iOSSkus = [];
      let androidSkus = [];
      let premiumPlans = [];
      let starterPlans = [];
      // console.log("premiumPlans",JSON.stringify(premiumPlans));
      Response.data.map((plan) => {
        if (plan.plan_name != "free") {
          if (Platform.OS === "android") {
            androidSkus.push(plan.subscription_plan_id);
          } else {
            iOSSkus.push(plan.ios_subscription_plan_id);
          }
          if (plan.plan_name === "premium") {
            premiumPlans.push(plan);
          } else if (plan.plan_name === "starter") {
            starterPlans.push(plan);
          }
        }
      });
      // console.log("premiumPlans",JSON.stringify(premiumPlans));
      // console.log("starterPlans",JSON.stringify(starterPlans));
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
  const handleGetSubscriptions = async (subscriptionSkus) => {
    try {
      await getSubscriptions({ skus: subscriptionSkus });
      console.log("Subscriptions retrieved", JSON.stringify(subscriptions));
    } catch (error) {
      errorLog({ message: "handleGetSubscriptions", error });
    }
  };

  // Sending subscription plan details to api
  const subscribePlan = async (productId, days,purchase) => {
    const UserID = await AsyncStorage.getItem("userId");
    let data = {
      user_id: UserID,
      subscription_plan_id: productId,
      start_date: moment().format("YYYY-MM-DD HH:mm:ss"),
      end_date: moment().add(days, "days").format("YYYY-MM-DD HH:mm:ss"),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      payment_id: "",
      tax_amount: "",
      final_amount: "",
      discount_amount: "",
      cycle: "",
      payment_menthod: "",
      status: 1,
      created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
      purchase_token: purchase.purchaseToken
    };
    // This dialog is [OPTIONAL], call subscribe api directly here
    Alert.alert(
      "Subscribed Plan API Request",
      `Press OK to make request ${JSON.stringify(data)}`,
      [{ text: "OK", onPress: () => {
        subscribePlanRequest(data,purchase);
      } }]
    );
  };

  // invoking subscribe plan api after Subscribe 
  const subscribePlanRequest = async (data,purchase) =>{
    setLoading(true);
    const subscriblePlanRes = await SubscribePlanApi(data);
    setLoading(false);
      if(subscriblePlanRes.success && subscriblePlanRes.status){
        Alert.alert(
          "Subscribed Plan API Response",
          `success ${JSON.stringify(subscriblePlanRes)}`,
          [{ text: "OK", onPress: () => {
            finishPurchase(purchase);
          } }]
        );
      }else{
        Alert.alert(
          "Subscribed Plan API Response",
          `Error ${JSON.stringify(subscriblePlanRes)}`,
          [{ text: "OK", onPress: () => {} }]
        );
      }
  }

  // achknowledging app store / play store regarding subscription that
  // product has been consume
  const finishPurchase = async (purchase) => {
    // Storing purchase token in preference
    await AsyncStorage.setItem("purchaseToken", purchase.purchaseToken);
    if(Platform.OS === 'android'){
      // acknowledge purchase in android to confirm purchase id one
      let result = await acknowledgePurchaseAndroid({token:purchase.purchaseToken,developerPayload:purchase.developerPayloadAndroid});
      // finish transaction and consume purchased product 
      // is consumable true because product can be purchased again
      await finishTransaction({purchase, isConsumable: true});
      Alert.alert(
        "finishPurchase",
        `success ${result}`,
        [{ text: "OK", onPress: () => {} }]
      );
    }else{
      // finish transaction and consume purchased product 
      // is consumable true because product can be purchased again
      await finishTransaction({purchase, isConsumable: true});
      Alert.alert(
        "finishPurchase",
        `success`,
        [{ text: "OK", onPress: () => {} }]
      );
    }
  }

  // handle subscription plan
  const handleBuySubscription = async (
    productId: string,
    offerToken?: string,
    days: number
  ) => {
    if (isPlay && !offerToken) {
      // console.warn(
      //   `There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${productId}`,
      // );
      Alert.alert(
        "Handle by subscription",
        `There are no subscription Offers for selected product (Only requiered for Google Play purchases): ${productId}`,
        [{ text: "OK", onPress: () => {} }]
      );
    }
    try {
      // invoke requestSubscription to make subscription by product id and offerToken
      var subpurchase = await requestSubscription({
        sku: productId,
        ...(offerToken && {
          subscriptionOffers: [{ sku: productId, offerToken }],
        }),
      });
      // This dialog is optional, depends on requirement, It is showing subscription detail which
      // we got from the app store/ play store
      Alert.alert("Subscription details", JSON.stringify(subpurchase[0]), [
        {
          text: "OK",
          onPress: () => {

            subscribePlan(productId, days,subpurchase[0]);
          },
        },
      ]);
    } catch (error) {
      if (error instanceof PurchaseError) {
        console.log("error1");
        console.log({ message: `[${error.code}]: ${error.message}`, error });
        Alert.alert(
          "Purchase Error",
          `message: [${error.code}]: ${error.message}, ${error}`,
          [{ text: "OK", onPress: () => {} }]
        );
      } else {
        console.log("error2");
        console.log({ message: "handleBuySubscription", error });
        Alert.alert(
          "Unknown Error",
          `message: [handleBuySubscription]: ${error}`,
          [{ text: "OK", onPress: () => {} }]
        );
      }
    }
  };

  // Initiate the subscription
  const startSubscription = async (productId, days) => {
    console.log("Subscriptions", JSON.stringify(subscriptions));
    // get the already purchase token
    let purchase_token = await AsyncStorage.getItem("purchaseToken");
    if(purchase_token != null && purchase_token != ""){
      // This alert dialog is optional, depends on requirement
      Alert.alert("Alert Purchase", `Subscription already running token => ${purchase_token}`, [
        {
          text: "OK",
          onPress: () => {
          },
        },
      ]);
    }else{
// This alert dialog is optional, depends on requirement

      Alert.alert("Alert Title",`Token => ${purchase_token} || ${JSON.stringify(subscriptions)}`, [
        {
          text: "OK",
          onPress: () => {
            // for android
            // find offer details of the product to subscribe
            if (Platform.OS === "android") {
              subscriptions.map((subscription, index) => {
                "subscriptionOfferDetails" in subscription &&
                  subscription?.subscriptionOfferDetails?.map((offer) => {
                    if (subscription.productId === productId) {
                      handleBuySubscription(
                        subscription.productId,
                        offer.offerToken,
                        days
                      );
                    }
                  });
              });
            } else {
               // for iOS only required Product ID to subscribe
              handleBuySubscription(productId, null, days);
            }
          },
        },
      ]);
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ""}
      <View style={styles.tabmain_subs}>
        <Tab
          value={index}
          onChange={(e) => setIndex(e)}
          containerStyle={{ backgroundColor: "#fff" }}
          indicatorStyle={{
            backgroundColor: "#495F75",
            marginTop: 0,
            flex: 1,
          }}
        >
          <Tab.Item
            title="PREMIUM"
            titleStyle={(active) => ({
              textAlign: "right",
              alignContent: "flex-end",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              fontSize: 21,
              fontFamily: "Montserrat-Bold",
              color: active ? "#495F75" : "#CED4D8",
              padding: 2,
            })}
            containerStyle={(active) => ({
              borderBottomColor: active ? "#495F75" : "#CED4D8",
              borderBottomWidth: 4,
              padding: 0,
              margin: 0,
            })}
          />
          <Tab.Item
            title="STARTER"
            titleStyle={(active) => ({
              fontSize: 12,
              textAlign: "right",
              alignContent: "flex-end",
              alignItems: "flex-end",
              justifyContent: "flex-end",
              fontSize: 21,
              fontFamily: "Montserrat-Bold",
              color: active ? "#495F75" : "#CED4D8",
            })}
            containerStyle={(active) => ({
              borderBottomColor: active ? "#495F75" : "#CED4D8",
              borderBottomWidth: 4,
            })}
          />
        </Tab>
        <TabView value={index} onChange={setIndex} animationType="spring">
          <TabView.Item style={{ backgroundColor: "#fff", flex: 1 }}>
            {premiumPlanList.length > 0 ? (
              <PremiumSubscription
                premiumPlanList={premiumPlanList}
                handlePremierYearlySubscription={(prodID) => {
                  console.log("handlePremierYearlySubscription", prodID);
                  startSubscription(prodID, 365);
                }}
                handlePremierMonthlySubscription={(prodID) => {
                  console.log("handlePremierMonthlySubscription", prodID);
                  startSubscription(prodID, 30);
                }}
              />
            ) : null}
          </TabView.Item>
          <TabView.Item style={{ backgroundColor: "#fff", width: "100%" }}>
            {starterPlanList.length > 0 ? (
              <MonthlySubscription
                starterPlanList={starterPlanList}
                handleStarterYearlySubscription={(prodID) => {
                  console.log("handleStarterYearlySubscription", prodID);
                  startSubscription(prodID, 365);
                }}
                handleStarterMonthlySubscription={(prodID) => {
                  console.log("handleStarterMonthlySubscription", prodID);
                  startSubscription(prodID, 30);
                }}
              />
            ) : null}
          </TabView.Item>
        </TabView>
      </View>
    </>
  );
};

export default Subscription;
