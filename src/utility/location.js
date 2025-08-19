import axios from "axios";
import * as Location from "expo-location";
import { Alert, BackHandler } from "react-native";

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;
const GOOGLE_URL = process.env.EXPO_PUBLIC_GOOGLE_URL;
const getCurrentLocationDetails = async () => {
  try {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      throw new Error("Permission to access location was denied");
    }

    const { coords } = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
      maximumAge: 3000,
      timeout: 5000
    });
    const { latitude, longitude } = coords;

    const url = `${GOOGLE_URL}?latlng=${latitude},${longitude}&key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);
    const data = response.data;

    const address =
      data.status === "OK" && data.results.length > 0
        ? data.results[0].formatted_address
        : "Address not found";

    return {
      latitude,
      longitude,
      address,
    };
  } catch (error) {
    Alert.alert('Permission to access location was denied')
    console.error("Geocoding failed:", error.message);
    return {
      latitude: null,
      longitude: null,
      address: "Error fetching location",
    };
  }
};


const getStrictLocation = async () => {
  try {
    //Check existing permission
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();

    if (existingStatus !== 'granted') {
      //Request permission
      const { status: newStatus } = await Location.requestForegroundPermissionsAsync();

      if (newStatus !== 'granted') {
        Alert.alert(
          'Location Required',
          'Location permission is required to use this app.',
          [
            {
              text: 'Exit App',
              onPress: () => BackHandler.exitApp(),
              style: 'destructive',
            },
          ],
          { cancelable: false }
        );
        return null;
      }
    }

  } catch (error) {
    console.error('Error getting location:', error);
    Alert.alert(
      'Location Error',
      'Unable to retrieve location. The app will now close.',
      [
        {
          text: 'Exit',
          onPress: () => BackHandler.exitApp(),
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
    return null;
  }
};

export default {
  getCurrentLocationDetails,
  getStrictLocation,
};





