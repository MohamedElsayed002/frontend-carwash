import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    ArrowLeft,
    Loader2,
    Shield,
    CreditCard,
    AlertCircle,
    CheckCircle,
    X,
    QrCode,
    UserCheck
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/footer/Footer';
import { hyperpayAPI } from '../api-hyperpay-fixed';

const PaymentForm = () => {
    const { checkoutId } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [paymentFormUrl, setPaymentFormUrl] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null);
    const [countdown, setCountdown] = useState(5);
    const [userPaymentStatus, setUserPaymentStatus] = useState(null);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        // First check user payment status
        checkUserPaymentStatus();
    }, []);

    useEffect(() => {
        // Check if we're returning from payment result
        const status = searchParams.get('status');
        const returnedCheckoutId = searchParams.get('checkoutId');

        if (status && returnedCheckoutId) {
            // If user has already paid, skip payment status check and show success
            if (userPaymentStatus === true) {
                setPaymentStatus('success');
                setLoading(false);
            } else {
                handlePaymentReturn(status, returnedCheckoutId);
            }
        } else if (checkoutId && userPaymentStatus !== null) {
            loadPaymentForm();
        } else if (!checkoutId) {
            setError('معرف الدفع غير صحيح');
            setLoading(false);
        }
    }, [checkoutId, searchParams, userPaymentStatus]);

    // Countdown effect for successful payment
    useEffect(() => {
        if (paymentStatus === 'success' && countdown > 0) {
            const timer = setTimeout(() => {
                setCountdown(countdown - 1);
            }, 1000);
            return () => clearTimeout(timer);
        } else if (paymentStatus === 'success' && countdown === 0) {
            navigate('/qr-generated');
        }
    }, [paymentStatus, countdown, navigate]);

    const checkUserPaymentStatus = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('frontend_token');

            if (!token) {
                setError('يرجى تسجيل الدخول أولاً');
                setLoading(false);
                return;
            }

            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'https://carwash-backend-production.up.railway.app/api'}/users/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const data = await response.json();

            if (data.success) {
                setUserData(data.data);
                setUserPaymentStatus(data.data.isPaid);
                console.log('✅ User payment status:', data.data.isPaid);
            } else {
                console.error('❌ Failed to get user data:', data.message);
                setError('فشل في الحصول على بيانات المستخدم');
            }
        } catch (error) {
            console.error('❌ Error checking user payment status:', error);
            setError('فشل في التحقق من حالة الدفع');
        } finally {
            setLoading(false);
        }
    };

    const handlePaymentReturn = async (status, returnedCheckoutId) => {
        try {
            setLoading(true)

            if (status === 'success') {
                // Check payment status from backend
                const statusResponse = await hyperpayAPI.checkPaymentStatus(returnedCheckoutId);
                console.log('📊 Payment status response:', statusResponse);

                if (statusResponse.success && statusResponse.status === 'success') {
                    setPaymentStatus('success');
                    setLoading(false);
                } else {
                    setPaymentStatus('failed');
                    setError('فشل في التحقق من حالة الدفع');
                    setLoading(false);
                }
            } else {
                setPaymentStatus('failed');
                setError('فشل في عملية الدفع');
                setLoading(false);
            }
        } catch (error) {
            console.error('❌ Error checking payment status:', error);
            setPaymentStatus('failed');
            setError('فشل في التحقق من حالة الدفع');
            setLoading(false);
        }
    };

    const loadPaymentForm = async () => {
        try {
            setLoading(true);
            setError(null);

            // Get the payment form URL from backend
            const formUrl = hyperpayAPI.getCheckoutFormUrl(checkoutId);
            setPaymentFormUrl(formUrl);

            console.log('🔗 Payment form URL:', formUrl);
            setLoading(false);
        } catch (error) {
            console.error('❌ Error loading payment form:', error);
            setError('فشل في تحميل نموذج الدفع');
            setLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/package-details');
    };

    const handleManualNavigation = () => {
        navigate('/qr-generated');
    };

    const handleOpenPaymentForm = () => {
        if (paymentFormUrl) {
            // Open payment form in new window
            window.open(paymentFormUrl, '_blank', 'width=600,height=800');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center">
                        <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
                        <p className="text-gray-600 text-lg">جاري تحميل نموذج الدفع...</p>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md mx-auto p-6">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-600" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={handleGoBack}
                            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                        >
                            العودة للباقة
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    // Show already paid status
    if (userPaymentStatus === true && !paymentStatus) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md mx-auto p-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <UserCheck className="w-10 h-10 text-green-600" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-gray-900 mb-4"
                        >
                            تم الدفع مسبقاً! ✅
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600 mb-6"
                        >
                            مرحباً {userData?.name}! لقد قمت بالدفع مسبقاً. يمكنك الآن الوصول إلى QR Code الخاص بك.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <button
                                onClick={() => navigate('/qr-generated')}
                                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                الذهاب إلى QR Code
                            </button>

                            <button
                                onClick={() => navigate('/package-details')}
                                className="inline-flex items-center bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-700 transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 mr-2" />
                                العودة للباقات
                            </button>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (paymentStatus === 'success') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
                <Header />
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="text-center max-w-md mx-auto p-6">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
                        >
                            <CheckCircle className="w-10 h-10 text-green-600" />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-2xl font-bold text-gray-900 mb-4"
                        >
                            تم الدفع بنجاح! 🎉
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-gray-600 mb-6"
                        >
                            شكراً لك! تم إتمام عملية الدفع بنجاح. جاري تحويلك إلى صفحة QR Code...
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="space-y-4"
                        >
                            <div className="flex items-center justify-center space-x-2 text-green-600">
                                <QrCode className="w-5 h-5" />
                                <span className="font-semibold">سيتم التحويل خلال {countdown} ثوانٍ</span>
                            </div>

                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <motion.div
                                    className="bg-green-600 h-2 rounded-full"
                                    initial={{ width: "100%" }}
                                    animate={{ width: "0%" }}
                                    transition={{ duration: 5, ease: "linear" }}
                                />
                            </div>

                            <button
                                onClick={handleManualNavigation}
                                className="inline-flex items-center bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
                            >
                                <QrCode className="w-5 h-5 mr-2" />
                                الانتقال الآن
                            </button>
                        </motion.div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
            <Header />

            <div className="container mx-auto px-4 py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center text-green-600 hover:text-green-700 mb-4 transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5 mr-2" />
                        العودة للباقة
                    </button>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        <CreditCard className="w-8 h-8 inline mr-3 text-green-600" />
                        صفحة الدفع الآمن
                    </h1>

                    <p className="text-gray-600 max-w-2xl mx-auto">
                        يرجى إدخال بيانات بطاقتك الائتمانية لإتمام عملية الدفع. جميع البيانات محمية ومشفرة.
                    </p>
                </motion.div>

                {/* Payment Form Container */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-2xl mx-auto"
                >
                    <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
                        {/* Payment Status Notice */}
                        {userPaymentStatus === false && (
                            <div className="flex items-center justify-center mb-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
                                <AlertCircle className="w-5 h-5 text-blue-600 mr-3" />
                                <span className="text-blue-800 font-medium">
                                    مرحباً {userData?.name}! يرجى إتمام عملية الدفع للوصول إلى الخدمة
                                </span>
                            </div>
                        )}

                        {/* Security Notice */}
                        <div className="flex items-center justify-center mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
                            <Shield className="w-5 h-5 text-green-600 mr-3" />
                            <span className="text-green-800 font-medium">
                                الدفع آمن ومشفر - HyperPay
                            </span>
                        </div>

                        {/* Payment Form */}
                        <div className="space-y-6">
                            {paymentFormUrl && (
                                <div className="border border-gray-200 rounded-xl p-6 bg-gray-50">
                                    <div className="text-center mb-4">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                                            نموذج الدفع
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            معرف الجلسة: {checkoutId}
                                        </p>
                                    </div>

                                    {/* Payment Form Button */}
                                    <div className="text-center">
                                        <button
                                            onClick={handleOpenPaymentForm}
                                            className="inline-flex items-center bg-green-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
                                        >
                                            <CreditCard className="w-5 h-5 mr-3" />
                                            فتح نموذج الدفع
                                        </button>
                                        <p className="text-xs text-gray-500 mt-3">
                                            سيتم فتح نموذج الدفع في نافذة جديدة
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Payment Instructions */}
                            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                                <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    تعليمات الدفع
                                </h4>
                                <ul className="text-sm text-blue-700 space-y-2">
                                    <li>• تأكد من صحة بيانات البطاقة قبل الإرسال</li>
                                    <li>• يمكنك استخدام بطاقات VISA أو MasterCard أو MADA</li>
                                    <li>• ستتم إعادة توجيهك إلى صفحة النتيجة بعد إتمام الدفع</li>
                                    <li>• في حالة وجود أي مشكلة، تواصل مع خدمة العملاء</li>
                                </ul>
                            </div>

                            {/* Test Cards Info */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                                <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2" />
                                    بيانات الاختبار
                                </h4>
                                <div className="text-sm text-yellow-700 space-y-2">
                                    <p><strong>VISA:</strong> 4200000000000000</p>
                                    <p><strong>MasterCard:</strong> 5454545454545454</p>
                                    <p><strong>CVV:</strong> 123 | <strong>Expiry:</strong> 12/25</p>
                                    <p><strong>Name:</strong> John Doe</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            <Footer />
        </div>
    );
};

export default PaymentForm;
