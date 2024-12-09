
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useRef, useState } from 'react';
import { Pressable, SafeAreaView, StyleSheet, Text,View } from 'react-native';
import {
  ScrollView,
  GestureHandlerRootView,
} from 'react-native-gesture-handler';
import ListItem from './ListItem';
import { useSharedValue } from 'react-native-reanimated';

const TITLES = [
  'Record the dismissible tutorial 🎥',
  'Leave 👍🏼 to the video',
  'Check YouTube comments',
  'Subscribe to the channel 🚀',
  'Leave a ⭐️ on the GitHub Repo',
];

interface TaskInterface {
  title: string;
  index: number;
}

const TASKS: TaskInterface[] = TITLES.map((title, index) => ({ title, index }));

// const TASKS = [
//   {
//     index: 0,
//     title: 'Record the dismissible tutorial 🎥',
//   },
//   { ... }, { ... }, { ... }
// ];

const BACKGROUND_COLOR = '#FAFBFF';

function Swipe() {
  const [tasks, setTasks] = useState(TASKS);

  const onDismiss = useCallback((task: TaskInterface) => {
    setTasks((tasks) => tasks.filter((item) => item.index !== task.index));
  }, []);

  const scrollRef = useRef(null);
  const shouldLastDismiss = useSharedValue(false)
  return (
      <View ref={scrollRef} style={{ flex: 1 }}>
        {tasks.map((task) => (
          <ListItem
            simultaneousHandlers={scrollRef}
            key={task.index}
            task={task}
            length={tasks.length-1}
            onDismiss={onDismiss}
            shouldLastDismiss={shouldLastDismiss}
          />
        ))}
        <View style={{alignItems:'flex-start'}}>
          <Pressable onPress={()=>{
            shouldLastDismiss.value=!shouldLastDismiss.value
          }}>
            <Text style={{backgroundColor:'pink',padding:5}}>dismiss last</Text>
          </Pressable>
        </View>
      </View>
  );
}

export default () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Swipe />
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  title: {
    fontSize: 60,
    marginVertical: 20,
    paddingLeft: '5%',
  },
});

export { TaskInterface };
