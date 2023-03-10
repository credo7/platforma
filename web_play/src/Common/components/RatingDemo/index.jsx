import React from "react";
import { useEffect } from "react";
import UserRatingCard from "ProfileCom/UserRatingCard";

function RatingDemo() {
  useEffect(() => {
    document.querySelectorAll(".UserRatingCard").forEach((item) => {
      item.classList.add("active");
      item.style.position = "static";
    });

  }, [])
  return (
    <div>
      <UserRatingCard data={[1, 2, 0.3, 1.5]} />
      <UserRatingCard data={[12, 1, 0.3, 8]} />
      <UserRatingCard data={[0.3, 0.5, 0.3, 0.5]} />
      <UserRatingCard data={[2, 1, 1.34, 0.5]} />
      <UserRatingCard data={[2, 1, 1.34, 0.5]} />
      <UserRatingCard data={[0, 0, 0, 0]} />
    </div>
  );
};

export default RatingDemo;
