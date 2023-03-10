import React from "react";
import { useNavigate } from "react-router-dom";
import { Text, StyleSheet, Pressable } from "react-native";

const BtnToMain = () => {
  const navigate = useNavigate();

  return (
    <Pressable style={styles.BtnToMain} onPress={() => navigate("/")}>
      <Text style={styles.BtnToMain__title}>Вернуться</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  BtnToMain: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: "#4e7cff",
    marginHorizontal: 30,
    marginVertical: 30,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  BtnToMain__title: {
    color: "white",
    fontSize: 16,
  },
});

export default BtnToMain;
