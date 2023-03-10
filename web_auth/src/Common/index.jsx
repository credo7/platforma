import "Common/styles/index.css";
import "User/styles/index.css";

import "Common/services/moment";

import React from "react";
import { View, StyleSheet } from "react-native";
import { Header, ThemeProvider } from "react-native-elements";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import Toastify from "Common/components/Toastify";
import YandexMetrika from "Common/components/YandexMetrika";
import Nav from "Common/components/Nav";
import Logo from "Common/components/Logo";
import Menu from "Common/components/Menu";
import Footer from "Common/components/Footer";

import User from "User";
import { useDimensions } from "Common/hooks/dimensions";

const Layout = () => {
  const { mediaQuery } = useDimensions();

  return (
    <ThemeProvider theme={theme} useDark={true}>
      <YandexMetrika />
      <Toastify />
      <View style={styles.AppWrapper}>
        <View
          style={
            mediaQuery({ minWidth: 415, maxWidth: 4096 })
              ? mediaStyles.AppContainer
              : styles.AppContainer
          }
        >
          <Header
            leftComponent={<Logo />}
            centerComponent={<Nav />}
            rightComponent={<Menu />}
          />

          <View style={styles.AppContent}>
            <Outlet />
          </View>

          <Footer />
        </View>
      </View>
    </ThemeProvider>
  );
};

const Common = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Navigate to="/user" />} />
        <Route path="user/*" element={<User />} />
      </Route>
    </Routes>
  );
};

export default Common;

const theme = {
  Button: {
    raised: true,
  },
  Header: {
    backgroundColor: "#332e59",
    containerStyle: {
      borderBottomColor: "#332e59",
      height: 70,
    },
  },
};

const extStyles = {
  AppWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  AppContainer: {
    // flexDirection: "column",
    // justifyContent: "space-between",
    flex: "1 0 auto",
    maxWidth: 415,

    minHeight: "100vh",
    border: "1px solid #332e59",
  },
  AppContent: {
    flex: "1 0 auto",
  },
};

const extMediaStyles = {
  AppContainer: {
    ...extStyles.AppContainer,
    minHeight: 815,
    marginTop: 40,
    height: 815,
  },
};

const styles = StyleSheet.create(extStyles);
const mediaStyles = StyleSheet.create(extMediaStyles);
