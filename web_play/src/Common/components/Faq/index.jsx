import "./index.scss";

import React from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

import FAQS from "Common/locales/faq.json";

const Faq = ({ children }) => {
  const history = useHistory();

  const params = new URLSearchParams(history.location.search);
  const searchFaq = params?.get("faq");

  if (!searchFaq) {
    return <></>;
  }

  const faqArr = params?.get("faq").split(",") || null;
  const faqId = parseInt(faqArr[1]) || 1;
  const faqName = faqArr[0] || "faqs";
  const faq = FAQS.find((item) => item.name === faqName && item.id === faqId);
  const faqPrevUrl = `${faq.url}?faq=${faqName},${faqId - 1}`;
  const faqNextUrl = `${faq.url}?faq=${faqName},${faqId + 1}`;

  if (faq) {
    return (
      <div className="Faq">
        <div className={`Faq__indicator ${faq.indicator}`}></div>
        <div className="Faq__prev">
          <Link to={faqPrevUrl}>{"<<"}</Link>
        </div>
        <div className="Faq__legenda">
          <div className="Faq__comment">{faq.comment}</div>
        </div>
        <div className="Faq__next">
          <Link to={faqNextUrl}>{">>"}</Link>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default Faq;
