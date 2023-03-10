import "react-toastify/dist/ReactToastify.css";
import "./Toastify.scss";

import React from "react";
import { ToastContainer, toast as fToast } from "react-toastify";

export const toast = (content, containerId = "info", options = {}) =>
  fToast(content, { containerId, ...options });

const Toastify = () => {
  return (
    <>
      <ToastContainer
        containerId="info"
        enableMultiContainer={true}
        position={fToast.POSITION.TOP_CENTER}
        autoClose={3000}
        limit={1}
      />
      <ToastContainer
        containerId="hand"
        enableMultiContainer={true}
        position={fToast.POSITION.BOTTOM_CENTER}
        autoClose={0}
        limit={1}
      />
    </>
  );
};

export default Toastify;
