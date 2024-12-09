import { View, Text, StyleSheet,Dimensions } from 'react-native';
import React, { useEffect } from 'react';
import Animated, { 
    SlideInRight,
  SlideOutRight,
  useAnimatedReaction,
  useAnimatedStyle, 
  useSharedValue, 
  withTiming ,
  runOnJS,
} from 'react-native-reanimated';
import { FractionDisplay, isFraction } from "../Fraction/Fraction";
const styles = StyleSheet.create({
  container: {
    borderColor: '#edeaea',
    flexDirection: 'row',
    flexWrap: 'wrap',
    backgroundColor:'white',
    overflow: 'hidden', // Prevent content from overflowing during scale animation
  },
});
const containerWidth = Dimensions.get('window').width;


const splitSignAndNumber = (word) => {
  const sign = word[0] === '+' || word[0] === '-' ? word[0] : ''; 
  const number = word.slice(sign ? 1 : 0); 
  return { sign, number };
};  
const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TRANSLATE_X_THRESHOLD = -SCREEN_WIDTH * 0.3;

export default function StaticLine({ offsets, containerHeight, staticLineUnmount,onUnmount,index,staticLineList,shouldLastDismiss,onDismiss}) {
  const translateX = useSharedValue(SCREEN_WIDTH);
  const itemHeight = useSharedValue(0);
  const marginVertical = useSharedValue(0);
  const borderWidth = useSharedValue(0)
  const opacity = useSharedValue(1);
  useAnimatedReaction(
    ()=>shouldLastDismiss?.value,
    (current,previous)=>{
        if (previous===null) {
          translateX.value=withTiming(0)
          itemHeight.value=withTiming(containerHeight)
          marginVertical.value=withTiming(10)
          borderWidth.value=withTiming(2)
        }
        if (current!==previous && previous!==null && index===staticLineList.length-1) {
            translateX.value = withTiming(-SCREEN_WIDTH);
            itemHeight.value = withTiming(0);
            marginVertical.value = withTiming(0);
            borderWidth.value=withTiming(0)
            opacity.value = withTiming(0, undefined, (isFinished) => {
                if (isFinished && onDismiss) {
                runOnJS(onDismiss)(index);
                }
            });
        }
    
    }
    
  )
  const rStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: translateX.value,
      },
    ],
  }));
  const rTaskContainerStyle = useAnimatedStyle(() => {
    return {
      height: itemHeight.value,
      marginBottom: marginVertical.value,
      opacity: opacity.value,
      borderTopWidth:borderWidth.value,
      borderBottomWidth:borderWidth.value
    };
  });
  return (
    <Animated.View style={[styles.container,rTaskContainerStyle,rStyle]} >
      {offsets.map((offset, innerIndex) => {
        const { sign, number } = splitSignAndNumber(offset.word);
        const displaySign = sign === '' && offset.order !== 0  ? '+' : sign;
        const shouldHide = offset.order === 1 && displaySign === '+';
        const displayNumber1 = offset.order===1 && offset.inputted? offset.word : offset.inputted?displaySign==='+'?offset.word:offset.word.slice(1):
        offset.word[0]==='+' && offset.inputted?offset.word.slice(1):number
        const specialTransition = offsets.find(o=>o.order===offset.order-1)?.inputted && offset.inputted &&  offset.order!==2
        const displayNumber = offset.word[0]==='+' && offset.inputted? displayNumber1.slice(1):displayNumber1
        return (
          <View
            key={innerIndex}
            style={{
              flexDirection: 'row',
              alignItems: 'center',    
              paddingLeft: offset.order === 0 || shouldHide ? 0 : 7,
              position: 'absolute',
              backgroundColor:offset.inputted ?'transparent':'transparent',
              width:offset.inputted ? offset.width+20:undefined,
              gap:offset.inputted ? 15:0,
              transform: [{ translateX:
                specialTransition?offset.x-5:
                offset.order===0 ? offset.x :
                offset.order===1 &&  offset.inputted && displaySign==='+' ? offset.x+5: 
                offset.order===1 &&  offset.inputted && displaySign!=='+' ? offset.x-10: 
                offset.inputted && offset.order!==1?offset.x-20
                :offsets.find(o=>o.order===offset.order-1)?.inputted && offset.inputted ? offset.x+20 :offset.x+5 }, { translateY: offset.y }],
            }}
          >
            {offset.order !== 0 && !offset.inputted && (
              <View
                style={{
                  paddingHorizontal: shouldHide || (displaySign !== '+' && offset.order === 1) ? 0 : 5,
                  opacity: shouldHide ? 0 : 1,
                  width: shouldHide ? 0 : undefined,
                  
                }}
              >
                <Text style={{ fontFamily: 'Janda', fontSize: 18 }}>{displaySign}</Text>
              </View>
            )}
            { offset.order !== 0 && offset.order !== 1 && offset.inputted && (
              <View
              style={{
                opacity: shouldHide ? 0 : 1,
                width: shouldHide ? 0 : undefined,
                transform:[{translateX:13}]
              }}
            >
              <Text style={{ fontFamily: 'Janda', fontSize: 18 }}>{displaySign}</Text>
            </View>
            )}
            <View style={{
              marginLeft: offset.order === 0 || shouldHide ? 0 : 7,
              paddingVertical: 6,
              paddingHorizontal:8,
              borderWidth:offset.inputted?1.5:0,
              borderStyle:'dashed',
              borderRadius:10,
               }}>
              {isFraction(number)?
              (<FractionDisplay expression={displayNumber}/>) 
              : (<Text style={{ fontFamily: 'Janda', fontSize: 18 }}>{displayNumber}</Text>)}
            </View>
          </View>
        );
      })}
    </Animated.View>
  );
}
