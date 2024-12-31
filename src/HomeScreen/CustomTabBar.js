import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions, SafeAreaView ,Platform} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { useSharedValue, withTiming, useAnimatedStyle, Easing, useDerivedValue } from 'react-native-reanimated';
import {
    Canvas,
    Circle,
    BlurMask,
} from "@shopify/react-native-skia";
import HomeSvg from './svg/HomeSvg';
import CoursSvg from './svg/CoursSvg';
import StarSvg from './svg/StarSvg';
import PlanningSvg from './svg/PlanningSvg';
import SoutienSvg from './svg/SoutienSvg';
import useStore from './Store';
const { width } = Dimensions.get('window');
const TAB_WIDTH = width / 5;
const TAB_HEIGHT = Dimensions.get('window').height/15
export default function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const animatedIndex = useSharedValue(state.index);
  const circleSize = useSharedValue(62);
  const shouldHideTab = useStore((state) => state.shouldHideTab);
  const yList = useSharedValue([])

  const translateX = useDerivedValue(() => {
    // Adjust tab position based on the index
    if (animatedIndex.value === 3) return animatedIndex.value * TAB_WIDTH + 9 - animatedIndex.value;
    if (animatedIndex.value === 2) return animatedIndex.value * TAB_WIDTH + 2 - animatedIndex.value;
    if (animatedIndex.value === 4) return animatedIndex.value * TAB_WIDTH + 9 - animatedIndex.value;
    return animatedIndex.value * TAB_WIDTH + 5 - animatedIndex.value;
  });

  const translateY = useDerivedValue(() => {
    // Base adjustment values
    let adjustment = 0;
  
    // Add -10 if the platform is iOS
    if (Platform.OS === 'ios') {
      adjustment = -10;
    }
  
    // Adjust Y-position based on the index
    if (animatedIndex.value === 1) return -TAB_HEIGHT / 10 + adjustment;
    if (animatedIndex.value === 3) return -TAB_HEIGHT / 10 + adjustment;
    if (animatedIndex.value === 2) return -TAB_HEIGHT / 5 + adjustment;
  
    return adjustment;
  });

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: withTiming(translateX.value) },
      { translateY: withTiming(translateY.value) },
    ],
    width: animatedIndex.value === 2 ? withTiming(circleSize.value + 10) : circleSize.value,
    height: animatedIndex.value === 2 ? withTiming(circleSize.value + 10) : circleSize.value,
    borderRadius: animatedIndex.value === 2 ? (circleSize.value + 10) / 2 : circleSize.value / 2,
    bottom: animatedIndex.value === 2 ? 4 : 7,
  }));

  React.useLayoutEffect(() => {
    animatedIndex.value = state.index;
  }, [state.index]);

  if (shouldHideTab) {
    return null
  } else {
    return (
      <SafeAreaView style={{ backgroundColor: '#143F5F' }}>
        <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
          <Canvas
            style={{
              position: 'absolute',
              left: -500,
              top: -width / 2 + 140,
              width: width + 1000,
              height: width + 1000,
            }}
          >
            <Circle
              cx={(width + 1000) / 2} // Center within the Canvas
              cy={(width + 1000) / 2} // Center within the Canvas
              r={(width + 1000) / 2}
              color={'#143F5F'}
            >
              <BlurMask blur={2} style="inner" />
            </Circle>
          </Canvas>
          {/* Main big circle */}
          {/* Moving circle */}
          <Animated.View style={[styles.movingCircle, animatedCircleStyle]} />
  
          {/* Tab buttons */}
          {state.routes.map((route, index) => {
            const { options } = descriptors[route.key];
            const label = options.tabBarLabel || route.name;
            const isFocused = state.index === index;
            
            let icon;
            if (label === 'Home') icon = <HomeSvg />;
            else if (label === 'Cours') icon = <CoursSvg />;
            else if (label === 'Activités') icon = <StarSvg />;
            else if (label === 'Plans') icon = <PlanningSvg />;
            else if (label === 'Soutien') icon = <SoutienSvg />;
  
            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });
  
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };
  
            return (
              <TouchableOpacity
                key={index}
                onPress={onPress}
                style={[styles.tab, { transform: [{ translateY: index === 1 || index === 3 ? -10 : index === 2 ? -20 : -5 }] }]}
              >
                {icon}
                <Text style={[styles.tabLabel, { color: isFocused ? 'black' : 'white' }]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    ); 
  }
}

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#143F5F',
    position: 'relative',
  },

  bigCircle: {
    position: 'absolute',
    zIndex: -4,
    width: width + 1000,
    height: width + 1000,
    backgroundColor: '#143F5F',
    borderRadius: (width + 1000) / 2,
    left: -500,
    top: -width / 2 + 142,
  },
  movingCircle: {
    position: 'absolute',
    backgroundColor: 'white',
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    width: TAB_WIDTH,
    gap: 5,
  },
  tabText: {
    fontSize: 24,
    lineHeight: 30,
    
  },
  tabLabel: {
    fontSize: 12,
    marginTop: -2,
    fontFamily:'Poppins-SemiBold'
  },
});
