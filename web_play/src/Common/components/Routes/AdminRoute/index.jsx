import React from "react";

import { useStore } from "Common/hooks/store";
import { Route } from "react-router-dom";

const AdminRoute = ({ component: Component, ...rest }) => {
  const { store } = useStore();
  const { isAdmin } = store;

  return (
    <Route {...rest} render={(props) => isAdmin && <Component {...props} />} />
  );
};

export default AdminRoute;
