import React, { useState } from "react";
import { View, Text, StyleSheet,TextInput} from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,  
  withTiming ,
  runOnJS,
  useAnimatedProps,
  useDerivedValue,
  useAnimatedReaction
} from "react-native-reanimated";

import { FractionDisplay, isFraction, Fraction } from "../Fraction/Fraction";
// Function to split the word into sign and number
const splitSignAndNumber = (word) => {
  const sign = word[0] === '+' || word[0] === '-' ? word[0] : ''; // Check if the first char is a sign
  const number = word.slice(sign ? 1 : 0); // Extract the rest of the word
  return { sign, number };
};
const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

const InputtabledWord = ({offset,offsets,containerWidth,containerHeight,calculateLayout,lastNeighborOffset,animatedText}) => {
  //console.log(offset.word.value,offset.operationSecond.value);
  
  const originalWidth = useSharedValue(offset.width.value)
  const widthHasUpdated = useSharedValue(false)
  const { sign, number } = splitSignAndNumber(offset.operationSecond.value);
  const displaySign = sign === '' && offset.order.value !== 0 ? '+' : sign;
  const target = splitSignAndNumber(
    offset.operationFirst.value
  );
  const displaySign1 = target.sign === '+' ? '' : target.sign;
  const number1 = target.number;
  const oneIsFraction = isFraction(number1)||isFraction(number)

  // Bind the derived text to Animated.Text using useAnimatedProps
  const animatedProps = useAnimatedProps(() => ({
    text: animatedText.value.join(""),
  }));
  const [fractionList,setFractionList]=useState([0])
  const [currentFraction, setCurrentFraction] = useState({ numerator: '', denominator: '' });
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [isNumerator, setIsNumerator] = useState(true);


  useAnimatedReaction(
    ()=>animatedText.value,
    (current,previous)=>{
      if (previous && previous!==current) {
        if (current[current.length-1]==='/') {
          runOnJS(setFractionList)([...fractionList,current.length-1]);
        }
        
      }
    }
  )
  useAnimatedReaction(
    ()=>animatedText.value,
    (current,previous)=>{
      if (current!==previous && previous) {
        if (current.length===previous.length-1) {
          if(offset.width.value!==originalWidth.value){
            offset.width.value =withTiming(offset.width.value-10,{duration:0},()=>{
              const jump =oneIsFraction? offset.height.value/2+10:5
              calculateLayout(offsets,containerWidth,containerHeight,false,jump,offset.order.value)
            })
          }
        }
      }
    }
  )
  const dynamicStyle = useAnimatedStyle(()=>{
    return{
      borderWidth:animatedText.value.length===0?2:0
    }
  })
  const dynamicInputStyle = useAnimatedStyle(()=>{
    return{
      borderWidth:withTiming(animatedText.value.length===0?0:2),
      borderColor: '#1B6FF5',
      borderRadius: 8,
      paddingVertical:3,
      paddingHorizontal:10
    }
  })
  return (
      <>
      <Animated.View
        style={[{
          flex: 1,
          borderWidth: 2, 
          borderColor: '#1B6FF5',
          borderRadius: 8,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:'white'
        },dynamicStyle]}
      >
        <Animated.View 
        style={[dynamicInputStyle,{flexDirection:'row'}]}
        onLayout={(e)=>{
          const {height,width}= e.nativeEvent.layout
          if (width>offset.width.value-5) {
            widthHasUpdated.value=true
            offset.width.value =withTiming(offset.width.value+5,{duration:0},()=>{
              const jump =oneIsFraction? height/2+10:5
              calculateLayout(offsets,containerWidth,containerHeight,false,jump,offset.order.value)
            })
          }
        }}
        >
        {fractionList.map((item,index)=>{
          return(
            <View key={index} >
            {index===fractionList.length-1?(
              <AnimatedTextInput  
              style={[{fontFamily:'Janda',fontSize:18,textAlign:'center',paddingHorizontal:2}]} 
              animatedProps={animatedProps}
              defaultValue={animatedText.value.join("")}
              />
            ):(
              <Text  style={{fontFamily:'Janda',fontSize:18}}>{animatedText.value.join("")}</Text>
            )}
            </View>
          )
        })}
        </Animated.View>
        <View
        onLayout={(e)=>{
          const {width,height}=e.nativeEvent.layout
          offset.height.value = 40
          offset.width.value= withTiming(40+width,{duration:10},()=>{
            originalWidth.value = offset.width.value
            containerHeight.value = containerHeight.value+150
            const jump =oneIsFraction? height/2:5
            calculateLayout(offsets,containerWidth,containerHeight,false,jump,offset.order.value)
          })
        }}
        style={{ position: 'absolute', bottom: oneIsFraction?-53:-22, left: 17,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:2}}>
          <Text style={styles.text}>{displaySign1}</Text>
          {isFraction(number1)?
        (<FractionDisplay expression={number1} size={13}/>) 
        : (<Text style={[styles.text]}>{number1}</Text>)}
          <Text style={styles.text}>{displaySign}</Text>
        {isFraction(number)?
        (<FractionDisplay expression={number} size={13}/>) 
        : (<Text style={[styles.text]}>{number}</Text>)}
        </View>
      </Animated.View>
      </>
    );
  }

const styles = StyleSheet.create({
  text:{
    fontFamily:'Janda',
    fontSize:13
  }
})

export default InputtabledWord;
