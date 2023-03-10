import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NotFound = () => {
  return (
    <View style={styles.NotFound__view}>
      <Text style={styles.NotFound__num}>404</Text>
      <Text style={styles.NotFound__msg}>Not Found</Text>
    </View>
  );
};

export default NotFound;

const styles = StyleSheet.create({
  NotFound__view: { textAlign: "center" },
  NotFound__num: { fontSize: "5em", color: "white" },
  NotFound__msg: { fontSize: "3em", color: "white" },
});
