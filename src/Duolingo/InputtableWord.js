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
  
  const originalWidth = useSharedValue(offset.width.value)
  const widthHasUpdated = useSharedValue(false)
  const nothingValue = useSharedValue(false)
  const { sign, number } = splitSignAndNumber(offset.operationSecond.value);
  const displaySign = sign === '' && offset.order.value !== 0 ? '+' : sign;
  const target = splitSignAndNumber(
    offset.operationFirst.value
  );
  const displaySign1 = target.sign === '+' ? '' : target.sign;
  const number1 = target.number;
  const oneIsFraction = isFraction(number1)||isFraction(number)

  // Bind the derived text to Animated.Text using useAnimatedProps
  const [fractionList,setFractionList]=useState([0])
  const [currentFraction, setCurrentFraction] = useState({ numerator: '', denominator: '' });
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [isNumerator, setIsNumerator] = useState(true);
  const toggleFractionPart = () => {
    if (isFractionMode) setIsNumerator(!isNumerator);
  };

  // Finalize the fraction in the current position
  const finalizeFraction = () => {
    if (isFractionMode) {
      setExpression([
        ...expression,
        { numerator: currentFraction.numerator, denominator: currentFraction.denominator },
      ]);
      setIsFractionMode(false);
      setCurrentFraction({ numerator: '', denominator: '' });
    }
  };
  const drop = useSharedValue(0)
  const maxFrac = useSharedValue(animatedText.value.map((item, i) => typeof item === 'object' ? i : -1).filter(i => i !== -1).pop())
  useAnimatedReaction(
    ()=>animatedText.value,
    (current,previous)=>{
      if (previous && previous!==current) {
        if (typeof current[current.length-1]==='object' && current.length===previous.length+1) {
          maxFrac.value=animatedText.value.map((item, i) => typeof item === 'object' ? i : -1).filter(i => i !== -1).pop()
          runOnJS(setIsFractionMode)(true);
        }
        if (current[current.length-1]==='FOut') {
          
          animatedText.value = animatedText.value.slice(0,-1)
          maxFrac.value=animatedText.value.map((item, i) => typeof item === 'object' ? i : -1).filter(i => i !== -1).pop()
          runOnJS(setIsFractionMode)(false);
          
          //console.log(isFractionMode,animatedText.value,animatedText.value.slice(maxFrac.value + 1).join(""));
        }
      }
    }
  )
  useAnimatedReaction(
    ()=>animatedText.value,
    (current,previous)=>{
      if (current!==previous && previous) {
        const hasNoObjects = current.every(item => typeof item !== 'object');
        if (hasNoObjects) {
          drop.value=0
        }
        if (current.length===previous.length-1) {

          if (typeof previous[previous.length-1]==='object') {
            maxFrac.value=current.map((item, i) => typeof item === 'object' ? i : -1).filter(i => i !== -1).pop()
            runOnJS(setFractionList)([...fractionList,1]);
          }
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
  const dynamicAnimatedInputStyle = useAnimatedStyle(()=>{
    return{
      width:animatedText.value.length===1 && typeof animatedText.value[0]==='object' 
      || animatedText.value.slice(maxFrac.value + 1).join("")===""?0:'auto',
      paddingHorizontal:animatedText.value.length===1 && typeof animatedText.value[0]==='object' 
       || animatedText.value.slice(maxFrac.value + 1).join("")===""?0:2
    }
  })
  
  const dynamicLabelStyle = useAnimatedStyle(()=>{
    const down1 = -53+drop.value
    const down2 = -22+drop.value
    const down = oneIsFraction?down1:down2
    return{
      bottom: down
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
  const animatedProps = useAnimatedProps(() => ({
    text:animatedText.value.slice(maxFrac.value + 1).join(""),
  }));

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
          if (height>offset.height.value && !animatedText.value.every(item => typeof item !== 'object')) {
            drop.value=-13
          }
        }}
        >
        { animatedText.value.map((item,index)=>{
          
          return(
            <View key={index}  style={[{flexDirection:'row',alignItems:'center'}]}>
            {typeof item === 'object' && (index!==animatedText.value.length-1 || !isFractionMode) ?(
              <Fraction numerator={item.numerator} denominator={item.denominator}/>
            ):typeof item !== 'object' && index<maxFrac.value && maxFrac.value>-1 ?(
              
              <Text key={index} style={{fontFamily:'Janda',fontSize:18}}>
               {maxFrac.value===undefined ? '':item}
              </Text>
            ):null}

            </View>
          )
        })}
        {isFractionMode? (
          <Fraction numerator={5} denominator={6}/>
        ):(
          <AnimatedTextInput  
          style={[{fontFamily:'Janda',fontSize:18,textAlign:'center'},dynamicAnimatedInputStyle]} 
          animatedProps={animatedProps}
          defaultValue={animatedText.value.slice(maxFrac.value + 1).join("")}
          />
        )}

        </Animated.View>
        <Animated.View
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
        style={[{ position: 'absolute', 
         left: 17,flexDirection:'row',justifyContent:'center',alignItems:'center',gap:2},dynamicLabelStyle]}>
          <Text style={styles.text}>{displaySign1}</Text>
          {isFraction(number1)?
        (<FractionDisplay expression={number1} size={13}/>) 
        : (<Text style={[styles.text]}>{number1}</Text>)}
          <Text style={styles.text}>{displaySign}</Text>
        {isFraction(number)?
        (<FractionDisplay expression={number} size={13}/>) 
        : (<Text style={[styles.text]}>{number}</Text>)}
        </Animated.View>
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
