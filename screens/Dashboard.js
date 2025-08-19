import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useContext, useEffect, useRef, useState } from "react";
import { Alert, Animated, Text, TouchableHighlight, View } from "react-native";
import apiClient from "../src/api/client"
import authContext from "../src/auth/context"
import authStorage from "../src/auth/storage";
import {navigation} from "../navigation/NavigationService"
import { styles } from "../src/styles/dashboard.style";
import Location from "../src/utility/location";
import storage from "../src/utility/storage";


const INPUNCH_URL = process.env.EXPO_PUBLIC_INPUNCH_URL;
const OUTPUNCH_URL = process.env.EXPO_PUBLIC_OUTPUNCH_URL;


function Dashboard() {
  const [hasInpunch, setHasInpunch] = useState(false);
  const [inpunchId, setInpunchId] = useState(null);
  const { setUser } = useContext(authContext); 


  // Check punch status and maintain login state
  useEffect(() => {
    const checkPunchStatus = async () => {
      try {
        const response = await apiClient.get("/track/punch-in/");
        const { punched_in, punched_out, punch_id } = response.data;

        if (punched_in == true && punched_out == false) {
          const punchId = String(punch_id);
          await storage.set("punchId", punchId);
          setInpunchId(punchId);
          setHasInpunch(true);

          // Ensure user stays logged in
          const token = await authStorage.getUser();
          if (token) {
            setUser(token);
          }
        } else if (punched_in == true && punched_out == true) {
          setHasInpunch(false);
          // Don't clear storage on completed punch - user should stay logged in
        } else {
          setHasInpunch(false);
          setInpunchId(null);
        }
      } catch (error) {
        // console.error("Error checking punch status:", error);
        return null;
      }
    };

    checkPunchStatus();
  }, [setUser]);

  const handleInpunch = async () => {
    try {
      const { latitude, longitude } =
        await Location.getCurrentLocationDetails();

      const payload = {
        latitude: Number(latitude.toFixed(6)),
        longitude: Number(longitude.toFixed(6)),
      };

      const response = await apiClient.post(INPUNCH_URL, payload);
      const id = String(response.data.id);

      await AsyncStorage.setItem("id", id);
      setInpunchId(id);
      setHasInpunch(true);
      Alert.alert(
        "Success",
        "Inpunch recorded successfully",
        [{ text: "OK" }],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert(
        "Punch In Restricted",
        "You can only record one inpunch per day",
        [{ text: "OK" }],
        { cancelable: true }
      );
    }
  };

  const handleOutpunch = async () => {
    try {
      const { latitude, longitude } = await Location.getCurrentLocationDetails(
        {}
      );

      const payload = {
        outpunch_latitude: Number(latitude.toFixed(8)),
        outpunch_longitude: Number(longitude.toFixed(8)),
      };

      await apiClient.patch(`${OUTPUNCH_URL}${inpunchId}/`, payload);

      // Only remove punch-related data, keep user logged in
      await AsyncStorage.removeItem("id");
      await AsyncStorage.removeItem("punchId");

      setInpunchId(null);
      setHasInpunch(false);
       Alert.alert(
        "Success",
        "Outpunch recorded successfully",
         [{ text: "OK"}],
        { cancelable: true }
      );
    } catch (error) {
      Alert.alert("Error", "Failed to record outpunch. Please try again.");
    }
  };

  const AnimatedSubContainer = ({ children, delay = 0 }) => {
    const scaleAnim = useRef(new Animated.Value(0)).current;
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          friction: 8,
          tension: 100,
          delay,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          delay,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        }}
      >
        {children}
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      
      {/* Status Badge */}
      <View
        style={[
          styles.statusBadge,
          hasInpunch
            ? styles.statusBadgeActive
            : styles.statusBadgeInactive,
        ]}
      >
        <Ionicons
          name={hasInpunch ? "checkmark-circle" : "time-outline"}
          size={16}
          color={hasInpunch ? "#2E7D32" : "#FF8F00"}
        />
        <Text
          style={[
            styles.statusText,
            hasInpunch
              ? styles.statusTextActive
              : styles.statusTextInactive,
          ]}
        >
          {hasInpunch ? "Punched In" : "Not Punched"}
        </Text>
      </View>

      {/* Main Content */}
      <View style={styles.mainContent}>
        {/* Punch Button Section */}
        <AnimatedSubContainer delay={100}>
          <View style={styles.punchSection}>
            <TouchableHighlight
              style={[
                styles.punchButton,
                hasInpunch
                  ? styles.punchButtonActive
                  : styles.punchButtonInactive,
              ]}
              onPress={hasInpunch ? handleOutpunch : handleInpunch}
              underlayColor={hasInpunch ? "#45A049" : "#E53935"}
              activeOpacity={0.8}
            >
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name={hasInpunch ? "log-out-outline" : "log-in-outline"}
                  size={32}
                  color="#FFFFFF"
                  style={styles.punchIcon}
                />
                <Text style={styles.punchButtonText}>
                  {hasInpunch ? "Punch Out" : "Punch In"}
                </Text>
              </View>
            </TouchableHighlight>
          </View>
        </AnimatedSubContainer>

        {/* Action Cards Grid */}
        <View style={styles.actionsGrid}>
          <AnimatedSubContainer delay={200}>
            <TouchableHighlight
              style={[
                styles.actionCard,
                !inpunchId && styles.actionCardDisabled,
              ]}
              onPress={() => {
                if (!inpunchId) {
                  Alert.alert(
                    "Blocked",
                    "Please complete Inpunch before continuing."
                  );
                  return;
                }
                navigation.navigate("Farmer", { inpunch_id: inpunchId });
              }}
              underlayColor="#F5F5F5"
              activeOpacity={inpunchId ? 0.7 : 1}
            >
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name="leaf-outline"
                  size={32}
                  color={inpunchId ? "#2E7D32" : "#757575"}
                  style={styles.actionIcon}
                />
                <Text
                  style={[
                    styles.actionTitle,
                    !inpunchId && styles.actionTitleDisabled,
                  ]}
                >
                  Farmer Enquiry
                </Text>
              </View>
            </TouchableHighlight>
          </AnimatedSubContainer>

          <AnimatedSubContainer delay={300}>
            <TouchableHighlight
              style={[
                styles.actionCard,
                !inpunchId && styles.actionCardDisabled,
              ]}
              onPress={() => {
                if (!inpunchId) {
                  Alert.alert(
                    "Blocked",
                    "Please complete Inpunch before continuing."
                  );
                  return;
                }
                navigation.navigate("Dealer");
              }}
              underlayColor="#F5F5F5"
              activeOpacity={inpunchId ? 0.7 : 1}
            >
              <View style={{ alignItems: "center" }}>
                <Ionicons
                  name="storefront-outline"
                  size={32}
                  color={inpunchId ? "#FF8F00" : "#757575"}
                  style={styles.actionIcon}
                />
                <Text
                  style={[
                    styles.actionTitle,
                    !inpunchId && styles.actionTitleDisabled,
                  ]}
                >
                  Dealer Enquiry
                </Text>
              </View>
            </TouchableHighlight>
          </AnimatedSubContainer>
        </View>
      </View>
    </View>
  );
}

export default Dashboard;

