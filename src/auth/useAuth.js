import { useContext } from "react";
import logoutApi from "../api/logout"
import authContext from "./context";
import authStorage from "./storage"
import AsyncStorage from "@react-native-async-storage/async-storage";
import showToast from "../utility/showToast";
import navigation from "../../navigation/NavigationService"

const useAuth = () => {
  const { user, setUser } = useContext(authContext);

  const logIn = async (authToken) => {
    try {
      setUser(authToken);
      await authStorage.storeToken(authToken);
    } catch (error) {
      console.error("Login failed to decode or store token:", error);
    }
  };

  const logOut = async () => {
    try {
      const token = await authStorage.getUser();

      console.log("Logging out user:", token);

      if (!token) {
        console.warn("No token found. User already logged out.");
        return;
      }

      await logoutApi.logoutAction();

      setUser(null);
      await authStorage.removeToken();
      await AsyncStorage.clear();
      navigation.navigate("Login");
      showToast.success(
        "Logout successful",
        "You have been logged out successfully."
      );
      console.log("Logout successful and storage cleared.");
      return { success: true };
    } catch (error) {
      showToast.error("Logout failed", "An error occurred while logging out.");
      return { success: false, error };
    }
  };

  return { user, logIn, logOut };
};

export default useAuth;
