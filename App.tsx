

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
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

const Stack = createNativeStackNavigator();

export default function App() {

  const [fontsLoaded] = useFonts({
    'Janda': require('./Janda.ttf'), // Adjust the path if necessary
  });
  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <EventProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerStyle: {
                backgroundColor:"white",
              },
              headerTintColor: "black",
            }}
          >
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Duolingo Algebra" component={InteractiveInput}/>
            {/*<Stack.Screen name="Duolingo Algebra" component={Duolingo} initialParams={{ isActive: true}}/>*/}
            <Stack.Screen name="Function Graph" component={Graph} />
            <Stack.Screen name="Fraction Method" component={Atome} />
            <Stack.Screen 
              name="Home Screen" 
              component={HomeScreen} 
              options={{ headerShown: false }}  // Disable header for HomeScreen
            />
          </Stack.Navigator>
        </NavigationContainer>
        </EventProvider>  
    </GestureHandlerRootView>
  );
}
