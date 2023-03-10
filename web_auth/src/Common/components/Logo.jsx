import React from "react";
import { Link } from "react-router-dom";
import { View } from "react-native";

const Logo = () => {
  return (
    <View>
      <Link to="/">
        <img src="/big_logo.svg" alt="" />
      </Link>
    </View>
  );
};

export default Logo;
