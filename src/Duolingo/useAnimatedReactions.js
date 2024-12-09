// useAnimatedReactions.js
import { useAnimatedReaction } from 'react-native-reanimated';

export const statusReaction = (offset, originalWidth, displaySign, originalOrder, offsets, containerWidth, containerHeight, calculateLayout,interactiveSign) => {
  useAnimatedReaction(
    () => offset.status.value,
    (current, previous) => {
      if (current !== previous && !offset.inputted.value) {
        if (current === 'dragging' && offset.order.value === 1 && interactiveSign.value === '+' && originalOrder.value === 1) {
          offset.width.value = originalWidth.value + 35;
        } else {
          if (current === 'resting' && previous === 'dragging' && offset.order.value === 1 && interactiveSign.value === '+' && originalOrder.value === 1) {
            
            offset.width.value = originalWidth.value;
            calculateLayout(offsets, containerWidth, containerHeight);
          }
          if (current === 'resting' && previous === 'dragging' && offset.order.value === 1 && interactiveSign.value === '+' && originalOrder.value !== 1) {
            offset.width.value = originalWidth.value - 33;
            calculateLayout(offsets, containerWidth, containerHeight);
          }
          if (current === 'resting' && previous === 'dragging' && offset.order.value === 1 && interactiveSign.value !== '+') {
            offset.width.value = originalOrder.value === 1 ? originalWidth.value : originalWidth.value - 15;
            calculateLayout(offsets, containerWidth, containerHeight);
          }
          if (current === 'dragging' && offset.order.value === 1 && interactiveSign.value === '+' && originalOrder.value !== 1) {
            offset.width.value = originalWidth.value;
          }
          if (current === 'dragging' && interactiveSign.value !== '+' && offset.order.value === 1) {
            offset.width.value = originalOrder.value !== 1 ? originalWidth.value : originalWidth.value + 7;
          }
        }
      }
    }
  );
};

export const orderReaction = (offset, originalWidth, displaySign, originalOrder, offsets, containerWidth, containerHeight, calculateLayout,interactiveSign) => {
  useAnimatedReaction(
    () => offset.order.value,
    (current, previous) => {
      if (current !== previous && !offset.inputted.value) {
        //here we r reintroducing items
        if (previous===-1 && offset.status.value==='resting' && current===1 && interactiveSign.value !== '+' &&  originalOrder.value !== 1 ) {
          offset.width.value = originalWidth.value - 15
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        //here we r reintroducing items
        if (originalOrder.value === 1 && current === 1 && previous === 2 && offset.status.value !== 'dragging') {
          offset.width.value = originalWidth.value;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (previous === 1 && offset.status.value === 'swapTarget' && interactiveSign.value === '+' && originalOrder.value === 1) {
          offset.width.value = originalWidth.value + 35;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (current === 1 && interactiveSign.value !== '+' && originalOrder.value !== 1 && previous === 2 && offset.status.value !== 'dragging') {
          offset.width.value = originalWidth.value - 15;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (previous === 1 && interactiveSign.value !== '+' && originalOrder.value !== 1) {
          offset.width.value = originalWidth.value;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (previous === 1 && interactiveSign.value !== '+' && originalOrder.value === 1) {
          offset.width.value = originalWidth.value + 10;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (current === 1 && interactiveSign.value !== '+' && originalOrder.value === 1 && offset.status.value !== 'dragging') {
          offset.width.value = originalWidth.value;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (previous === 1 && offset.status.value === 'swapTarget' && interactiveSign.value === '+' && originalOrder.value !== 1) {
          offset.width.value = originalWidth.value;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (current === 1 && originalOrder.value === 1 && interactiveSign.value === '+' && offset.status.value === 'swapTarget') {
          offset.width.value = originalWidth.value;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (current === 1 && originalOrder.value !== 1 && interactiveSign.value === '+' && offset.status.value === 'swapTarget') {
          offset.width.value = offset.width.value - 33;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
        if (current === 1 && previous === 2 && originalOrder.value !== 1 && interactiveSign.value === '+' && offset.status.value === 'resting') {
          offset.width.value = offset.width.value - 33;
          calculateLayout(offsets, containerWidth, containerHeight);
        }
      }
    }
  );
};
