import { move } from "react-native-redash";
import { withSpring } from "react-native-reanimated";
export const WORD_HEIGHT = 55;
export const MARGIN_LEFT = 32;

const byOrder = (a, b) => {
  "worklet";
  return a.order.value > b.order.value ? 1 : -1;
};

export const reintroduce = (input, index, newOrder) => {
  "worklet";

  // Get the element to reintroduce
  const reintroducedElement = input[index];

  // Assign the new order to the reintroduced element
  reintroducedElement.order.value = newOrder;

  // Adjust the orders of other elements to avoid conflicts
  input.forEach((element) => {
    if (element.order.value !== -1 && element !== reintroducedElement) {
      // If another element has the same or higher order, shift it up
      if (element.order.value >= newOrder) {
        element.order.value += 1;
      }
    }
  });

  // Ensure the input array remains sorted by order
  input.sort((a, b) => a.order.value - b.order.value);
};


export const remove = (input, index) => {
  "worklet";
  const offsets = input
    .filter((_, i) => i !== index)
    .filter(o => o.order.value!==-1)
    .sort(byOrder);
  offsets.map((offset, i) => (offset.order.value = i));
};
export const reorder = (input, from, to) => {
  'worklet';
  const offsets = input.filter(o => o.order.value!==-1).sort(byOrder);
  const newOffset = move(offsets, from, to);

  newOffset.map((offset, index) => {
    // Update the order
    offset.order.value = index;
    // Use withSpring only during reorder to smoothly transition positions
  });
};
export const calculateLayout = (input, containerWidth, containerHeight, firstExecution,height,opIndex) => {
  "worklet";
  const offsets = input.filter(o => o.order.value!==-1).sort(byOrder);

  if (offsets.length === 0) {
    return;
  }

  let totalHeight = 0; // Track the total height of all lines
  let currentLineOffsets = []; // To hold offsets for the current line
  const lines = []; // Store the heights and offsets for each line
  const jump = height ? height :0
  const hasJumped = false
  // --- First Pass: Calculate Layout Positions and Line Heights ---
  offsets.forEach((offset, index) => {
    const totalWidth = currentLineOffsets.reduce((acc, o) => acc + o.width.value, 0);

    if (totalWidth + offset.width.value > containerWidth) {
      const currentLineMaxHeight = Math.max(...currentLineOffsets.map(o => o.height.value));
      

      lines.push({
        offsets: currentLineOffsets,
        lineMaxHeight: currentLineMaxHeight,
      });
      const isLineToBeJumped = currentLineOffsets.map(o => o.order.value).includes(opIndex);
      const realJump = isLineToBeJumped? jump:0      
      if (isLineToBeJumped) {
        hasJumped=true
        
      }
      
      totalHeight += currentLineMaxHeight+15+realJump;
      offset.x.value = 0;
      offset.y.value = totalHeight+15;

      currentLineOffsets = [offset];
    } else {
      offset.x.value = totalWidth;
      offset.y.value = totalHeight+15;
      currentLineOffsets.push(offset);
    }
  });

  if (currentLineOffsets.length > 0) {
    const lastLineMaxHeight = Math.max(...currentLineOffsets.map(o => o.height.value));
    totalHeight += lastLineMaxHeight;

    lines.push({
      offsets: currentLineOffsets,
      lineMaxHeight: lastLineMaxHeight,
    });
  }
  const lastJump = hasJumped?0:jump
  containerHeight.value = totalHeight + 5+30+lastJump;
  

  // Define the function to center items vertically in each line
  const centerItems = () => {
    lines.forEach(line => {
      const { offsets: lineOffsets, lineMaxHeight } = line;

      // Center items in the line
      lineOffsets.forEach(item => {
        const verticalCentering = (lineMaxHeight - item.height.value) / 2;
        item.y.value += verticalCentering;
      });
    });
  };

  // Execute with a timeout if firstExecution is true, otherwise execute immediately
  if (firstExecution) {
    setTimeout(centerItems, 300);
  } else {
    centerItems();
  }
};

