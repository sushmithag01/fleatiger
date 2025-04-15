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

const MonthlySubscription = props => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();
  const {
    handleStarterYearlySubscription,
    handleStarterMonthlySubscription,
    starterPlanList,
    active_plan,
  } = props;
  const [activePlan, setActivePlan] = useState('');
  const [yearlyPlanId, setyearlyPlanId] = useState('');
  const [monthlyPlanId, setmonthlyPlanId] = useState('');
  const [activePlanId, setActivePlanId] = useState('');
  const [congratsMsg, setCongratsMsg] = useState(false);

  useEffect(() => {
    if (isFocused) {
      setActivePlan(active_plan);
      if (Platform.OS === 'android') {
        setyearlyPlanId(starterPlanList[0].subscription_plan_id);
        setmonthlyPlanId(starterPlanList[1].subscription_plan_id);
        setActivePlanId(activePlan.subscription_plan_id);
      } else {
        setyearlyPlanId(starterPlanList[0].ios_subscription_plan_id);
        setmonthlyPlanId(starterPlanList[1].ios_subscription_plan_id);
        setActivePlanId(activePlan.ios_subscription_plan_id);
      }
    }
  }, [isFocused, props]);

  return (
    <>
      {loading ? <Loader loading={loading} /> : ''}
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          {/* <TopHeader /> */}
          <Text style={styles.Choose_Subs}>Choose your subscription</Text>
          <View style={styles.svg_center}>
            <View style={styles.Svg_back}>
              <Svg
                xmlns="http://www.w3.org/2000/svg"
                width={64.492}
                height={41.04}
                viewBox="0 0 64.492 41.04">
                <Path
                  data-name="Path 11542"
                  d="M63.606 13.767L45.214.4a2.23 2.23 0 00-2.352-.128 2.669 2.669 0 00-.292.182l-9.224 5.741a2.138 2.138 0 01-2.21 0L21.943.467a2.434 2.434 0 00-.352-.215 1.524 1.524 0 00-.412-.162 2.18 2.18 0 00-1.9.314L.888 13.767A2.3 2.3 0 00.3 16.738l7.546 13.944a2.273 2.273 0 004.086.078l1.127-2.416 9.655 8.932a13.947 13.947 0 0019.057 0l9.662-8.938 1.13 2.421a2.272 2.272 0 004.086-.078l7.541-13.945a2.3 2.3 0 00-.583-2.971zM40.774 36.2a12.564 12.564 0 01-7.8 3.348V35a1.588 1.588 0 00.3-.2l4.819-4.073a2.794 2.794 0 00-.268-4.473l-1.631-1.076a1.6 1.6 0 00-1.642-.067l-1.539.844a1.6 1.6 0 01-1.532 0l-1.539-.844a1.592 1.592 0 00-1.642.067l-1.63 1.076a2.793 2.793 0 00-.268 4.472l4.819 4.074a1.594 1.594 0 00.289.192v4.555a12.564 12.564 0 01-7.8-3.348l-10-9.25L24.514 3.8l5.846 3.639.01.006.01.006a3.605 3.605 0 003.717 0l.01-.006.01-.006 5.857-3.645 10.8 23.151L40.771 36.2z"
                  transform="translate(-847.255 475.001) translate(847.254 -475)"
                  fill="#fff"
                />
              </Svg>
            </View>
          </View>
          <View style={styles.sub_whole}>
            <TouchableOpacity
              style={styles.cardYearlyOuter}
              onPress={() => {
                if (Platform.OS === 'android') {
                  handleStarterYearlySubscription(
                    starterPlanList[0].subscription_plan_id,
                  );
                } else {
                  handleStarterYearlySubscription(
                    starterPlanList[0].ios_subscription_plan_id,
                  );
                }
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
                if (Platform.OS === 'android') {
                  handleStarterMonthlySubscription(
                    starterPlanList[1].subscription_plan_id,
                  );
                } else {
                  handleStarterMonthlySubscription(
                    starterPlanList[1].ios_subscription_plan_id,
                  );
                }
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
                  <Text style={styles.year_firs}>MONTHLY</Text>
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
        </View>
        {congratsMsg ? (
          <SubscriptionPlanMessage
            congratsMsg={congratsMsg}
            setCongratsMsg={setCongratsMsg}
          />
        ) : null}
      </ScrollView>
    </>
  );
};
export default MonthlySubscription;
