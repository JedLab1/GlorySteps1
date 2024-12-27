import React from "react";
import { StyleSheet, View, Text ,TouchableOpacity} from "react-native";
import { Gesture, GestureDetector, Directions } from "react-native-gesture-handler";
import Animated,{ useAnimatedRef, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import CheckSvg from '../HomeScreen/svg/CheckSvg';
import { CloseSvg } from "../HomeScreen/Header";
export default FractionMethod = () => {
  const handleVerif = ()=>{

  }
  const startLine = useSharedValue(false)
  const endLine = useSharedValue(false)
  const pan = Gesture.Pan()
  .onBegin((e)=>{
    
    
  })
  .onUpdate((e)=>{

  })
  .onEnd((e)=>{
  })
  const startLineStyle = useAnimatedStyle(()=>{
    return{
      backgroundColor: withTiming(startLine.value?'black':'transparent')
    }
  })
  const endLineStyle = useAnimatedStyle(()=>{
    return{
      backgroundColor: withTiming(startLine.value?'black':'transparent')
    }
  })
  const LineStyle = useAnimatedStyle(()=>{
    return{
      height:withTiming(startLine.value?39:0)
    }
  })
  return (
    <View style={{flex:1,backgroundColor:'white',justifyContent:'center',alignItems: 'center',flexDirection:'row'}}>
    <View style={styles.container}>
    
      <View style={styles.numeratorContainer} onTouchEnd={()=>{startLine.value=true}}>

        <View>
      
        <Animated.View style={[{width:2,
          position:'absolute',backgroundColor:'black',
          transform:[{rotate:'-39deg'}],left:10,top:-5,zIndex:1
          },LineStyle]} />
       
        <Animated.View style={[{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',
        position:'absolute',top:-7,left:-7},startLineStyle]}/>
        <Text style={[styles.text,{fontSize:24}]}>
          {'6'}
        </Text>
         
        <Animated.View style={[{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',
        position:'absolute',bottom:0,right:-7},endLineStyle]}/>
        </View>
        <CloseSvg/>
        <View>
        <View style={{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',
        position:'absolute',top:-7,left:-7}}/>
        <Text style={[styles.text,{fontSize:24}]}>
          {'3'}
        </Text>
        <View style={{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',
        position:'absolute',bottom:0,right:-7}}/>
        </View>
      </View>
      
      <Animated.View style={[styles.line]} />
      <View style={styles.numeratorContainer}>
        
      <View>
        <View style={{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',
        position:'absolute',top:-7,left:-3}}/>
        <Text style={[styles.text,{fontSize:24}]}>
          {'-4'}
        </Text>
        <View style={{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',
        position:'absolute',bottom:-3,right:-7}}/>
        </View>
      <CloseSvg/>
      <View>
      <View style={{width:2,height:40,
          position:'absolute',backgroundColor:'black',
          transform:[{rotate:'-38deg'}],left:10,top:-5,zIndex:1
          }}/>
        <View style={{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',backgroundColor:'black',
        position:'absolute',top:-7,left:-7}}/>
        <Text style={[styles.text,{fontSize:24}]}>
          {'2'}
        </Text>
        <View style={{borderWidth:1.2,padding:2.5,alignSelf:'flex-start',borderRadius:100,borderColor:'#d7d6d7',backgroundColor:'black',
        position:'absolute',bottom:-3,right:-7}}/>
        </View>
      </View>
    </View>
    <TouchableOpacity style={{position:'absolute',bottom:20}} onPress={handleVerif}>
    <View
      style={{backgroundColor:'white', borderColor: '#FF9A24',
      borderRadius:100 , paddingVertical:10,paddingHorizontal:7,borderWidth:2,zIndex:-1
      }}> 
      <View style={{transform:[{translateY:-7}]}}>   
      <CheckSvg/>
      </View>   
    </View>
    </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap:1
  },
  numeratorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:2,
    paddingVertical:10,
    gap:10
  },
  nestedNumerator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  line: {
    height: 2,
    width: '100%',
    backgroundColor:'#000',
    borderRadius: 3, // Rounded edges

  },
  text: {
    fontFamily:'Janda',
    lineHeight:33,
    marginHorizontal:3,

  },
});