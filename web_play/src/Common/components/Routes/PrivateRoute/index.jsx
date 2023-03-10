import React from "react";

import { useStore } from "Common/hooks/store";
import { Route } from "react-router-dom";

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { store } = useStore();
  const { isAuth } = store;

  return (
    <Route {...rest} render={(props) => isAuth && <Component {...props} />} />
  );
};

export default PrivateRoute;
