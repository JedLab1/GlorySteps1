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

const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'ios' ? 20 : 0);

export default function HomeScreenContent() {

  return (
    <SafeAreaView style={styles.content}>
      <View style={styles.header}>
        <View style={styles.profile}>
          <Text style={{fontWeight:'700',color:'white',fontSize:18,lineHeight:24}}>A</Text>
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
              <Text style={{fontSize:36,fontWeight:'bold',color:'white'}}>0%</Text>
              <Text style={{color:'white',transform:[{translateY:7}]}}>total révisions</Text>
            </View>
            <View>
              <Text style={{color:'white'}}>Obtiens 100% de ton total révision pour être au top dans tes evals</Text>
            </View>
          </View>
          <View style={{flex:4,paddingVertical:10,alignItems:'center',justifyContent:'center'}}>
            <View style={{backgroundColor:'white',alignItems:'center',justifyContent:'center',borderRadius:7,padding:5}}>
              <Text style={{color:"#495ECA"}}>Commencer</Text>
            </View>
          </View>
        </View>
        <View style={styles.circleTopLeft}></View>
        <View style={styles.circleBottomRight}></View>
      </View>
      <View style={{paddingHorizontal:10,paddingTop:20}}>
        <Text style={{fontSize:18,fontWeight:'600'}}>Matières :</Text>
      </View>
      <View style={{flexDirection:'row',alignItems:'center', paddingHorizontal:10,paddingTop:20,gap:20}}>
        <View style={{paddingHorizontal:10,backgroundColor:'black',borderRadius:15,paddingVertical:15,overflow:'hidden'}}>
        <Canvas style={{position:'absolute',...StyleSheet.absoluteFillObject}}>
          <Rect x={0} y={0} width={120} height={120}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(120, 120)}
              colors={["#548AD8", "#8A4BD3"]}
            />
          </Rect>
        </Canvas>
          <Text style={{color:'white'}}>Mathématiques</Text>
        </View>
        <View style={{paddingHorizontal:10,backgroundColor:'black',borderRadius:15,paddingVertical:15,overflow:'hidden'}}>
        <Canvas style={{position:'absolute',...StyleSheet.absoluteFillObject}}>
          <Rect x={0} y={0} width={140} height={120}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(90, 90)}
              colors={["#F33E62", "#F79334"]}
            />
          </Rect>
        </Canvas>
          <Text style={{color:'white'}}>Physique-Chimie</Text>
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
      fontSize: 24,
      fontWeight: '400',
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
      paddingTop:20
    },
    statsContainer:{
      backgroundColor:'#495ECA',
      marginLeft:10,
      marginTop:30,
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