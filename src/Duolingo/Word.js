import React, { useState,useRef,useEffect } from "react";
import { View, Text, StyleSheet,Dimensions, Pressable } from "react-native";
import { calculateLayout,remove,reintroduce } from "./Layout";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle,  
  withTiming ,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue
} from "react-native-reanimated";
import { statusReaction, orderReaction } from './useAnimatedReactions';
import OutsidePressHandler from 'react-native-outside-press';
import InputtabledWord from "./InputtableWord";
import { FractionDisplay, isFraction } from "../Fraction/Fraction";
import InputtedWord from "./InputtedWord";

const keyHeight = Dimensions.get('window').height/2-40;

const styles = StyleSheet.create({
  container: {
    
    borderRadius: 8,
    borderColor: "#E8E6E8",
  },
  text: {
    fontSize: 18,
    fontFamily: 'Janda',
  },
  shadow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 8,
    borderColor: "#E8E6E8",
    top: 4,
  },

});

// Function to split the word into sign and number
const splitSignAndNumber = (word) => {
  const sign = word[0] === '+' || word[0] === '-' ? word[0] : ''; // Check if the first char is a sign
  const number = word.slice(sign ? 1 : 0); // Extract the rest of the word
  return { sign, number };
};

const Word = ({ word, offset, isActive, offsets, containerHeight, containerWidth,keyboardHeight,animatedText,staticLineList}) => {
  const { sign, number } = splitSignAndNumber(offset.word.value); // Split the word into sign and number
  const isLaidOut = useSharedValue(false); // Shared value to track if layout is done 
  const displaySign = sign === '' && offset.order.value !== 0 ? '+' : sign;
  const originalWidth = useSharedValue(0)
  const lastNeighborOffset = useSharedValue(null) 
  const prevWidth = useSharedValue(0)
  const prevHeight = useSharedValue(0)
  const originalOrder = useSharedValue(0)
  const originalWord = useSharedValue('')
  const nothingValue = useSharedValue(0)
  const opOn= useSharedValue(false)
  const [opExecute,setOpExecute] = useState(false)
  const [opFinished,setOpFinished] = useState(false)
  const operationAdvance = useSharedValue(0)
  const neighborOffsetIndex = useSharedValue(-1);
  const interactiveSign = useSharedValue(displaySign)
  
  // Electrical cables watch out for any trouble !!! its being fixed by force hahahaha
  statusReaction(offset, originalWidth, displaySign, originalOrder, offsets, containerWidth, containerHeight, calculateLayout,interactiveSign);
  orderReaction(offset, originalWidth, displaySign, originalOrder, offsets, containerWidth, containerHeight, calculateLayout,interactiveSign);

  // Electrical cables watch out for any trouble !!! its being fixed by force hhhh
  
  const animatedStyle = useAnimatedStyle(() => {
    const isDragging = offset.status.value === 'dragging' && offset.order.value!==0;
    const shouldHide = offset.order.value===1 && displaySign==='+'&& offset.status.value!=='dragging'

    return {
      flexDirection: 'row',
      alignItems: 'center',
      paddingLeft: offset.order.value === 0 || shouldHide ? 0 : 7,
      transform: [{ scale: withTiming(isDragging ? 1.1 : 1) }],
      borderColor: 'orange',
      borderRadius: 8,
      borderWidth: withTiming(isDragging ? 1 : 0),
      backgroundColor: isDragging ? 'white' : 'transparent',
      // Add shadow properties for iOS
      shadowColor: 'black',
      shadowOpacity:isDragging ? 0.5 : 0, // Adjust as needed
      shadowRadius: isDragging ? 10 : 0, // Adjust as needed
      elevation:isDragging ? 3 : 0,
    };
    
  });
  // Animated style for the sign part
  const signStyle = useAnimatedStyle(() => {
    const shouldHide = offset.order.value===1 && displaySign==='+'&& offset.status.value!=='dragging'
    const target = offsets.find(o=>o.order.value===offset.order.value-1)
    return {
      backgroundColor: withTiming(opOn.value?'#cae1ff':'transparent'),
      borderRadius: 50,
      paddingHorizontal: shouldHide || offset.order.value===1 && offset.status.value!=='dragging'? 0: 7,
      paddingVertical:3,
      opacity:shouldHide?0:1,
      width:shouldHide?0:undefined,
      borderWidth:isActive && offset.order.value>1&& offset.status.value!=='dragging' 
      && !target.inputted.value ?1.5:0,
      borderStyle:'dashed',
      borderRadius:100,
      borderColor:'#d7d6d7'
    };
  });
  const animatedContainerStyle = useAnimatedStyle(() => {
    const shouldHide = offset.order.value===1 && displaySign==='+'&& offset.status.value!=='dragging'
    return {
      // When dragging, animate borderWidth with withTiming; otherwise, apply a static value
      paddingRight: offset.order.value===0? 0:8,
      paddingLeft:8,
      paddingVertical:8,
      borderWidth: offset.status.value === 'dragging' 
        ? withTiming(0) 
        : withTiming(!isActive || offset.order.value === 0 ? 0 : 1),
      marginLeft:offset.order.value===0 || shouldHide?0:7  ,
      backgroundColor:withTiming(opOn.value || offset.clicked.value?'#cae1ff':'white' )
    };
  });
  
  const animatedShadowStyle = useAnimatedStyle(() => {
    const shouldHide = offset.order.value===1 && displaySign==='+'&& offset.status.value!=='dragging'
    return {
      // When dragging, animate borderBottomWidth with withTiming; otherwise, apply a static value
      borderBottomWidth: offset.status.value === 'dragging' 
        ? withTiming(0) 
        : withTiming(!isActive || offset.order.value === 0 ? 0 : 3),
      marginLeft:offset.order.value===0 || shouldHide?0:7   
    };
  });
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      color: withTiming(offset.clicked.value ? '#6eaaff' : 'black'),  // Change to red if clicked is true, otherwise black
    };
  });

  // Handle layout and set the shared value using runOnUI
  const handleLayout = ({
    nativeEvent: {
      layout: { width, height },
    },
  }) => {
    if (offset && !isLaidOut.value) {
      offset.height.value = height; // Set the height based on the layout
      offset.width.value = offset.order.value===0?width+1:width+3;   // Set the width based on the layout
      originalWidth.value = width+3
      originalOrder.value = offset.order.value
      originalWord.value = offset.word.value
      isLaidOut.value = true;  // Prevent future re-execution of layout logic
    }
  };   

  const handlePress = ()=>{
    'worklet';
    if (opOn.value) {

      handleRemoveNeighbor()
      runOnJS(setOpExecute)(!opExecute)
    }
    const neighbor = offsets.find(o=>o.order.value===offset.order.value-1)
    lastNeighborOffset.value = offsets.find(o=>o.order.value===offset.order.value-1)

    offset.operationWidth.value = offset.width.value
    offset.operationHeight.value = offset.height.value
    if (offset.order.value>1 && !neighbor.clicked.value && !neighbor.inputted.value && isActive) {      
      offset.operationFirst.value = offsets.find(o=>o.order.value===offset.order.value-1).word.value
      offset.operationSecond.value = offset.word.value
      opOn.value = true
      offset.clicked.value=true
      offsets.find(o=>o.order.value===offset.order.value-1).clicked.value=true
    }

  }
  const handlePressOutside = (b) => {
    'worklet';
    if (opOn.value) {
      opOn.value = false;
      offset.clicked.value = false;
      const targetOffset = offsets.find(o => o.order.value === offset.order.value - 1);
      if (targetOffset) {
        targetOffset.clicked.value = false;
      }
    }
    
  };
  const handleRemoveNeighbor = ()=>{
    'worklet';
    opOn.value = false;
    keyboardHeight.value = withTiming(keyHeight)
    const targetOffset = offsets.find(o => o.order.value === offset.order.value - 1);
    neighborOffsetIndex.value = offsets.findIndex(o => o.order.value === offset.order.value - 1)
    offset.operationNeighborIndex.value = offsets.findIndex(o => o.order.value === offset.order.value - 1)
    prevWidth.value=offset.width.value
    prevHeight.value = offset.height.value
    if (targetOffset) {
      targetOffset.clicked.value = false;
      const index = offsets.findIndex(o => o.order.value === offset.order.value - 1); 
      targetOffset.order.value = -1;  // Update order to -1
      remove(offsets, index); 
      offset.clicked.value = false
      //calculateLayout(offsets, containerWidth, containerHeight);
    }
  } 
  const prevStaticLineListRef = useRef(staticLineList); // Store the previous value

  useEffect(() => {
    // Compare current and previous list lengths
    if (opFinished) {
      if (staticLineList.length < (prevStaticLineListRef.current?.length || 0 )) {
        //offset.operationWidth.value = offset.order.value!==1 ? offset.width.value-27: displaySign==='+'?offset.width.value+5:offset.width.value-10
        //offset.operationHeight.value = offset.height.value
        
      }
      prevStaticLineListRef.current = staticLineList;
    }


    
  }, [staticLineList]);
  //i swear to god i dont know how it worked here but it just did
 useAnimatedReaction(
  ()=>offset.order.value,
  (current,previous)=>{
    if (current===previous+1 && current === Math.max(...offsets.map(o => o.order.value))) {
      
      nothingValue.value=withTiming(20000,{duration:800},(finished)=>{
          nothingValue.value=0
          opOn.value = false
          offset.clicked.value=false
          offsets.find(o=>o.order.value===offset.order.value-1).clicked.value=false
      })
      
      
    }
  }

 ) 
 useAnimatedReaction(
  ()=>operationAdvance.value,
  (current,previous)=>{
    if (current>previous && current===100) {
      
      runOnJS(setOpFinished)(false)
      offset.width.value=withTiming(offset.order.value!==1 ? offset.width.value+27: displaySign==='+'?offset.width.value-5:offset.width.value+10,{},()=>{
        originalWidth.value=offset.width.value
        originalOrder.value=offset.order.value
        if (displaySign==='-' && offset.word.value[0]!=='-') {
          interactiveSign.value = '-' 
        }
        if (offset.word.value[0]===displaySign && displaySign==='-') {
          interactiveSign.value = '-' 
        }
        if (displaySign==='+' && offset.word.value[0]===displaySign) {
          interactiveSign.value = '+'
        }
        if (displaySign==='+' && offset.word.value[0]==='-') {
          interactiveSign.value = '-' 
        }

        nothingValue.value = withTiming(2000,{duration:500},()=>{
          operationAdvance.value=withTiming(1000,{duration:800})
          calculateLayout(offsets,containerWidth,containerHeight)
          operationAdvance.value=0
          
        })
      })
      
    }
  }
 )
 useAnimatedReaction(
    ()=>offset.inputted.value,
    (current,previous)=>{
      if (current!==previous){
        if (previous && !current && keyboardHeight.value===0) {
          //
          operationAdvance.value=withTiming(100)

          //runOnJS(setOpFinished)(false)
        }
        if (current && !previous && !opExecute && !opFinished) {
          runOnJS(setOpFinished)(true)
          offset.width.value=withTiming(offset.order.value!==1 ? offset.width.value-27: displaySign==='+'?offset.width.value+5:offset.width.value-10,{},()=>{
            //originalOrder.value=offset.order.value
            originalWidth.value=offset.operationWidth.value
            originalOrder.value=offset.operationOrder.value
            nothingValue.value = withTiming(1000,{duration:500},()=>{
              
              calculateLayout(offsets,containerWidth,containerHeight)
              
            })
          })
          
        }
      }
    }
  )
  useAnimatedReaction(
    ()=>keyboardHeight.value,
    (current,previous)=>{
      if (current!==previous) {
        if (current===0 && current<previous && opExecute) {
          if (animatedText.value.length===0 && !opFinished) {
            offset.word.value=offset.operationSecond.value
            originalWord.value=offset.operationSecond.value
            originalWidth.value = offset.width.value
            originalOrder.value = offset.order.value
            nothingValue.value=withTiming(2000,{duration:500},()=>{
              originalWidth.value=offset.operationWidth.value
              originalOrder.value = offset.operationOrder.value
              offset.height.value = offset.operationHeight.value
              offset.width.value = offset.operationWidth.value
              
              reintroduce(offsets,offset.operationNeighborIndex.value,offset.order.value)
              calculateLayout(offsets,containerWidth,containerHeight) 
              runOnJS(setOpExecute)(false)
            })

          }else{ 
            
            if (!opFinished) {
              offset.inputted.value=true
              offset.word.value = animatedText.value.join('')
              
              
              animatedText.value = []
              runOnJS(setOpFinished)(true)  
            }
          }
          runOnJS(setOpExecute)(false) 
        }
        if (previous===0 && current>previous && opFinished && offset.reInputted.value) {
          offset.reInputted.value=false
          animatedText.value = offset.word.value.split("")
          offset.word.value = originalWord.value
          offset.inputted.value = false
          runOnJS(setOpExecute)(true) 
          runOnJS(setOpFinished)(false)
          
        }
      }
    }
  )
  if (opExecute) {

    return (
      <InputtabledWord  
      offset={offset} offsets={offsets} containerHeight={containerHeight} containerWidth={containerWidth} calculateLayout={calculateLayout}
      lastNeighborOffset={lastNeighborOffset}
      animatedText={animatedText}
      />
    );
  }
  if (opFinished) {
    return(
      <InputtedWord offset={offset} keyboardHeight={keyboardHeight} offsets={offsets}
      containerHeight={containerHeight} containerWidth={containerWidth} calculateLayout={calculateLayout} />
    )
  }

  else{
    return (
      <View>
      <Animated.View style={[animatedStyle,{shadowOffset: { width: 0, height: 2 }}]} onLayout={handleLayout}>
        {/* Conditionally render the Sign based on isHidden */}
        {offset.order.value !== 0 && (
          <OutsidePressHandler
              onOutsidePress={handlePressOutside}
            >
          <Pressable onPress={handlePress}>
          <Animated.View style={[signStyle]}  >
            <Animated.Text style={[styles.text,animatedTextStyle,{lineHeight:18,transform:[{translateY:4}]}]}>{displaySign}</Animated.Text>
          </Animated.View>
          </Pressable>
          </OutsidePressHandler>
        )}
  
        {/* Number and container */}
        <View>
        <>
      <Animated.View 
        style={[styles.container, animatedContainerStyle]}
      >
        {isFraction(number)?
        (<FractionDisplay expression={number} offset={offset}/>) 
        : (<Animated.Text style={[styles.text,animatedTextStyle]}>{number}</Animated.Text>)}
        
      </Animated.View>
  
      <Animated.View 
        style={[styles.shadow, animatedShadowStyle]}
      />
    </>
  
        </View>
      </Animated.View>
    </View>
    );
  }
};

export default Word;
