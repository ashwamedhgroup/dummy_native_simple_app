import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Platform } from "react-native";
import { tabNavigatorOptions } from "../src/styles/appNavigation.style";
import Dashboard from "../screens/Dashboard";
import PaymentScreen from "../screens/Payments";
import OrderScreen from "../screens/Orders";
import CustomHeader from "../src/components/appHeader/CustomHeader";
import ProductScreen from "../screens/Pruducts";
import ContactScreen from "../screens/Contact";
import SocialScreen from "../screens/Social";
import FarmerScreen from "../screens/Farmer";
import FarmerVisitScreen from "../screens/FarmerVisit";
import DealerScreen from "../screens/Dealer";
import DealerUpdateScreen from "../screens/DealerUpdate";
import DealerVisitScreen from "../screens/DealerVisit";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import ProductDetailScreen from "../screens/ProductDetails";
import FarmerUpdateScreen from "../screens/FarmerUpdate";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AUTHENTICATED_MENU_ITEMS = [
  { id: "products", label: "Products", route: "Product", icon: "leaf" },
  { id: "social", label: "Community", route: "Social", icon: "forum" },
  { id: "contact", label: "Support", route: "Contact", icon: "help-circle-outline" },
  { id: "logout", label: "Logout", route: "Login", icon: "logout" },
];

export function TabNavigation() {

  const insets = useSafeAreaInsets();
  return (
    <Tab.Navigator
      initialRouteName="DashboardTab"
      screenOptions={{
        ...tabNavigatorOptions,
        tabBarStyle: {
          ...tabNavigatorOptions.tabBarStyle,
          paddingBottom: insets.bottom || 10, // safe area padding
          height: (insets.bottom || 0) + 50,

        },
      }}
    >
      <Tab.Screen
        name="DashboardTab"
        component={Dashboard}
        options={{
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Orders"
        component={OrderScreen}
        options={{
          tabBarLabel: "Orders",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="cart-outline"
              size={size}
              color={color}
            />
          ),
        }}
      />

      <Tab.Screen
        name="Payments"
        component={PaymentScreen}
        options={{
          tabBarLabel: "Payments",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="currency-inr"
              size={size}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
function AppNavigation() {
  return (
    <Stack.Navigator
      initialRouteName="Main"
      screenOptions={{
        header: () => (
          <CustomHeader userType="auth" menuItems={AUTHENTICATED_MENU_ITEMS} />
        ),
        headerMode: "screen",
        animation:
          Platform.OS === "ios" ? "slide_from_right" : "fade_from_bottom",
      }}
    >

      <Stack.Screen name="Dashboard" component={Dashboard} />
      <Stack.Screen name="Main" component={TabNavigation} />
      <Stack.Screen name="Product" component={ProductScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="Contact" component={ContactScreen} />
      <Stack.Screen name="Social" component={SocialScreen} />
      <Stack.Screen name="Farmer" component={FarmerScreen} />
      <Stack.Screen name="Dealer" component={DealerScreen} />
      <Stack.Screen name="FarmerUpdate" component={FarmerUpdateScreen} />
      <Stack.Screen name="FarmerVisit" component={FarmerVisitScreen} />
      <Stack.Screen name="DealerVisit" component={DealerVisitScreen} />
      <Stack.Screen name="DealerUpdate" component={DealerUpdateScreen} />



    </Stack.Navigator>
  );
}
export default AppNavigation;
