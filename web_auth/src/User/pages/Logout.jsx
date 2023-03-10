import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StyleSheet, Text, View, Pressable } from "react-native";

import history from "Common/services/history";
import { useStore } from "Common/hooks/store";

import { useUserLogout } from "User/apollo/user/useUserLogout";

const Logout = () => {
  const { store } = useStore();

  const navigate = useNavigate();

  const { user } = store;

  const { logout, handleLogout } = useUserLogout({ user });

  useEffect(() => {
    logout && navigate("/") && history.push("/");
  }, [logout, navigate]);

  return (
    <View style={styles.Logout__container}>
      <Text style={styles.Logout__title}>Вы действительно хотите выйти?</Text>
      <View style={styles.Logout__wrapperBtn}>
        <Pressable style={styles.Logout__btn} onPress={handleLogout}>
          <Text style={styles.Logout__btn_title}>Да</Text>
        </Pressable>
        <Pressable style={styles.Logout__btn} onPress={() => navigate("/user")}>
          <Text style={styles.Logout__btn_title}>Нет</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  Logout__container: {
    alignItems: "center",
    paddingTop: 30,
  },
  Logout__title: {
    fontSize: 18.72,
    color: "white",
    margin: 20,
  },
  Logout__wrapperBtn: {
    flexDirection: "row",
  },
  Logout__btn: {
    borderWidth: 1,
    borderRadius: 3,
    backgroundColor: "#4e7cff",
    paddingHorizontal: 15,
    paddingVertical: 5,
    margin: 10,
    alignSelf: "center",
  },
  Logout__btn_title: {
    color: "white",
    fontSize: 16,
  },
});

export default Logout;
