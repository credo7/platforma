import React from "react";
import { Redirect, Route } from "react-router-dom";

const PublicRoute = ({ component: Component, redirect, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) =>
        !redirect ? <Component {...props} /> : <Redirect to={redirect} />
      }
    />
  );
};

export default PublicRoute;
