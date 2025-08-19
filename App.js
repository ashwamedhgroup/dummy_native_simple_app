import React, { useEffect, useState } from "react";
import { NavigationContainer, CommonActions } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import { ActivityIndicator, View, Platform } from "react-native";
import AuthContext from "./src/auth/context";
import OfflineNotice from "./src/components/OfflineNotice";
import AppNavigation from "./navigation/AppNavigation";
import AuthNavigator from "./navigation/AuthNavigator";
import { navigation } from "./navigation/NavigationService";
import location from "./src/utility/location";
import authStorage from "./src/auth/storage";
import * as SplashScreen from "expo-splash-screen";
import { checkDeveloperOptions } from "./src/components/checkDeveloperOptions"

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function App() {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        // ✅ Run Developer Options check before anything else
        if (Platform.OS === "android") {
          await checkDeveloperOptions();
        }

        await loadToken();
        await location.getStrictLocation();
      } catch (error) {
        console.error("App init failed:", error);
      } finally {
        setIsReady(true);
      }
    })();
  }, []);

  useEffect(() => {
    if (isReady) {
      if (user) {
        navigation.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Main" }],
          })
        );
      } else {
        navigation.current?.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: "Welcome" }],
          })
        );
      }
    }
  }, [user, isReady]);

  const loadToken = async () => {
    try {
      const token = await authStorage.getUser();
      if (token) {
        console.log("Token loaded and setting user:", token);
        setUser(token);
      }
    } catch (error) {
      console.error("Failed to load token", error);
    }
  };

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#2e7d32" />
      </View>
    );
  }

  return (
    <>
      <OfflineNotice />
      <AuthContext.Provider value={{ user, setUser }}>
        <NavigationContainer ref={navigation} key={user ? "auth" : "guest"}>
          {user ? <AppNavigation /> : <AuthNavigator />}
        </NavigationContainer>
      </AuthContext.Provider>
      <Toast />
    </>
  );
}
