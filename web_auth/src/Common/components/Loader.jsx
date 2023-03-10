import React from "react";
import { ActivityIndicator } from "react-native-web";
import { View, StyleSheet } from "react-native";

const Loader = () => {
  return (
    <View style={styles.ActivityRow}>
      <ActivityIndicator size={60} styles={styles.ActivityItem} />
    </View>
  );
};

export default Loader;

const styles = StyleSheet.create({
  ActivityRow: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginVertical: 20,
  },
  ActivityItem: {
    paddingHorizontal: 10,
  },
});
