// screens/HomeScreen.js
import React,{useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Button ,ScrollView,StatusBar, TouchableWithoutFeedback} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomTabBar from './CustomTabBar';
import HomeScreenContent from './HomeScreenContent';
import ActivitesScreenContent from './ActivitesScreenContent';
import useStore from './Store';
import Animated, { useSharedValue,useAnimatedProps, SlideInRight, SlideOutRight, useAnimatedStyle } from 'react-native-reanimated';
import Header from './Header';
import Content from './Content';
import Keyboard from '../Duolingo/Keyboard';
import axios from 'axios';
import { analyzeExpression } from '../Fraction/Fraction';
const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const handleNavigateToNewScreen = (navigation) => () => navigation.navigate('NewScreen');

const CoursScreen = React.memo(({ navigation }) => (
  <View style={styles.content}>
    <Text style={styles.welcomeText}>Cours</Text>
    <Button
      title="Go to New Screen"
      onPress={handleNavigateToNewScreen(navigation)}
    />
  </View>
));
/*useEffect(() => {
    if (shouldHideTab && words.length===0) {
      // Fetch words when shouldHideTab is true
      axios.get('http://192.168.43.178:8000/activity/field=Algebra&chapter=Fraction&level=Basic/')
        .then(response => {
          const expression = response.data.expression;
          const analyzed =analyzeExpression(expression);
          // Split the expression into words (terms)
          const terms = ['A=', ...analyzed.item_list.map(item=>item.sign+item.value)];
          //console.log(terms);
          
          const duoList = terms.map((term, index) => ({ id: index, word: term }));
          prevWordsRef.current = true
          setWords(duoList); // Set the fetched words
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch(error => {
          console.error("Error fetching words:", error);
        });
    }else{
      if (shouldHideTab && words.length!==0) {
        setLoading(true)
        axios.get('http://192.168.43.178:8000/activity/field=Algebra&chapter=Fraction&level=Basic/')
        .then(response => {
          const expression = response.data.expression;
         
          
          const analyzed =analyzeExpression(expression);
          // Split the expression into words (terms)
          const terms = ['A=', ...analyzed.item_list.map(item=>item.index===0 || !item.isfraction&&item.sign!=='-'
              ?item.value : !item.isfraction&&item.sign==='-'&&item.value[0]==='-'? item.value.slice(1) : item.sign+item.value)];
          console.log(expression,terms);
          const duoList = terms.map((term, index) => ({ id: index, word: term }));
          prevWordsRef.current = true
          setWords(duoList); // Set the fetched words
          setLoading(false); // Set loading to false once data is fetched
        })
        .catch(error => {
          console.error("Error fetching words:", error);
        });
      }
    }
  }, [shouldHideTab]);*/
const words1 = [
  {id:1,word:'A ='},
  {id:2,word:'3x+2'},
  {id:3,word:'-x/(x-4)'},
  {id:4,word:'+( 2x - 3 )'},
  {id:5,word:'+4'},

]
const PlanningScreen = () => {
  const {setShouldHideTab,shouldHideTab} = useStore()
  const keyboardHeight=useSharedValue(0)
  const animatedText = useSharedValue([])
  const [loading, setLoading] = useState(false); // State for loading
  const [words, setWords] = useState(words1); // State for holding words
  const prevWordsRef = useRef(false); // UseRef to store previous words state for comparison
  const animatedStyle = useAnimatedStyle(()=>{
    
    return{
      position:'absolute',
      top:0,
      bottom:0,
      left:0,
      right:0,
      backgroundColor:'transparent',
      display:keyboardHeight.value===0?'none':'flex',
      zIndex:200,
    }
  })
  if (shouldHideTab) {
    return(
      <Animated.View style={{
        backgroundColor:'#f7f7f7',
        flex:1,
      }} entering={SlideInRight.duration(500)} exiting={SlideOutRight.duration(500)}>
        <Header keyboardHeight={keyboardHeight}/>
        {!loading && (
          <>            
            <Content keyboardHeight={keyboardHeight} words={words} animatedText={animatedText}/>
            <Keyboard keyboardHeight={keyboardHeight} animatedText={animatedText}/>
          </>        
        )}
        <Animated.View style={animatedStyle}></Animated.View>

      
      </Animated.View>
    )
  } else {
    return(
      <View style={styles.content}>
      <TouchableWithoutFeedback onPress={()=>{
          setShouldHideTab(!shouldHideTab)
        }}>
        <View style={{padding:10,borderWidth:1.5,borderRadius:8,borderColor:'#cfc6c6'}}>
          <Text style={styles.welcomeText}>Algebra</Text>
        </View>
      </TouchableWithoutFeedback>
      </View>
    )
  }
};

const SoutienScreen = () => (
  <View style={styles.content}>
    <Text style={styles.welcomeText}>Soutien</Text>
  </View>
);

// Tab Navigator Component
function TabNavigator() {
  return (
    <Tab.Navigator
      
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
        lazy:true
      }}
      
    >
      <Tab.Screen name="Home" component={HomeScreenContent} />
      <Tab.Screen name="Cours" component={CoursScreen} />
      <Tab.Screen
        name="Activités"
        component={ActivitesScreenContent}
        options={{ tabBarStyle: { display: 'none' } }}
      />
      <Tab.Screen name="Planning" component={PlanningScreen} />
      <Tab.Screen name="Soutien" component={SoutienScreen} />
    </Tab.Navigator>
  );
}

// New Screen Component
const NewScreen = () => (
  <View style={styles.content}>
    <Text style={styles.welcomeText}>This is a new screen without the tab bar</Text>
  </View>
);

// Main HomeScreen Component with Stack Navigator
export default function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {/* Main Tab Navigator */}
      <Stack.Screen name="MainTabs" component={TabNavigator} />
      {/* New screen where tab bar is hidden */}
      <Stack.Screen name="NewScreen" component={NewScreen} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor:'white'
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
