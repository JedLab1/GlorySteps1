import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from '@react-navigation/stack';
import { Home } from "./src/Home";
import HomeScreen from "./src/HomeScreen/HomeScreen";
import Duolingo from "./src/Duolingo/Duolingo";
import  Graph  from "./src/Function/Graph";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { EventProvider } from 'react-native-outside-press';
import { useFonts } from 'expo-font';
import InteractiveInput from "./src/Keyboard/InteractiveInput";
import FractionMethod from "./src/Method/FractionMethod";
import Atome from "./src/Method/Atome";
import { StatusBar } from "expo-status-bar";
import { useEffect,useState } from "react";
import * as SplashScreen from 'expo-splash-screen'; // Import SplashScreen
import { Text ,View} from "react-native";
import HomeScreenContent from "./src/HomeScreen/HomeScreenContent";
import { enableScreens } from 'react-native-screens';

enableScreens();
const Stack = createStackNavigator();

// Keep the splash screen visible until the app is ready


export default function App() {
  const [fontsLoaded] = useFonts({
    'Janda': require('./Janda.ttf'),
    'Poppins-Regular' : require('./Poppins-Regular.ttf'),
    'Poppins-SemiBold' : require('./Poppins-SemiBold.ttf'),
  });
  
  const [isReady, setIsReady] = useState(false); // To track if everything is ready

  useEffect(() => {
    async function prepare() {
      try {
        // Prevent splash screen from hiding automatically
        await SplashScreen.preventAutoHideAsync();
        console.log('Splash screen is being shown.');

        // Wait for fonts to load
        if (!fontsLoaded) {
          return; // Do nothing if fonts aren't loaded
        }

        // Everything is ready, hide the splash screen
        await SplashScreen.hideAsync();
        console.log('Splash screen hidden.');

        // Update state to indicate the app is ready
        setIsReady(true);

      } catch (error) {
        console.error('Error during splash screen preparation:', error);
      }
    }

    prepare();
  }, [fontsLoaded]); // Dependency on fontsLoaded to trigger when it's ready

  // If fonts are not loaded, return null to keep the splash screen visible
  if (!fontsLoaded || !isReady) {
    return null; // Keep the splash visible until both are ready
  }
  return (
    <GestureHandlerRootView style={{ flex: 1}}>
      <EventProvider>
        <NavigationContainer>
          <HomeScreen/>
        </NavigationContainer>
        </EventProvider>  
    </GestureHandlerRootView>
  );
}
/**          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor:"white",
              },
              headerTintColor: "black",
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Duolingo Algebra" component={InteractiveInput}/>
            {/*<Stack.Screen name="Duolingo Algebra" component={Duolingo} initialParams={{ isActive: true}}/>*//*}
            <Stack.Screen name="Function Graph" component={Graph} />
            <Stack.Screen name="Fraction Method" component={Atome} />
            <Stack.Screen 
              name="Home Screen" 
              component={HomeScreen} 
              options={{ headerShown: false }}  // Disable header for HomeScreen
            />
          </Stack.Navigator> */
