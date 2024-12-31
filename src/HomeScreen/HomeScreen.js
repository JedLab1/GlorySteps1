// screens/HomeScreen.js
import React,{useEffect,useState,useRef} from 'react';
import { View, Text, StyleSheet, Button ,ScrollView,StatusBar, TouchableWithoutFeedback,TouchableOpacity, SafeAreaView} from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import CustomTabBar from './CustomTabBar';
import HomeScreenContent from './HomeScreenContent';
import ActivitesScreenContent from './ActivitesScreenContent';
import useStore from './Store';
import Animated, { useSharedValue,useAnimatedProps, SlideInRight, SlideOutRight, useAnimatedStyle } from 'react-native-reanimated';
import Header, { TestSvg } from './Header';
import Content from './Content';
import Keyboard from '../Duolingo/Keyboard';
import axios from 'axios';
import { analyzeExpression } from '../Fraction/Fraction';
import Graph, { ArrowSvg } from '../Function/Graph';
import FunctionSvg from './svg/FunctionSvg';
import { rotate } from 'react-native-redash';
import FractionMethod from '../Method/FractionMethod';
import Atome from '../Method/Atome';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const handleNavigateToNewScreen = (navigation) => () => navigation.navigate('NewScreen');

const CoursScreen = React.memo(({ navigation }) => (
  <View style={[styles.content,{paddingLeft:10,gap:10,}]}>
    <Text style={{fontSize:20,fontWeight:'bold'}}>Cours</Text>
    <TouchableOpacity
     style={{alignSelf:'flex-start',padding:10,borderWidth:1.5,borderColor:'#cfc6c6', borderRadius:10}}
      onPress={handleNavigateToNewScreen(navigation)}
    >
      <Text style={styles.welcomeText}>Méthodes</Text>
    </TouchableOpacity>
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
  {id:2,word:'3x'},
  {id:3,word:'-4'},
  {id:4,word:'-5x'},
  
  {id:5,word:'-12x'},
  {id:6,word:'+3/4'},

]
const PlanningScreen = () => {
  const {setShouldHideTab,shouldHideTab} = useStore()
  const keyboardHeight=useSharedValue(0)
  const [showFuncion,setShowFunction] = useState(false)
  const [showChemistry,setShowChemistry] = useState(false)
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

    if (showFuncion) {
      return(
        <Animated.View style={{
          backgroundColor:'#fff',
          flex:1,
        }} entering={SlideInRight.duration(500)} exiting={SlideOutRight.duration(500)}>
          <Header keyboardHeight={keyboardHeight} isFunction={true} setShowFunction={setShowFunction}/>
          <Graph/>
          <Animated.View style={animatedStyle}></Animated.View>
        </Animated.View>
      )

    }
    if (showChemistry) {
      return(
        <Animated.View style={{
          backgroundColor:'#fff',
          flex:1,
        }} entering={SlideInRight.duration(500)} exiting={SlideOutRight.duration(500)}>
          <Header keyboardHeight={keyboardHeight} isFunction={false} isChemistry={true} setShowFunction={setShowFunction} 
          setShowChemistry={setShowChemistry}/>
          <Atome/>
          <Animated.View style={animatedStyle}></Animated.View>
        </Animated.View>
      )
    }
    else{
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
    }

  } else { 
    return(
      <SafeAreaView style={styles.content}>
        
      <View style={{alignSelf:'center',flexDirection:'row',justifyContent:'center',borderRadius:10,backgroundColor:'#E8E6E8',padding:3}}>
        <View style={{paddingHorizontal:5,backgroundColor:'#fff',borderRadius:8,justifyContent:'center'}}>
        <Text style={{fontFamily:'Poppins-Regular'}}>Maths</Text>
        </View>
        <View style={{padding:5}}>
        <Text style={{fontFamily:'Poppins-Regular'}}>Phy-Chimie</Text>  
        </View>
        
        
      </View>
      <View style={{padding:20,gap:15}}>

          
        <View style={{paddingVertical:6,paddingHorizontal:10,borderWidth:1.5,borderRadius:25,borderColor:'#cfc6c6',flexDirection:'row',alignItems:'center',gap:10}}>
          <TestSvg/>
          <Text style={styles.welcomeText}>Calcul Algébrique</Text>
          <TouchableOpacity
          style={{marginLeft:'auto'}}
            onPress={()=>{
            setShouldHideTab(!shouldHideTab)
            }}>
          
          <ArrowSvg/>
       
          </TouchableOpacity>
          
        </View>
    

        <View style={{paddingVertical:6,paddingHorizontal:10,borderWidth:1.5,borderRadius:25,borderColor:'#cfc6c6',flexDirection:'row',alignItems:'center',gap:10}}>
          <View style={{height:40,width:40,backgroundColor:'#6555C0',borderRadius:100,alignItems:'center',justifyContent:'center'}}>
            <FunctionSvg/>
          </View>
          <Text style={styles.welcomeText}>Analyse de fonction</Text>
          <TouchableOpacity
          style={{marginLeft:'auto'}}
            onPress={() => {
            setShowFunction(true);
           setShouldHideTab(prev => !prev);
           }} 
           >
          
          <ArrowSvg/>
          
          </TouchableOpacity>
        </View>
   
      <View style={{paddingVertical:6,paddingHorizontal:10,borderWidth:1.5,borderRadius:25,borderColor:'#cfc6c6',flexDirection:'row',alignItems:'center',gap:10}}>
          <TestSvg/>
          <Text style={styles.welcomeText}>Résolution d'équation</Text>
          <TouchableOpacity
          style={{marginLeft:'auto'}}
            onPress={() => {
            setShowChemistry(true);
           setShouldHideTab(prev => !prev);
           }} 
           >
          
          <ArrowSvg/>
          
          </TouchableOpacity>
          
        </View>
      </View>

      </SafeAreaView>
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
        component={PlanningScreen}
      />
      <Tab.Screen name="Plans" component={PlanningScreen} />
      <Tab.Screen name="Soutien" component={SoutienScreen} />
    </Tab.Navigator>
  );
}
const handleNavigateToMain = (navigation) => () => navigation.navigate('MainTabs');
// New Screen Component
const NewScreen = ({navigation}) => (
  <View style={styles.content}>
    <View style={{width:'84%',flexDirection:'row',paddingHorizontal:10,alignItems:'center'}}>
    <TouchableOpacity 
    onPress={handleNavigateToMain(navigation)}>
    <View style={{transform:[{rotate:'180deg'}],borderWidth:2, borderRadius:100,padding:3,borderColor:'#E7E4E4'}}>
      <ArrowSvg/>
    </View>
    </TouchableOpacity>
    <View style={{marginLeft:'auto'}}>
    <Text style={styles.welcomeText}>Simplification des fractions</Text>
    </View>
    </View>
    <FractionMethod/>

  </View>
);

// Main HomeScreen Component with Stack Navigator
export default function HomeScreen() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false,animation: 'slide_from_right', }}>
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
    backgroundColor:'white',
    paddingTop:StatusBar.currentHeight+10,
  },
  welcomeText: {
    fontSize: 16,
    fontFamily:'Poppins-Regular'
  },
  chapterContainer:{
    width:50,
    height:50,
    backgroundColor:'#fff',
    borderRadius:100,
    overflow:'hidden',
    justifyContent:'center',
    alignItems:'center',
    transform:[{translateX:-20}]
  }
});
