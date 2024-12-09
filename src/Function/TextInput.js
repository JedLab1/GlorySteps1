import React, { useState, useEffect } from 'react';
import { View, TextInput, StyleSheet, Button } from 'react-native';
import Animated, { useSharedValue, withTiming, useAnimatedProps, useAnimatedStyle, withRepeat } from 'react-native-reanimated';

const AnimatedTextInput = Animated.createAnimatedComponent(TextInput);

export const TextInputContent = () => {
  const [inputText, setInputText] = useState("");
  const typingProgress = useSharedValue(1);
  const cursorOpacity = useSharedValue(1);
  const inputWidth = useSharedValue(20); // Initial width for the TextInput

  // Animated props to control the TextInput scale on each key press
  const animatedProps = useAnimatedProps(() => ({
    style: {
      transform: [{ scale: typingProgress.value }],
    },
  }));

  // Animated width style based on input length
  const inputStyle = useAnimatedStyle(() => ({
    width: withTiming(inputWidth.value, { duration: 200 }), // Smooth width change
    borderWidth:1.5,
    borderColor:'#d6cbcb',
    borderRadius:6,
    fontSize: 18,
    textAlign: 'center',
  }));

  // Blinking cursor animation
  const cursorStyle = useAnimatedStyle(() => ({
    opacity: cursorOpacity.value,
    position: 'absolute',
    left: 10 + inputText.length * 10, // Calculate cursor position
  }));

  // Handle key press to add a character
  const handleKeyPress = (key) => {
    setInputText((prevText) => prevText + key);
    typingProgress.value = withTiming(1.1, { duration: 75 }, () => {
      typingProgress.value = withTiming(1, { duration: 75 });
    });
    inputWidth.value = 20 + (inputText.length + 1) * 10; // Increase width as text grows
  };

  // Handle delete key press
  const handleDelete = () => {
    if (inputText.length > 0) {
      setInputText((prevText) => prevText.slice(0, -1));
      inputWidth.value = Math.max(20, inputWidth.value - 10); // Reduce width but keep above 100
    }
  };

  // Start blinking cursor animation
  useEffect(() => {
    cursorOpacity.value = withRepeat(withTiming(0, { duration: 500 }), -1, true);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.inputWrapper}>
        <AnimatedTextInput
          style={[styles.input, inputStyle]}
          value={inputText}
          onChangeText={setInputText}
          animatedProps={animatedProps}
          textAlign={'center'}
          editable={false} // Set to true if you want user typing enabled
        />
        <Animated.Text style={[styles.cursor, cursorStyle]}>|</Animated.Text>
      </View>

      {/* Keyboard Buttons */}
      <View style={styles.keyboard}>
        {["A", "B", "C", "D"].map((key) => (
          <Button key={key} title={key} onPress={() => handleKeyPress(key)} />
        ))}
        <Button title="Delete" onPress={handleDelete} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'center',
    
  },
  input: {

  },
  cursor: {
    fontSize: 18,
    color: '#333',
  },
  keyboard: {
    flexDirection: 'row',
    marginTop: 20,
    justifyContent: 'space-around',
    width: '80%',
  },
});

export default TextInputContent;
