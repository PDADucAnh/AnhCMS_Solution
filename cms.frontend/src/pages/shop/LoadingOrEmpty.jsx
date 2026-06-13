import React from 'react';

const LoadingOrEmpty = ({ isLoading, message }) => {
  if (isLoading) {
    return (
      <div className="col-12 text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="col-12 text-center py-5">
      <i className="fas fa-box-open fa-3x text-light mb-3"></i>
      <p className="text-muted">{message || 'Không tìm thấy kết quả nào.'}</p>
    </div>
  );
};

export default LoadingOrEmpty;
