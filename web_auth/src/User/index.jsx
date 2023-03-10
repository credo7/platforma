import "Common/styles/index.css";
import "User/styles/index.css";

import "Common/services/moment";

import React from "react";
import { Outlet, Route, Routes } from "react-router-dom";

import { useStore } from "Common/hooks/store";

import { useUser } from "User/apollo/user/useUser";
import { useUserId } from "User/apollo/user/useUserId";

import Email from "User/pages/Email";
import Login from "User/pages/Login";
import Register from "User/pages/Register";
import Terms from "User/pages/Terms";
import PasswordRecover from "User/pages/PasswordRecover";
import UserInfo from "User/pages/UserInfo";
import UserUpdate from "User/pages/UserUpdate";
import Logout from "User/pages/Logout";
import NotFound from "Common/pages/NotFound";

const User = () => {
  const { store } = useStore();
  const { isAuth } = store;

  useUserId();
  useUser();

  const Layout = () => {
    return <Outlet />;
  };

  const Router = () => {
    return (
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={!isAuth ? <Login /> : <UserInfo />} />

          <Route path="login" element={!isAuth ? <Login /> : <NotFound />} />
          <Route
            path="register"
            element={!isAuth ? <Register /> : <NotFound />}
          />
          <Route
            path="recover"
            element={!isAuth ? <PasswordRecover /> : <NotFound />}
          />

          <Route path="terms" element={<Terms />} />
          <Route path="email" element={<Email />} />

          <Route path="info" element={isAuth ? <UserInfo /> : <NotFound />} />
          <Route path="logout" element={isAuth ? <Logout /> : <NotFound />} />
          <Route
            path="update/:field"
            element={isAuth ? <UserUpdate /> : <NotFound />}
          />

          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    );
  };

  return <Router />;
};

export default User;
