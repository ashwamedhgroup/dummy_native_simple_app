import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Alert, Text, View } from "react-native";
import apiClient from "../src/api/client";
import EntityVisitList from "../src/components/Farmer-Dealer/EntityVisitList";
import FarmerForm from "../src/components/Farmer-Dealer/FarmerForm";
import styles from "../src/styles/farmer-dealer.style";
import Location from "../src/utility/location";
import storage from "../src/utility/storage";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FarmerScreen = () => {
  const insets = useSafeAreaInsets();
  const [farmerForm, setFarmerForm] = useState(false);
  const [farmerData, setFarmerData] = useState([]);
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [farmerListLoading, setFarmerListLoading] = useState(false);
  const [punchId, setPunchId] = useState(null);
  const cancelTokenRef = useRef(null);

  const getInpunchId = async () => {
    try {
      const id1 = await storage.get("id");
      const id2 = await storage.get("punchId");
      return id1 || id2 || null;
    } catch (error) {
      console.error("Error retrieving inpunch id:", error);
      return null;
    }
  };

  useEffect(() => {
    let isMounted = true;

    const getData = async () => {
      const inpunchId = await getInpunchId();
      if (isMounted) setPunchId(inpunchId);
    };

    getData();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenForm = async () => {
    setLoading(true);
    try {
      setFarmerForm(true);
      const { latitude, longitude, address } =
        await Location.getCurrentLocationDetails();

      if (latitude && longitude && address) {
        setLocation(address);
      } else {
        throw new Error("Invalid location data");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch location");
    } finally {
      setLoading(false);
    }
  };

  const fetchFarmer = async () => {
    setFarmerListLoading(true);

    try {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel("Cancelled due to new request");
      }

      cancelTokenRef.current = axios.CancelToken.source();

      const { latitude, longitude } =
        await Location.getCurrentLocationDetails();

      if (!latitude || !longitude) throw new Error("Invalid location");

      const payload = {
        lat: Number(latitude.toFixed(6)),
        lon: Number(longitude.toFixed(6)),
      };

      const response = await apiClient.post("track/nearby-farmers/", payload, {
        cancelToken: cancelTokenRef.current.token,
        timeout: 5000,
      });

      const farmerList = response.data?.farmers || [];

      console.log("Farmer Data:", response.data);
      setFarmerData(farmerList);
    } catch (error) {
      Alert.alert("Error", "Farmer not found");
    } finally {
      setFarmerListLoading(false);
    } 
  };

  useEffect(() => {
    fetchFarmer();
  }, []);

  return (
    <View style={{flex:1,paddingBottom: insets.bottom }}>
      {!farmerForm ? (
        <EntityVisitList
          type="Farmer"
          data={farmerData}
          loading={loading}
          // entityLoading={farmerListLoading}
          punch_id={punchId}
          handleForm={handleOpenForm}
          endpoint="track/start-visit/"
          ScreenUpdate="FarmerUpdate"
          visitScreen="FarmerVisit"
          onRefresh={fetchFarmer}
          refreshing={farmerListLoading}
        />
      ) : (
        <View style={styles.virtualScreen}>
          <View style={styles.virtualHeader}>
            <Text style={styles.virtualTitle}>Add Farmer</Text>
            <Text
              onPress={() => setFarmerForm(false)}
              style={styles.virtualClose}
            >
              ← Back
            </Text>
          </View>
          <FarmerForm
            location={location}
            stateFarmerForm={setFarmerForm}
            setfetchFarmer={fetchFarmer}
          />
        </View>
      )}
    </View>
  );
};

export default FarmerScreen;
