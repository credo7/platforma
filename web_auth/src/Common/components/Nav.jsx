import React from "react";
import { View, Text, StyleSheet } from "react-native";

const Nav = () => {
  return (
    <View>
      <Text style={styles.Nav__title}>Авторизация</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  Nav__title: {
    color: "white",
    // lineHeight: "2.5em",
    letterSpacing: 3,
    fontSize: 17,
    fontWeight: "bold",
    marginVertical: 10,
  },
});

export default Nav;
