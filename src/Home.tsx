import React from "react";
import { FlatList, TouchableOpacity, SafeAreaView, View, Text, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { screens } from "./Navigation/screens";

export const Home = () => {
  const { navigate } = useNavigation<any>();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <FlatList
          data={screens}
          keyExtractor={(item) => item.navigationId} // Assuming navigationId is unique
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => navigate(item.navigationId)}
            >
              <Text style={styles.cardText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white", // Set background color
  },
  innerContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContent: {
    paddingBottom: 20,
  },
  card: {
    height: 75,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#efeeee", // Set your desired card background color
    marginVertical: 10,
    borderRadius: 8, // Rounded corners for the card
    elevation: 2, // Shadow for Android
    shadowColor: "#000", // Shadow for iOS
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  cardText: {
    textAlign: "center",
  },
});
