import React from 'react';
import { View, Dimensions } from 'react-native';
import { Canvas, Line, Text, Path, Skia, useFont,Circle } from '@shopify/react-native-skia';

// Define a list of strong colors
const strongColors = ['blue', 'red', 'green'];

let usedColors = []; // Track used colors

// Function to get a unique color
const getUniqueColor = () => {
  // If all colors have been used, reset the list
  if (usedColors.length >= strongColors.length) {
    usedColors = [];
  }

  // Filter out used colors and pick a random one
  const availableColors = strongColors.filter(color => !usedColors.includes(color));
  const color = availableColors[Math.floor(Math.random() * availableColors.length)];

  // Track this color as used
  usedColors.push(color);
  return color;
};

// Create the path for a given function and range
const createFunctionPath = (fn, xMin, xMax, origin, scale) => {
  const path = Skia.Path.Make();
  path.moveTo(origin + xMin * scale, origin - fn(xMin) * scale);

  for (let x = xMin; x <= xMax; x += 0.1) {
    const y = fn(x);
    path.lineTo(origin + x * scale, origin - y * scale);
  }

  return path;
};

const Base = ({ 
  xMin = -4, 
  xMax = 4, 
  yMin = -4, 
  yMax = 4, 
  functions = [(x) => x ** 2, (x) => x],
  axisLength, // Default to 80% of screen width
  fontSize, // Default font size,
  point
}) => {
  const origin = axisLength / 2;
  const scale = axisLength / (xMax - xMin); // Dynamically scale to fit the x range
  const arrowSize = 8;

  // Load a font (replace with a custom font if needed)
  const font = useFont(require('../../Janda.ttf'), fontSize);

  const drawArrow = (x, y, direction) => {
    const arrowPath = Skia.Path.Make();
    if (direction === 'horizontal') {
      arrowPath.moveTo(x - arrowSize, y - arrowSize / 2);
      arrowPath.lineTo(x, y);
      arrowPath.lineTo(x - arrowSize, y + arrowSize / 2);
    } else {
      arrowPath.moveTo(x - arrowSize / 2, y + arrowSize);
      arrowPath.lineTo(x, y);
      arrowPath.lineTo(x + arrowSize / 2, y + arrowSize);
    }
    return arrowPath;
  };

  return (
      <Canvas style={{ width:axisLength+2, height: axisLength}}>
        {/* X-axis */}
        <Line p1={{ x: 0, y: origin }} p2={{ x: axisLength, y: origin }} color="black" strokeWidth={2} />
        {/* Y-axis */}
        <Line p1={{ x: origin, y: 3 }} p2={{ x: origin, y: axisLength }} color="black" strokeWidth={2} />
        {point && (
        <Circle
          cx={origin + point.x * scale}
          cy={origin - point.y * scale}
          r={3} // 3 pixels radius
          color="black"
        />
      )}
        {/* Arrow on X-axis */}
        <Path path={drawArrow(axisLength, origin, 'horizontal')} color="black" style={'stroke'} strokeWidth={2} strokeCap={'round'} />
        {/* Arrow on Y-axis */}
        <Path path={drawArrow(origin, 2, 'vertical')} color="black" style={'stroke'} strokeWidth={2} strokeCap={'round'} />

        {/* Tick marks and labels on X-axis */}
        {Array.from({ length: xMax - xMin + 1 }, (_, i) => {
          const x = origin + (i + xMin) * scale;
          if (i + xMin === 0) return null; // Skip 0 label on X-axis
          if (i + xMin === 5 || i + xMin === -5) return null; // Skip 0 label on Y-axis
          return (
            <React.Fragment key={`x-tick-${i}`}>
              <Line p1={{ x, y: origin - 5 }} p2={{ x, y: origin + 5 }} color="black" strokeWidth={1} />
              {font && (
                <Text
                  x={x - 5} // Adjust positioning for center alignment
                  y={origin + 8+fontSize}
                  text={`${i + xMin}`}
                  font={font}
                  color="black"
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Tick marks and labels on Y-axis */}
        {Array.from({ length: yMax - yMin + 1 }, (_, i) => {
          const y = origin - (i + yMin) * scale;
          if (i + yMin === 0) return null; // Skip 0 label on Y-axis
          if (-yMax + i === 5 || -yMax + i === -5) return null; // Skip 0 label on Y-axis
          return (
            <React.Fragment key={`y-tick-${i}`}>
              <Line p1={{ x: origin - 5, y }} p2={{ x: origin + 5, y }} color="black" strokeWidth={1} />
              {font && (
                <Text
                  x={-yMax + i>0? origin - fontSize-5:origin-fontSize-10} // Place labels to the left of the y-axis
                  y={y + 7} // Adjust positioning for alignment
                  text={`${-yMax + i}`}
                  font={font}
                  color="black"
                />
              )}
            </React.Fragment>
          );
        })}

        {/* Render each function with a unique color */}
        {functions.map((fn, index) => (
          <Path
            key={`function-${index}`}
            path={createFunctionPath(fn, xMin, xMax, origin, scale)}
            color={getUniqueColor()} // Use unique color for each path
            strokeWidth={2}
            style="stroke"
            opacity={0.5}
          />
        ))}
      </Canvas>
  );
};

export default Base;
