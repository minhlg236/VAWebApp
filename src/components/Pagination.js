import React from "react";
import PropTypes from "prop-types";



const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = (page, total) => {
    if (total < 7) {
      return Array.from({ length: total }, (_, i) => i + 1);
    } else {
      if (page > 4 && page + 2 < total) {
        return [1, page - 1, page, page + 1, total];
      } else if (page > 4 && page + 2 >= total) {
        return [1, total - 3, total - 2, total - 1, total];
      } else {
        return [1, 2, 3, 4, 5, total];
      }
    }
  };

  const visiblePages = getVisiblePages(currentPage, totalPages);

  return (
    <div className="Table__pagination">
      <div className="Table__prevPageWrapper">
        <button
          className="Table__pageButton"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Trang trước
        </button>
      </div>
      <div className="Table__visiblePagesWrapper">
        {visiblePages.map((page, index) => (
          <button
            key={page}
            className={`Table__pageButton ${
              currentPage === page ? "Table__pageButton--active" : ""
            }`}
            onClick={() => onPageChange(page)}
          >
            {visiblePages[index - 1] + 2 < page ? `...${page}` : page}
          </button>
        ))}
      </div>
      <div className="Table__nextPageWrapper">
        <button
          className="Table__pageButton"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Trang sau
        </button>
      </div>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
