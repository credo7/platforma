import "./index.scss";

import React, { useState } from "react";
import ReactModal from "react-modal";
import { BsFillXCircleFill } from "react-icons/bs";

const style = {
  overlay: {
    backgroundColor: "#332e59",
  },
  content: {
    top: "30%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "240px",
    minHeight: "240px",
    borderRadius: "20px",
    backgroundColor: "#2c254a",
    border: "1px solid #4e7cff",
  },
};

// const contentLabel = "Example Modal";

// Make sure to bind modal to your appElement (https://reactcommunity.org/react-modal/accessibility/)
ReactModal.setAppElement("#portal");

const renderOpenButton = () => "...";

const Modal = ({
  children,
  contentLabel = "Modal",
  openButton = {
    className: "Modal__open",
    child: renderOpenButton,
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => setIsOpen(true);

  const onAfterOpen = () => {};

  const onRequestClose = () => setIsOpen(false);

  return (
    <div>
      <div className={openButton?.className} onClick={openModal}>
        {openButton?.child()}
      </div>
      <ReactModal
        {...{ isOpen, onAfterOpen, onRequestClose, style, contentLabel }}
      >
        <div className="Modal__close">
          <BsFillXCircleFill onClick={onRequestClose} />
        </div>
        <div className="Modal">{children}</div>
      </ReactModal>
    </div>
  );
};

export default Modal;
