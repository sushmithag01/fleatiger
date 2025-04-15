import React, {useEffect, useRef, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  Pressable,
  Linking,
  Platform,
} from 'react-native';
import styles from '../Common.css';
import Entypo from 'react-native-vector-icons/Entypo';
import Svg, {
  Path,
  G,
  Defs,
  ClipPath,
  Circle,
  Mask,
  Pattern,
  Use,
  xlinkHref,
  style,
} from 'react-native-svg';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import Profile from './Profile';
import TopHeader from './TopHeader';
import Loader from './CommonScreens/Loader';
import SubscriptionPlanMessage from './Popups/SubscriptionPlanMessage';
import ProfileRemovedConfirmation from './Popups/ProfileRemovedConfirmation';
const MonthlySubscription = props => {
  const navigation = useNavigation();
  const TandCURL = 'https://fleatiger.com/terms-and-conditions/';
  const PrivacyURL = 'https://fleatiger.com/privacy-policy/';
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const {
    startSubscription,
    starterPlanList,
    active_plan,
  } = props;
  const version = Platform.OS === 'android' ? 34 : 153;
  const [activePlan, setActivePlan] = useState('');
  const [yearlyPlanId, setyearlyPlanId] = useState('');
  const [monthlyPlanId, setmonthlyPlanId] = useState('');
  const [activePlanId, setActivePlanId] = useState('');
  const [congratsMsg, setCongratsMsg] = useState(false);
  const [subscriptionMsg, setSubscriptionMsg] = useState(false);
  const platform = Platform.OS; // Assuming Platform.OS is defined and contains the correct value
  const message = `It appears you are attempting to update the subscription on an ${platform} device. Please update the subscription on a ${
    platform === 'android' ? 'ios' : platform === 'ios' ? 'android' : platform
  } device.`;
  useEffect(() => {
    if (isFocused) {
      setActivePlan(active_plan);
      if (Platform.OS === 'android') {
        setyearlyPlanId(starterPlanList[0].subscription_plan_id);
        setmonthlyPlanId(starterPlanList[1].subscription_plan_id);
        if (active_plan.platform === 'ios') {
          setActivePlanId(active_plan.subscription_plan_id.toLowerCase());
        } else {
          setActivePlanId(active_plan.subscription_plan_id);
        }
      } else {
        setyearlyPlanId(starterPlanList[0].ios_subscription_plan_id);
        setmonthlyPlanId(starterPlanList[1].ios_subscription_plan_id);
        if (
          active_plan.platform === 'android' &&
          active_plan.period === 'monthly'
        ) {
          setActivePlanId(starterPlanList[1].ios_subscription_plan_id);
        } else if (
          active_plan.platform === 'android' &&
          active_plan.period === 'yearly'
        ) {
          setActivePlanId(starterPlanList[0].ios_subscription_plan_id);
        } else {
          setActivePlanId(active_plan.subscription_plan_id);
        }
      }
    }
  }, [isFocused, props]);

  const handleLink = async url => {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Toast.show(`Server error to open this URL: ${url}`, {
        duration: Toast.durations.LONG,
        position: 50,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: '#fff',
        textColor: '#000',
      });
    }
  };

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* <TopHeader /> */}
          <Text style={styles.Choose_Subs}>Choose your subscription </Text>
          <View style={styles.svg_center}>
            <Svg
              xmlns="http://www.w3.org/2000/svg"
              width={79}
              height={79}
              viewBox="0 0 79 79"
              fill="none">
              <G clipPath="url(#clip0_120_3)">
                <Path
                  d="M39.5 79C61.315 79 79 61.315 79 39.5S61.315 0 39.5 0 0 17.685 0 39.5 17.685 79 39.5 79z"
                  fill="#92BCBF"
                />
                <G clipPath="url(#clip1_120_3)">
                  <Path
                    d="M72.662 32.29l-19.45-14.122a2.359 2.359 0 00-2.487-.136c-.107.058-.21.122-.309.193l-9.754 6.065a2.262 2.262 0 01-2.337 0l-9.721-6.052a2.576 2.576 0 00-.372-.227 1.611 1.611 0 00-.436-.17 2.305 2.305 0 00-2.01.331L6.339 32.29a2.43 2.43 0 00-.621 3.138l7.98 14.732a2.401 2.401 0 002.134 1.39 2.405 2.405 0 002.186-1.308l1.192-2.552 10.21 9.436a14.757 14.757 0 0020.152 0l10.218-9.443 1.195 2.558a2.4 2.4 0 003.453.92c.378-.246.678-.594.868-1.002l7.974-14.733a2.427 2.427 0 00-.616-3.139l-.001.003zm-24.145 23.7a13.293 13.293 0 01-8.248 3.536v-4.805c.113-.058.22-.128.317-.21l5.096-4.304a2.952 2.952 0 00-.283-4.725l-1.725-1.137a1.693 1.693 0 00-1.736-.07l-1.628.89a1.693 1.693 0 01-1.62 0l-1.627-.89a1.684 1.684 0 00-1.737.07l-1.724 1.137a2.951 2.951 0 00-.283 4.724l5.096 4.304c.094.079.197.147.306.203v4.812a13.293 13.293 0 01-8.249-3.537l-10.575-9.772L31.324 21.76l6.182 3.844.01.007.01.006a3.815 3.815 0 003.931 0l.01-.006.011-.007 6.194-3.85 11.421 24.458-10.578 9.777h.003z"
                    fill="#223656"
                  />
                </G>
              </G>
              <Defs>
                <ClipPath id="clip0_120_3">
                  <Path fill="#fff" d="M0 0H79V79H0z" />
                </ClipPath>
                <ClipPath id="clip1_120_3">
                  <Path
                    fill="#fff"
                    transform="translate(5.4 17.744)"
                    d="M0 0H68.1992V43.3574H0z"
                  />
                </ClipPath>
              </Defs>
            </Svg>
            {/* <View style={styles.Svg_back}>
                     <Svg
                        xmlns="http://www.w3.org/2000/svg"
                        width={64.492}
                        height={41.04}
                        viewBox="0 0 64.492 41.04"
                     >
                        <Path
                           data-name="Path 11542"
                           d="M63.606 13.767L45.214.4a2.23 2.23 0 00-2.352-.128 2.669 2.669 0 00-.292.182l-9.224 5.741a2.138 2.138 0 01-2.21 0L21.943.467a2.434 2.434 0 00-.352-.215 1.524 1.524 0 00-.412-.162 2.18 2.18 0 00-1.9.314L.888 13.767A2.3 2.3 0 00.3 16.738l7.546 13.944a2.273 2.273 0 004.086.078l1.127-2.416 9.655 8.932a13.947 13.947 0 0019.057 0l9.662-8.938 1.13 2.421a2.272 2.272 0 004.086-.078l7.541-13.945a2.3 2.3 0 00-.583-2.971zM40.774 36.2a12.564 12.564 0 01-7.8 3.348V35a1.588 1.588 0 00.3-.2l4.819-4.073a2.794 2.794 0 00-.268-4.473l-1.631-1.076a1.6 1.6 0 00-1.642-.067l-1.539.844a1.6 1.6 0 01-1.532 0l-1.539-.844a1.592 1.592 0 00-1.642.067l-1.63 1.076a2.793 2.793 0 00-.268 4.472l4.819 4.074a1.594 1.594 0 00.289.192v4.555a12.564 12.564 0 01-7.8-3.348l-10-9.25L24.514 3.8l5.846 3.639.01.006.01.006a3.605 3.605 0 003.717 0l.01-.006.01-.006 5.857-3.645 10.8 23.151L40.771 36.2z"
                           transform="translate(-847.255 475.001) translate(847.254 -475)"
                           fill="#fff"
                        />
                     </Svg>
                  </View> */}
          </View>
          <View style={styles.sub_whole}>
            <TouchableOpacity
              style={styles.cardYearlyOuter}
              onPress={() => {
                Platform.OS === active_plan.platform
                  ? startSubscription(starterPlanList[0])
                  : active_plan.platform === 'unknown'
                    ? startSubscription(starterPlanList[0])
                    : setSubscriptionMsg(true);
              }}>
              <View
                style={
                  yearlyPlanId === activePlanId
                    ? [
                        styles.cards_Yearly,
                        {borderColor: '#495F75', borderWidth: 5},
                      ]
                    : styles.cards_Yearly
                }>
                {yearlyPlanId === activePlanId ? (
                  <View style={styles.active_per}>
                    <Text style={styles.active_inner}>Active Plan</Text>
                  </View>
                ) : (
                  <View style={styles.save_per}>
                    <Text style={styles.save_inner}>Save 17%</Text>
                  </View>
                )}
                <View>
                  <Text style={styles.year_fir}>YEARLY</Text>
                  <Text style={styles.year_sec}>
                    {starterPlanList[0].currency_symbol}
                    {starterPlanList[0].price.toFixed(2)}/ year
                  </Text>
                  <Text style={styles.year_tir}>
                    {starterPlanList[0].currency_symbol}
                    {starterPlanList[0].monthly_price.toFixed(2)}/month {'\n'}
                    (Billed Yearly)
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cardYearlyOuter}
              onPress={() => {
                Platform.OS === active_plan.platform
                  ? startSubscription(starterPlanList[1])
                  : active_plan.platform === 'unknown'
                    ? startSubscription(starterPlanList[1])
                    : setSubscriptionMsg(true);
              }}>
              <View
                style={
                  monthlyPlanId === activePlanId
                    ? [
                        styles.cards_monthly,
                        {borderColor: '#495F75', borderWidth: 5},
                      ]
                    : styles.cards_monthly
                }>
                {monthlyPlanId === activePlanId ? (
                  <View style={styles.active_per_month}>
                    <Text style={styles.active_inner}>Active Plan</Text>
                  </View>
                ) : null}
                <View style={styles.year_save}>
                  <Text
                    style={
                      !activePlanId
                        ? [styles.year_firs, {paddingTop: 25}]
                        : [styles.year_firs, {paddingTop: 25}]
                    }>
                    MONTHLY
                  </Text>
                  <Text style={styles.year_sec}>
                    {starterPlanList[1].currency_symbol}
                    {starterPlanList[1].price.toFixed(2)}/ month
                  </Text>
                  <Text style={styles.year_tir}>Billed monthly</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.tick_sec}>
            <View>
              <Entypo name="check" size={35} color="#CE5757"></Entypo>
            </View>
            <View>
              <Text style={styles.text_inner}>
                All the features of
                <Text style={styles.innerText}> FREE</Text>
              </Text>
            </View>
          </View>
          <View style={styles.tick_third}>
            <View>
              <Entypo name="check" size={35} color="#CE5757"></Entypo>
            </View>
            <View>
              <Text style={styles.text_inner}>
                GPS Logging and Map {'\n'}display
              </Text>
            </View>
          </View>
          <View style={styles.tick_third}>
            <View>
              <Entypo name="check" size={35} color="#CE5757"></Entypo>
            </View>
            <View>
              <Text style={styles.text_inner}>Diet recommendations</Text>
            </View>
          </View>
          <TouchableOpacity onPress={() => setCongratsMsg(true)}>
            <View>
              <Text style={styles.thanks_Iwil}>
                No thanks, I’ll continue with {'\n'}FREE for now
              </Text>
            </View>
          </TouchableOpacity>

          <View>
            <Text style={styles.subs_pay}>
              Subscriptions billed as one-time payments. Reccurring billing.
              Cancel anytime.
            </Text>
          </View>
          <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
            <Text
              style={styles.tc_privacytext}
              onPress={() => handleLink(PrivacyURL)}>
              Privacy Policy
            </Text>
            <Text
              style={styles.tc_privacytext}
              onPress={() => handleLink(TandCURL)}>
              Terms & Conditions
            </Text>
          </View>
        </View>
        {congratsMsg ? (
          <SubscriptionPlanMessage
            congratsMsg={congratsMsg}
            setCongratsMsg={setCongratsMsg}
          />
        ) : null}
        {subscriptionMsg ? (
          <ProfileRemovedConfirmation
            visible={subscriptionMsg}
            onRequestClose={() => {
              setSubscriptionMsg(false);
            }}
            modalSuccess={subscriptionMsg}
            setModalSuccess={setSubscriptionMsg}
            text={message}
            shortText=""
          />
        ) : null}
      </ScrollView>
    </>
  );
};
export default MonthlySubscription;
