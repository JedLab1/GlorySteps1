import { View, Text, StyleSheet,Dimensions, TouchableOpacity } from 'react-native'
import React from 'react'
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'
import Svg, { Line,G,Rect,Mask,Path,Defs,ClipPath } from 'react-native-svg';

const containerHeight = Dimensions.get('window').height/2-50;
const CloseSvg = ()=>(
  <Svg height="18" width="18" viewBox="0 0 24 24">
  <Line 
    x1="5" 
    y1="5" 
    x2="19" 
    y2="19" 
    stroke="#C1C0C0" 
    strokeWidth="2" 
    strokeLinecap="round" 
  />
  <Line 
    x1="19" 
    y1="5" 
    x2="5" 
    y2="19" 
    stroke="#C1C0C0" 
    strokeWidth="2" 
    strokeLinecap="round" 
  />
</Svg>
)
const DeleteSvg = ()=>(
  <Svg
  width={30}
  height={25}
  viewBox="0 0 26 16"
  fill="none"
>
  <Path
    d="M8.933 1.296A1.1 1.1 0 019.683 1H21.9A1.1 1.1 0 0123 2.1v13.2a1.1 1.1 0 01-1.1 1.1H9.684a1.1 1.1 0 01-.751-.296L1 8.7l7.933-7.404zM18.6 5.95l-5.5 5.5M13.1 5.95l5.5 5.5"
    stroke="#000"
    strokeWidth={1.3}
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</Svg>

)
export default function Keyboard({keyboardHeight,animatedText}) {
  const keyboardStyle = useAnimatedStyle(()=>{
    
    return{
      transform:[{translateY:containerHeight-keyboardHeight.value}],//containerHeight-keyboardHeight.value,
      opacity:keyboardHeight.value===0?0:1
    }
  })
  const characters = [
    "1", "2", "3", "<", "(", ")",
    "4", "5", "6", "+", "{", "}",
    "7", "8", "9", "-", "[", "]",
    "0", "x", "y", "=", "^", "/",
    "A", "B", "C", "E", "D", "F",
  ]
  const handleAddInput = (input) => {
    'worklet'
    animatedText.value=[...animatedText.value,input]
  };
  const handleDelete = () => {
    'worklet'
    animatedText.value = animatedText.value.slice(0,-1)
  };
  
  
  return (
    <View style={{justifyContent:'center',alignItems:'center',zIndex:201}}>
    <Animated.View style={[styles.container,keyboardStyle]}>
      <TouchableOpacity style={styles.closeIcon} onPress={()=>{
        keyboardHeight.value = withTiming(0)
      }}>
        <CloseSvg/>
      </TouchableOpacity>
      <View style={styles.keyboardGrid}>
          {characters.map((char, index) => (
            <TouchableOpacity
              key={index}
              style={styles.key}
              onPress={()=>{
                if (char==='<') {
                  handleDelete()
                }else{
                  handleAddInput(char)
                }
              }}
            > 
             {char==='<' ?(
              <DeleteSvg/>
             ):(
              <Text style={styles.keyText}>{char}</Text>
             )}
            </TouchableOpacity>
          ))}
      </View>
    </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
    container:{
        position:'absolute',
        width:'100%',
        height:containerHeight,
        bottom:-20,
        backgroundColor:'#fff',
        borderRadius:20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25, 
        shadowRadius: 4,
        elevation: 4,
        justifyContent:'center'
    },
    closeIcon:{
      position:'absolute',
      left:'50%',
      padding:2,
      backgroundColor:'#fff',
      borderWidth:1.5,
      borderRadius:100,
      borderColor:'#E7E4E4',
      top:-30,
      transform:[{translateX:-13}],
    },
    keyboardGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      alignItems: "center",
    },
    key: {
      height:43,
      width:49,
      margin: 5,
      backgroundColor: "#fff",
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.1,
      shadowRadius: 2,
      elevation: 2,
      borderWidth:1,
      borderColor:'#E7E4E4'
    },
    keyText: {
      fontSize: 18,
      fontFamily: 'Janda',
    },
})