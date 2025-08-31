// Fixed HyperPay API for Frontend
import axios from 'axios';

// API Configuration
const API_BASE_URL = 'https://carwash-backend-production.up.railway.app/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 15000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token (if needed)
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('frontend_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        console.error('❌ API Error:', error.response?.data || error.message);
        return Promise.reject(error);
    }
);

// HyperPay Payment Service (Fixed)
export const hyperpayAPI = {
    // Step 1: Prepare checkout (Server-to-Server)
    prepareCheckout: async (checkoutData) => {
        try {
            console.log('📤 Preparing checkout with backend:', checkoutData);
            const response = await api.post('/hyperpay/prepare-checkout-copyandpay', checkoutData);
            console.log('📥 Checkout response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Checkout preparation error:', error);
            throw new Error(error.response?.data?.error || 'فشل في إعداد الدفع');
        }
    },

    // Step 2: Get checkout form URL (Frontend)
    getCheckoutFormUrl: (checkoutId) => {
        const user = JSON.parse(localStorage.getItem('frontend_user') || '{}');
        return `${API_BASE_URL}/hyperpay/create-checkout-form/${checkoutId}?userId=${user.data._id || user.id}`;
    },

    // Step 3: Get payment result URL
    getPaymentResultUrl: () => {
        return `${API_BASE_URL}/hyperpay/payment-result`;
    },

    // Step 3: Check payment status
    checkPaymentStatus: async (checkoutId) => {
        try {
            console.log('🔍 Checking payment status:', checkoutId);
            const response = await api.get('/hyperpay/check-status', {
                params: { checkoutId }
            });
            console.log('📊 Payment status response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Payment status error:', error);
            throw new Error(error.response?.data?.error || 'فشل في التحقق من حالة الدفع');
        }
    },

    // Test checkout (for development)
    testCheckout: async () => {
        try {
            console.log('🧪 Testing checkout with backend...');
            const response = await api.get('/hyperpay/test');
            console.log('📥 Test checkout response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Test checkout error:', error);
            throw new Error(error.response?.data?.error || 'فشل في اختبار الدفع');
        }
    },

    // Health check
    healthCheck: async () => {
        try {
            console.log('🏥 Checking HyperPay service health...');
            const response = await api.get('/hyperpay/health');
            console.log('📥 Health check response:', response.data);
            return response.data;
        } catch (error) {
            console.error('❌ Health check error:', error);
            throw new Error(error.response?.data?.error || 'فشل في فحص صحة الخدمة');
        }
    }
};

export default hyperpayAPI;
