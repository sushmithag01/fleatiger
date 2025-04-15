import React ,{useRef}from 'react';
import { ScrollView } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { SafeAreaView } from 'react-native-safe-area-context';
import 'react-native-get-random-values';
import { GOOGLE_MAPS_API_KEY } from '../API/Constant';

const GooglePlacesInput = ({ setLocation, location }) => {
  const googleRef = useRef(null); 

  const HandleOnPress = (data, details = null) => {
    setLocation(data.description)
  };
  return (
    <ScrollView>
      <GooglePlacesAutocomplete
        ref={googleRef}
        placeholder={location == '' ? 'Enter Location' : location}
        textInputProps={{
          placeholderTextColor: '#000',
        }}
        // defaultValue={location == '' ? 'Enter Location' : location}
        isRowScrollable={true}
        enablePoweredByContainer={false}
        onPress={HandleOnPress}
        onClear={() => setLocation('')}
        currentLocation={true}
        currentLocationLabel="Current location"
        GooglePlacesDetailsQuery={{
          fields: ['formatted_address', 'geometry'],
        }}
        fetchDetails={true}
        keepResultsAfterBlur={true}
        filterReverseGeocodingByTypes={[
          'locality',
          'administrative_area_level_1',
          'country',
          'street_address',
          'postal_code',
          'street_number',
        ]}
        query={{
          key: GOOGLE_MAPS_API_KEY,
        }}
        styles={{
          textInputContainer: {
            backgroundColor: 'transparent',
            marginLeft: 6,
            marginRight: 10,
            ...Platform.select({
              ios: {

              },
              android: {
                marginTop: 8
              },
            }),
          },
          textInput: {
            backgroundColor: 'transparent',
            color: '#000',
            fontSize: 15,
            ...Platform.select({
              ios: {
                height: 20,
              },
              android: {
                height: 25,
              },
            }),
          },
          predefinedPlacesDescription: {
            color: 'black',
          },
        }}
      />
    </ScrollView>
  );
};

export default GooglePlacesInput;