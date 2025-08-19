import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/Login';
import { TabNavigation } from './AppNavigation';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator initialRouteName='Login'>
      <Stack.Screen
        name="Login" component={LoginScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="Main" component={TabNavigation} />
       <Stack.Screen
        name="Welcome" component={LoginScreen} options={{ headerShown: false }}/> 
    </Stack.Navigator>
  );
}
