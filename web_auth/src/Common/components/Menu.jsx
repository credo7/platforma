import React from "react";
import { View } from "react-native";

import { useStore } from "Common/hooks/store";
import { Button } from "react-native-elements";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const { store } = useStore();

  const { isAuth } = store;

  const navigate = useNavigate();

  return (
    <View>
      {isAuth && (
        <>
          <Button
            title="Выйти"
            type="clear"
            titleStyle={{ color: "#4e7cff" }}
            onPress={() => navigate("/user/logout")}
          />
        </>
      )}
    </View>
  );
};

export default Menu;
