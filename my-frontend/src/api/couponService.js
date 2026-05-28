import apiClient from './client';

export const couponService = {
    validateCoupon: (code) => apiClient('/coupons/validate', { body: { code } })
};
