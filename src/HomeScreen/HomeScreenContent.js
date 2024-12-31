import { SafeAreaView, View, Text, StyleSheet, StatusBar, Platform ,Image} from 'react-native';
import React from 'react'
import ChatSvg from './svg/ChatSvg';
import {
  Canvas,
  Rect,
  LinearGradient,
  RoundedRect,
  Skia,
  Shader,
  vec
} from "@shopify/react-native-skia";
import Svg, { Path } from "react-native-svg"

const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'ios' ? 20 : 0);
const AlertSvg = ()=> {
  return (
    <Svg
      width={16}
      height={16}
      viewBox="0 0 19 19"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <Path
        d="M9.49 18.238A8.744 8.744 0 01.747 9.494 8.744 8.744 0 019.491.749a8.744 8.744 0 018.744 8.745 8.745 8.745 0 01-8.744 8.744zm0-1.749a6.996 6.996 0 100-13.992 6.996 6.996 0 000 13.992zM8.617 5.121h1.75v1.75h-1.75V5.12zm0 3.498h1.75v5.247h-1.75V8.619z"
        fill="#F6833D"
      />
    </Svg>
  )
}
const ClockSvg = ()=> {
  return (
    <Svg
      width={11}
      height={12}
      viewBox="0 0 11 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      
    >
      <Path
        d="M5.351 11.056a5.101 5.101 0 110-10.202 5.101 5.101 0 010 10.202zm0-1.02a4.08 4.08 0 100-8.162 4.08 4.08 0 000 8.162zm.51-4.08h2.04v1.02h-3.06V3.404h1.02v2.55z"
        fill="#D52A2A"
      />
    </Svg>
  )
}

export default function HomeScreenContent() {

  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Text style={{color:'white',fontSize:18,lineHeight:24,fontFamily:'Poppins-SemiBold'}}>A</Text>
        </View>
        <Image
        source={require('./svg/crown.png')}
        style={{width:30,height:30}}
        />
        <ChatSvg/>
      </View>
      <View style={styles.welcomeTextContainer}>

        <Text style={styles.welcomeText}>Hello Akram 👋,</Text>
      </View>
      <View style={styles.statsContainer}>
        <View style={{flexDirection:'row'}}>
          <View style={{flex:6,paddingVertical:10,paddingLeft:10,justifyContent:'center',gap:5}}>
            <View style={{flexDirection:'row',alignItems:'center',gap:7}}>
              <Text style={{fontSize:36,fontFamily:'Poppins-Regular',color:'white'}}>15%</Text>
              <Text style={{color:'white',transform:[{translateY:7}],fontFamily:'Poppins-Regular'}}>total révisions</Text>
            </View>
            <View>
              <Text style={{color:'white',fontFamily:'Poppins-Regular'}}>Obtiens 100% de ton total révision pour être au top dans tes évals.</Text>
            </View>
          </View>
          <View style={{flex:4,paddingVertical:10,alignItems:'flex-end',justifyContent:'center',marginRight:13}}>
            <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',borderRadius:7,paddingHorizontal:5}}>
              <Text style={{color:"#495ECA",fontFamily:'Poppins-SemiBold',lineHeight:22,paddingTop:3}}>Let's Go</Text>
            </View>
          </View>
        </View>
        <View style={styles.circleTopLeft}></View>
        <View style={styles.circleBottomRight}></View>
      </View>
      <View style={{paddingHorizontal:10,paddingTop:20,gap:10}}>
        <View style={{flexDirection:'row', alignItems:'center', gap:5}}>
          <Text style={{fontSize:16,fontFamily:'Poppins-SemiBold'}}>2 évaluations à venir</Text>
          <AlertSvg/>
        </View>
        <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-around'}}>
          <View>
             <Text style={{fontSize:16,fontFamily:'Poppins-SemiBold'}}>Les intervalles</Text>
             <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
             <View style={{backgroundColor:'#E8EBFF',alignSelf:'flex-start',paddingHorizontal:8,borderRadius:10,paddingTop:3}}>
              <Text style={{color:'#495ECA',fontFamily:'Poppins-Regular',fontSize:12}}>Maths</Text>
             </View>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <ClockSvg/>
              <Text style={{color:'#D42A2A',fontFamily:'Poppins-Regular',fontSize:12,paddingTop:3}}>1j:10Hr</Text>
             </View>
             </View>
          </View>
          <View>
           <Text style={{fontSize:16,fontFamily:'Poppins-SemiBold'}}>Molécules</Text>
           <View style={{flexDirection:'row',alignItems:'center',gap:5}}>
           <View style={{backgroundColor:'#FFF4ED',alignSelf:'flex-start',paddingHorizontal:8,borderRadius:10,paddingTop:3}}>
              <Text style={{color:'#F6833D',fontFamily:'Poppins-Regular',fontSize:12}}>Chimie</Text>
            </View>
            <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}>
              <ClockSvg/>
              <Text style={{color:'#D42A2A',fontFamily:'Poppins-Regular',fontSize:12,paddingTop:3}}>2j:3Hr</Text>
             </View>
          </View>
          </View>
        </View>
      </View>
     
      <View style={{paddingHorizontal:10,paddingTop:20}}>
        <Text style={{fontSize:18,fontFamily:'Poppins-Regular'}}>Stats :</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center', paddingHorizontal:10,paddingTop:10,gap:20}}>
        <View style={{paddingHorizontal:10,backgroundColor:'black',borderRadius:15,paddingVertical:12,overflow:'hidden'}}>
        <Canvas style={{position:'absolute',...StyleSheet.absoluteFillObject}}>
          <Rect x={0} y={0} width={220} height={120}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(120, 120)}
              colors={["#548AD8", "#8A4BD3"]}
            />
          </Rect>
        </Canvas>
          <Text style={{color:'white',fontFamily:'Poppins-SemiBold'}}>Mathématiques</Text>
        </View>
        <View style={{paddingHorizontal:10,backgroundColor:'black',borderRadius:15,paddingVertical:12,overflow:'hidden'}}>
        <Canvas style={{position:'absolute',...StyleSheet.absoluteFillObject}}>
          <Rect x={0} y={0} width={220} height={120}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(90, 90)}
              colors={["#F33E62", "#F79334"]}
            />
          </Rect>
        </Canvas>
          <Text style={{color:'white',fontFamily:'Poppins-SemiBold'}}>Physique-Chimie</Text>
        </View>
      </View>

   

  </SafeAreaView>
  )
}
const styles = StyleSheet.create({
    content: {
      flex: 1,
      paddingTop: statusBarHeight,
      backgroundColor:'white'
    },
    welcomeText: {
      fontSize: 20,
      fontFamily:'Poppins-Regular'
    },
    header:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      paddingHorizontal:10
    },
    profile:{
      paddingHorizontal:10,
      paddingVertical:4,
      backgroundColor:'#758EF0',
      borderRadius:8,
    },
    welcomeTextContainer:{
      paddingHorizontal:10,
      paddingTop:10
    },
    statsContainer:{
      backgroundColor:'#495ECA',
      marginLeft:10,
      marginTop:5,
      maxWidth:'87%',
      borderRadius:15,
      elevation:10,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      overflow:'hidden'
    },
    circleTopLeft:{
      position:'absolute',
      width:250,
      height:250,
      borderRadius:150,
      backgroundColor:'#2F68D7',
      top:-140,
      left:-100,
      zIndex:-1
    },
    circleBottomRight:{
      position:'absolute',
      width:250,
      height:250,
      borderRadius:150,
      backgroundColor:'#C05AFF',
      opacity:0.5,
      bottom:-200,
      right:-80,
      zIndex:-1
    }
  })