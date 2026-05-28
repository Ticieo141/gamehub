export const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 VNĐ';
    return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
};
