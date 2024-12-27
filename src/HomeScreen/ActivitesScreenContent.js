import React, { useState, Suspense, lazy,useEffect } from 'react';
import { View, Text, TouchableWithoutFeedback, ActivityIndicator, StatusBar, Platform,Dimensions } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, runOnUI, runOnJS ,useAnimatedReaction, withTiming } from 'react-native-reanimated';
import { calculateLayout } from '../Duolingo/Layout';
import Keyboard from '../Duolingo/Keyboard';
import useStore from './Store';
const Duolingo = lazy(() => import('../Duolingo/Duolingo'));
const statusBarHeight = StatusBar.currentHeight || (Platform.OS === 'ios' ? 20 : 0);
const containerWidth = Dimensions.get('window').width;

const words = [
    { id: 1, word: 'A =' },
    { id: 2, word: '9' },
    { id: 3, word: '-4' },
    { id: 4, word: '+12' },
    { id: 5, word: '-3' },
    { id: 6, word: '7' },
  ];

export default function ActivitesScreenContent() {
    const containerHeight = useSharedValue(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDuolingoVisible, setIsDuolingoVisible] = useState(false);
    const setShouldHideTab = useStore((state) => state.setShouldHideTab);
    const shouldHideTab = useStore((state) => state.shouldHideTab);  
    const offsets = words.map((e,index) => ({
        order: useSharedValue(index),
        width: useSharedValue(0),
        height: useSharedValue(0),
        x: useSharedValue(0),
        y: useSharedValue(0),
        status:useSharedValue('resting'),
        word:useSharedValue(e.word),
        clicked:useSharedValue(false)
    }));
    const getOffsetsSnapshot = () => {
        return offsets.map(item => ({
          order: item.order.value,
          width: item.width.value,
          height: item.height.value,
          x: item.x.value,
          y: item.y.value,
          status: item.status.value,
          word: item.word.value,
          clicked: item.clicked.value,
        }));
    };
    const slideOut = useSharedValue(0);
    const [lineList,setLineList] =useState([{offsets,words}])
    const [staticLineList,setStaticLineList] =useState([])
    const setUpOfSlideOut = ()=>{
        setShouldHideTab(!shouldHideTab)
        //setIsDuolingoVisible(false)
    }
    const handleGoldenPress = () => {
       /* slideOut.value = withTiming(400, { duration: 500 }, () => {
            runOnJS(setUpOfSlideOut)();
        });*/
        setShouldHideTab(!shouldHideTab)
        
    };
    const handlePress = () => {
        slideOut.value=0
        setIsLoading(true);
        setIsDuolingoVisible(true);
        setLineList([{offsets,words}])
        setStaticLineList([])
    };

    const handleDuolingoRendered = () => {
        setIsLoading(false)
    };
    const addNewLine = ()=>{
        const offsetsSnapshot = getOffsetsSnapshot();
        runOnUI(()=>{
            offsets.forEach((offset ,index)=> {   
                offset.clicked.value = false;
            })
        })()        
        setStaticLineList(prev=>[...prev,offsetsSnapshot])
    }
    
    const deleteLastLine = () => {
        if (staticLineList.length>0) {
            const bigSource =staticLineList[staticLineList.length-1]
            runOnUI(()=>{
                offsets.forEach((offset ,index)=> {   
                    const source= staticLineList[staticLineList.length-1][index]
                    offset.order.value = source.order;
                    offset.width.value = withTiming(source.width,{},()=>{
                        calculateLayout(offsets,containerWidth,containerHeight)
                    });
                    offset.height.value = source.height;
                    offset.x.value = source.x;
                    offset.y.value = source.y
                    offset.status.value = source.status;
                    offset.word.value = source.word;
                    offset.clicked.value = false;
                });
            })()
        }
        setStaticLineList(prev => prev.slice(0, -1));
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: 'white',paddingTop:statusBarHeight }}>
            {!isDuolingoVisible && (
                <TouchableWithoutFeedback onPress={handlePress}>
                    <View style={{ padding: 10, borderRadius: 8, borderWidth: 1.5, borderColor: '#d9d8d8' }}>
                        <Text style={{ fontSize: 20 }}>Algebra</Text>
                    </View>
                </TouchableWithoutFeedback>
            )}

            {isDuolingoVisible && (
                <Suspense fallback={<ActivityIndicator size="large" color="#0000ff" />}>
                    <View >
                        {isLoading && (
                            <ActivityIndicator
                                size="large"
                                color="#0000ff"
                            />
                        )}
                        <Animated.View style={[{flex:1},duolingoStyle]}>
                            <Duolingo lineList={lineList} onRendering={handleDuolingoRendered} staticLineList={staticLineList} containerHeight={containerHeight}/>
                            {!isLoading && (
                                <View style={{flexDirection:'row',gap:15,marginTop:'auto',marginBottom:50}}>
                                <TouchableWithoutFeedback onPress={handleGoldenPress}>
                                    <View style={{height:35,width:35,backgroundColor:'gold',borderRadius:6}}></View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={addNewLine}>
                                    <View style={{height:35,width:35,backgroundColor:'green',borderRadius:6}}></View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={deleteLastLine}>
                                    <View style={{height:35,width:35,backgroundColor:'red',borderRadius:6}}></View>
                                </TouchableWithoutFeedback>
                            </View>
                            )}
                            {!isLoading && (<Keyboard/>)}
                        </Animated.View> 
                    </View>
                </Suspense>
            )}
        </View>
    );
}
