import React, { useState } from 'react'
import { Text, View, StyleSheet, ScrollView, Image, TextInput, TouchableOpacity, SafeAreaView } from 'react-native';
import styles from "../Common.css";
import LatestLocalCard from './LatestLocalCard';
import { CheckBox, Icon } from '@rneui/themed';

const Checkout = props => {
  const [check4, setCheck4] = useState(false);
  return (
    <>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.checkoutmain}>
          <Text style={styles.checktext1}>Checkout (1 Item)</Text>
          <Text style={styles.checktext2}>Please fill out the billing information</Text>
          <View>
            <Text style={styles.orangetitlebold}>Your Item</Text>
            <LatestLocalCard />
          </View>
          <View>
            <Text style={styles.orangetitlebold}>Payment method</Text>
            <View>
              <CheckBox
                checkedIcon={
                  <Icon
                    name="radio-button-checked"
                    type="material"
                    color="#E66100"
                    size={25}
                    iconStyle={{ marginRight: 0 }}
                  />
                }
                uncheckedIcon={
                  <Icon
                    name="radio-button-unchecked"
                    type="material"
                    color="grey"
                    size={25}
                    iconStyle={{ marginRight: 0 }}
                  />
                }
                checked={check4}
                title="Credit/Debit Card"
                onPress={() => setCheck4(!check4)}
              />
              <View style={styles.innerradiocheckout}>
                <View>
                  <CheckBox
                    checkedIcon={
                      <Icon
                        name="radio-button-checked"
                        type="material"
                        color="#E66100"
                        size={20}
                        iconStyle={{ marginRight: 0 }}
                      />
                    }
                    uncheckedIcon={
                      <Icon
                        name="radio-button-unchecked"
                        type="material"
                        color="grey"
                        size={20}
                        iconStyle={{ marginRight: 0 }}
                      />
                    }
                    checked={check4}
                    onPress={() => setCheck4(!check4)}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </>

  )
}


export default Checkout