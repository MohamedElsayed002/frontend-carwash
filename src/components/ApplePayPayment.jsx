import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Apple,
    Shield,
    Loader2,
    AlertTriangle,
    CheckCircle,
    XCircle
} from 'lucide-react';

// Apple Pay configuration
const wpwlOptions = {
    applePay: {
        displayName: "PayPass Car Wash",
        total: { label: "PAYPASS CAR WASH" },
        supportedNetworks: ["mada", "masterCard", "visa"],
        merchantCapabilities: ["supports3DS", "supportsCredit", "supportsDebit"],
        countryCode: "SA",
        supportedCountries: ["SA"],
        version: 3
    }
};

const ApplePayPayment = ({
    amount,
    currency = 'SAR',
    customer,
    onSuccess,
    onError,
    onCancel
}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isApplePayAvailable, setIsApplePayAvailable] = useState(false);

    useEffect(() => {
        loadApplePayScript();
        checkApplePayAvailability();
    }, []);

    const loadApplePayScript = () => {
        // Load Apple Pay script if not already loaded
        if (!document.querySelector('script[src*="appleid.auth.js"]')) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js';
            script.async = true;
            document.head.appendChild(script);
        }

        // Add Apple Pay styles
        if (!document.querySelector('#apple-pay-styles')) {
            const style = document.createElement('style');
            style.id = 'apple-pay-styles';
            style.textContent = `
                .wpwl-form {
                    max-width: 100% !important;
                }
                .wpwl-apple-pay-button {
                    font-size: 16px !important;
                    display: block !important;
                    width: 100% !important;
                    -webkit-appearance: -apple-pay-button;
                    -apple-pay-button-type: buy;
                }
                .wpwl-apple-pay-button {
                    -webkit-appearance: -apple-pay-button !important;
                }
            `;
            document.head.appendChild(style);
        }

        // Set global wpwlOptions
        window.wpwlOptions = wpwlOptions;
    };

    const checkApplePayAvailability = () => {
        try {
            // Check if Apple Pay is available
            if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
                setIsApplePayAvailable(true);
                console.log('✅ Apple Pay is available');
            } else {
                setIsApplePayAvailable(false);
                console.log('❌ Apple Pay is not available');
            }
        } catch (error) {
            console.error('❌ Error checking Apple Pay availability:', error);
            setIsApplePayAvailable(false);
        }
    };

    const handleApplePayPayment = async () => {
        try {
            setIsLoading(true);
            setError(null);

            console.log('🍎 Starting Apple Pay payment...');

            // Create payment request with production settings
            const paymentRequest = {
                countryCode: 'SA',
                currencyCode: currency,
                supportedNetworks: ['visa', 'masterCard', 'mada'],
                merchantCapabilities: ['supports3DS', 'supportsCredit', 'supportsDebit'],
                total: {
                    label: 'PAYPASS CAR WASH',
                    amount: amount.toString()
                },
                merchantIdentifier: '8ac9a4c998364f7e01983b83983b2207', // Production entity ID
                displayName: 'PayPass Car Wash'
            };

            // Create Apple Pay session
            const session = new ApplePaySession(3, paymentRequest);

            session.onvalidatemerchant = (event) => {
                console.log('🔍 Validating merchant...');
                console.log('🔍 Validation URL:', event.validationURL);

                // Validate with Apple Pay servers using production entity ID
                fetch(event.validationURL, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        merchantIdentifier: '8ac9a4c998364f7e01983b83983b2207',
                        domainName: window.location.hostname,
                        displayName: 'PayPass Car Wash'
                    })
                })
                    .then(response => response.json())
                    .then(validationData => {
                        console.log('✅ Merchant validation successful:', validationData);
                        session.completeMerchantValidation(validationData);
                    })
                    .catch(error => {
                        console.error('❌ Merchant validation failed:', error);
                        session.abort();
                    });
            };

            session.onpaymentauthorized = (event) => {
                console.log('✅ Payment authorized:', event.payment);

                // Process the payment with your backend
                processApplePayPayment(event.payment);
            };

            session.oncancel = (event) => {
                console.log('❌ Apple Pay cancelled');
                setError('تم إلغاء الدفع عبر Apple Pay');
                if (onCancel) onCancel();
            };

            // Begin the session
            session.begin();

        } catch (error) {
            console.error('❌ Apple Pay error:', error);
            setError('حدث خطأ أثناء الدفع عبر Apple Pay');
            if (onError) onError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const processApplePayPayment = async (payment) => {
        try {
            console.log('🔄 Processing Apple Pay payment...');

            // Simulate payment processing
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create payment data for backend
            const paymentData = {
                method: 'apple_pay',
                amount: amount,
                currency: currency,
                customer: customer,
                paymentToken: payment.token,
                billingContact: payment.billingContact,
                shippingContact: payment.shippingContact
            };

            // Call success callback
            if (onSuccess) {
                onSuccess(paymentData);
            }

        } catch (error) {
            console.error('❌ Apple Pay processing error:', error);
            setError('فشل في معالجة الدفع عبر Apple Pay');
            if (onError) onError(error);
        }
    };

    // Render loading state
    if (isLoading) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center"
            >
                <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    جاري معالجة الدفع عبر Apple Pay...
                </h3>
                <p className="text-gray-600">
                    يرجى الانتظار بينما نعالج الدفع
                </p>
            </motion.div>
        );
    }

    // Render error state
    if (error) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8"
            >
                <div className="text-center mb-6">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <XCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                        خطأ في Apple Pay
                    </h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => {
                            setError(null);
                            handleApplePayPayment();
                        }}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                    >
                        إعادة المحاولة
                    </button>

                    {onCancel && (
                        <button
                            onClick={onCancel}
                            className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                        >
                            إلغاء الدفع
                        </button>
                    )}
                </div>
            </motion.div>
        );
    }

    // Render Apple Pay not available
    if (!isApplePayAvailable) {
        return (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-white rounded-2xl p-8 text-center"
            >
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Apple className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    Apple Pay غير متاح
                </h3>
                <p className="text-gray-600 mb-6">
                    Apple Pay غير متاح على هذا الجهاز أو المتصفح
                </p>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                    <h4 className="font-semibold text-blue-800 mb-2">متطلبات Apple Pay:</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                        <li>• جهاز Apple (iPhone, iPad, Mac)</li>
                        <li>• متصفح Safari</li>
                        <li>• بطاقة مدعومة في Apple Pay</li>
                        <li>• تسجيل الدخول بـ iCloud</li>
                        <li>• اختبار على جهاز حقيقي (مطلوب)</li>
                    </ul>
                </div>

                {onCancel && (
                    <button
                        onClick={onCancel}
                        className="w-full bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                    >
                        العودة لطرق الدفع الأخرى
                    </button>
                )}
            </motion.div>
        );
    }

    // Render Apple Pay button
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-2xl p-8"
        >
            <div className="text-center mb-6">
                <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto mb-4">
                    <Apple className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                    الدفع عبر Apple Pay
                </h3>
                <p className="text-gray-600">
                    المبلغ: <span className="font-bold text-green-600">{amount} {currency}</span>
                </p>
            </div>

            {/* Apple Pay Security Info */}
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-green-600" />
                    <div>
                        <h4 className="font-semibold text-green-800">دفع آمن عبر Apple Pay</h4>
                        <p className="text-sm text-green-700">
                            جميع المعاملات محمية بتقنيات التشفير المتقدمة من Apple
                        </p>
                    </div>
                </div>
            </div>

            {/* Apple Pay Button */}
            <button
                onClick={handleApplePayPayment}
                className="wpwl-apple-pay-button w-full py-4 px-6 rounded-xl font-semibold transition-colors"
                style={{
                    WebkitAppearance: '-apple-pay-button',
                    ApplePayButtonType: 'buy'
                }}
            >
                الدفع عبر Apple Pay
            </button>

            {/* Apple Pay Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-6">
                <h4 className="font-semibold text-gray-800 mb-2">معلومات Apple Pay:</h4>
                <ul className="text-sm text-gray-600 space-y-1">
                    <li>• دفع سريع وآمن</li>
                    <li>• لا يتم مشاركة بيانات البطاقة</li>
                    <li>• مصادقة عبر Face ID أو Touch ID</li>
                    <li>• دعم البطاقات المحلية والدولية</li>
                </ul>
            </div>

            {/* Cancel Button */}
            {onCancel && (
                <button
                    onClick={onCancel}
                    className="w-full mt-4 bg-gray-500 text-white py-3 px-6 rounded-xl font-semibold hover:bg-gray-600 transition-colors"
                >
                    إلغاء الدفع
                </button>
            )}
        </motion.div>
    );
};

export default ApplePayPayment;
