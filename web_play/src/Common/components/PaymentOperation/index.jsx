import React from "react";

import "./index.scss";

function PaymentOperation({ nameOperation, sum }) {
  return (
    <div className="PaymentOperation">
      <p className="PaymentOperation__text">
        {nameOperation}
      </p>
      <p className="Text-16px-700">
        {sum}р
      </p>
    </div>
  );
};

export default PaymentOperation;
