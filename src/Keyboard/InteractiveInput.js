import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { FractionDisplay } from '../Fraction/Fraction';

export default function InteractiveInput() {
  const [expression, setExpression] = useState([]); // Array to hold the expression parts
  const [currentFraction, setCurrentFraction] = useState({ numerator: '', denominator: '' });
  const [isFractionMode, setIsFractionMode] = useState(false);
  const [isNumerator, setIsNumerator] = useState(true);

  const numberButtons = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+', '-', '*', '(', ')'];

  // Add input to the expression
  const handleAddInput = (input) => {
    if (isFractionMode) {
      // Append to current fraction's numerator or denominator
      if (isNumerator) {
        setCurrentFraction({  
          ...currentFraction,
          numerator: currentFraction.numerator + input,
        });
      } else { 
        setCurrentFraction({
          ...currentFraction,
          denominator: currentFraction.denominator + input,
        });
      }
    } else {
      // Add input to expression array if not in fraction mode
      setExpression([...expression, input]);
    }
  };

  // Start fraction mode when "Fraction" button is pressed
  const startFraction = () => {
    setIsFractionMode(true);
    setIsNumerator(true);
    setCurrentFraction({ numerator: '', denominator: '' }); // Initialize a new fraction
  };

  // Toggle between numerator and denominator input
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

  // Exit fraction mode without adding
  const exitFractionMode = () => {
    setIsFractionMode(false);
    setCurrentFraction({ numerator: '', denominator: '' });
  };

  // Delete last element or fraction part
  const handleDelete = () => {
    if (isFractionMode) {
      // Delete from current fraction's numerator or denominator
      if (isNumerator && currentFraction.numerator) {
        setCurrentFraction({
          ...currentFraction,
          numerator: currentFraction.numerator.slice(0, -1),
        });
      } else if (!isNumerator && currentFraction.denominator) {
        setCurrentFraction({
          ...currentFraction,
          denominator: currentFraction.denominator.slice(0, -1),
        });
      }
    } else {
      // Remove last item from expression if not in fraction mode
      setExpression(expression.slice(0, -1));
    }
  };

  return (
    <View style={styles.container}>
      {/* Display Expression */}
      <View style={styles.displayContainer}>
        {expression.map((item, index) => {
          if (typeof item === 'object') {
            // Render fractions differently
            return (
              <FractionDisplay
                key={index}
                expression={`${item.numerator || '0'}/${item.denominator || '1'}`}
              />
            );
          }
          return (
            <Text key={index} style={styles.inputText}>
              {item}
            </Text>
          );
        })}
        {isFractionMode && (
          <FractionDisplay
            expression={`${currentFraction.numerator || ''}/${currentFraction.denominator || ''}`}
          />
        )}
      </View>

      {/* Keyboard */}
      <View style={styles.keyboardContainer}>
        {numberButtons.map((input) => (
          <TouchableOpacity key={input} style={styles.button} onPress={() => handleAddInput(input)}>
            <Text style={styles.buttonText}>{input}</Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.button} onPress={handleDelete}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={startFraction}>
          <Text style={styles.buttonText}>Fraction</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={toggleFractionPart}>
          <Text style={styles.buttonText}>{isNumerator ? '↓ Denom' : '↑ Num'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={exitFractionMode}>
          <Text style={styles.buttonText}>Fraction Out</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={finalizeFraction}>
          <Text style={styles.buttonText}>Finalize Fraction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  displayContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20,gap:5 },
  inputText: { fontSize: 18, color: '#333' ,fontFamily:'Janda'},
  keyboardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#D8B0FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  buttonText: { fontSize: 18, color: '#fff' },
});
