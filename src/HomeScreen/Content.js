import { View, ActivityIndicator, Dimensions, TouchableWithoutFeedback, Text,StatusBar } from 'react-native';
import React, { useState, useEffect, Suspense, lazy,useRef, useCallback } from 'react';
import Animated ,{ useSharedValue, runOnUI, withTiming, useAnimatedRef, useDerivedValue,scrollTo} from 'react-native-reanimated';
import { calculateLayout } from '../Duolingo/Layout';
import Keyboard from '../Duolingo/Keyboard';
import useStore from './Store';
import axios from 'axios';
const Duolingo = lazy(() => import('../Duolingo/Duolingo'));
const MemoizedDuolingo = React.memo(Duolingo);

const containerWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;


export default function Content({keyboardHeight,words,animatedText}) {
  const {showDuolingo,setShowDuolingo}=useStore()
  const containerHeight = useSharedValue(0);


  

  const staticLineUnmount =useSharedValue(false)
  useEffect(() => {
    StatusBar.setBarStyle('light-content');
    const delay = 100; // Delay in milliseconds
    const timer = setTimeout(() => {
      setShowDuolingo(true); // Show Duolingo after the delay
    }, delay);

    return () => {
      clearTimeout(timer)
      StatusBar.setBarStyle('dark-content');
    }; // Cleanup timer on unmount
  }, []);

  const scrollViewRef= useRef()
  const [duolingoRendered, setDuolingRendered] = useState(false);
  const handleRendering = useCallback(() => {
    setDuolingRendered(true); // Toggle using the previous state
  }, []);
  const scroll = useSharedValue(0);
  const animatedRef = useAnimatedRef();
  useDerivedValue(() => {
    scrollTo(
      animatedRef,
      0,
      scroll.value,
      false,
    );
  });
  return (
    
    <Animated.ScrollView style={{ flex: 1}} ref={animatedRef} >
      <View style={{ flex: 1,minHeight:screenHeight-100}}>
      {showDuolingo ? (
        <>
        <Suspense fallback={<ActivityIndicator size="large" color="transparent" />}>
          <Animated.View style={{opacity:duolingoRendered? 1:0}}>
            <MemoizedDuolingo 
              words={words}
              containerHeight={containerHeight}
              keyboardHeight={keyboardHeight} 
              scrollViewRef={animatedRef}
              scroll={scroll}
              staticLineUnmount={staticLineUnmount}
              onRendering={handleRendering}
              animatedText={animatedText}
            />
          </Animated.View>
        </Suspense>
        <Animated.View 
        style={{position:'absolute',top:'50%',left:'50%',transform:[{translateX:-15},{translateY:-25},{scale:duolingoRendered? 0 :1}]}}>
        <ActivityIndicator size="large" color="#0000ff" 
        />
        </Animated.View>
        </>
      ) : (
        <View style={{flex:1}}>
        <ActivityIndicator size="large" color="#0000ff" 
         style={{position:'absolute',top:'50%',left:'50%',transform:[{translateX:-15},{translateY:-25}]}} 
        />
        </View>
      )}

    </View>
    </Animated.ScrollView>

  );
}
