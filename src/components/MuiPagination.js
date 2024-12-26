import React from 'react';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';

const MuiPagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (event, page) => {
    onPageChange(page);
  };

  return (
    <Stack spacing={2} alignItems="center" sx={{ marginTop: 2 }}>
      <Pagination
        count={totalPages}
        page={currentPage}
        onChange={handlePageChange}
        variant="outlined" // Sử dụng style "outlined"
        color="primary" // Thay đổi màu sắc
        size="medium" // Kích thước của pagination
      />
    </Stack>
  );
};

export default MuiPagination;
