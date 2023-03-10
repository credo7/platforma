import "./index.scss";

import React, { useState, useEffect } from "react";

export const usePagination = (initial = {}) => {
  const [pagination, setPagination] = useState({
    limit: 5,
    offset: 0,
    page: 1,
    hasPreviousPage: false,
    hasNextPage: true,
    ...initial,
  });

  return { pagination, setPagination };
};

const Pagination = ({ pagination, setPagination, pageInfo }) => {
  const { page, limit, offset, hasPreviousPage, hasNextPage } = pagination;

  useEffect(() => {
    page &&
      setPagination((prev) => ({
        ...prev,
        offset: (page - 1) * limit,
      }));
  }, [page, limit, offset, setPagination]);

  useEffect(() => {
    pageInfo && setPagination((prev) => ({ ...prev, ...pageInfo }));
  }, [pageInfo, setPagination]);

  const handlePreviousPage = () =>
    setPagination((prev) => ({ ...prev, page: page - 1 }));

  const handleNextPage = () =>
    setPagination((prev) => ({ ...prev, page: page + 1 }));

  return (
    <div className="Pagination__wrapper">
      <div className="Pagination__content">
        <div className="Pagination__previousPage">
          {hasPreviousPage ? (
            <button className="Pagination__btn" onClick={handlePreviousPage}>
              {"<<"}
            </button>
          ) : (
            <button className="Pagination__btn--disable">{"<<"}</button>
          )}
        </div>
        <div className="Pagination__currentPage">{page || ""}</div>
        <div className="Pagination__nextPage">
          {hasNextPage ? (
            <button className="Pagination__btn" onClick={handleNextPage}>
              {">>"}
            </button>
          ) : (
            <button className="Pagination__btn--disable">{">>"}</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Pagination;
