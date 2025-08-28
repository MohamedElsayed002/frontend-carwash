import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Star, 
  Heart, 
  Gift, 
  CreditCard, 
  CheckCircle,
  ArrowRight,
  MessageCircle,
  ThumbsUp,
  Smile,
  Lock,
  Shield,
  User,
  MapPin,
  Car,
  Package,
  Clock,
  Receipt,
  Home,
  Share2
} from 'lucide-react';
import { FaCreditCard, FaApple, FaLock, FaShieldAlt, FaCheckCircle, FaEye, FaEyeSlash } from 'react-icons/fa';
import UnifiedButton from '../components/common/UnifiedButton';
import UnifiedIcon from '../components/common/UnifiedIcon';
import PageContainer from '../components/common/PageContainer';
import applePayIcon from '../assets/apple-pay.png';
import visaIcon from '../assets/Visa.png';
import madaIcon from '../assets/Mada.png';
import mastercardIcon from '../assets/mastercard.png';

const RatingAndTips = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('rating'); // 'rating' or 'tips'
  const [branchRating, setBranchRating] = useState(0);
  const [employeeRating, setEmployeeRating] = useState(0);
  const [ratingComment, setRatingComment] = useState('');
  const [selectedTipAmount, setSelectedTipAmount] = useState(null);
  const [customTipAmount, setCustomTipAmount] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [tipMessage, setTipMessage] = useState('');
  const [showCardForm, setShowCardForm] = useState(false);
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
    showCvv: false
  });
  const [customerInfo, setCustomerInfo] = useState(null);

  useEffect(() => {
    // Get customer info from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    const packageDetails = JSON.parse(localStorage.getItem('packageDetails') || '{}');
    const qrCodeData = JSON.parse(localStorage.getItem('qrCodeData') || '{}');
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    const customerInfoData = {
      name: qrCodeData.customerName || orderDetails.customerName || 'العميل',
      phone: qrCodeData.customerPhone || orderDetails.customerPhone || '',
      carType: qrCodeData.carType || orderDetails.carType || 'متوسط',
      packageName: qrCodeData.packageName || packageDetails.name || 'الباقة الأساسية',
      packageType: qrCodeData.packageType || packageDetails.type || 'basic',
      branchName: qrCodeData.branchName || selectedBranch.name || orderDetails.branchName || 'الفرع الرئيسي',
      branchAddress: qrCodeData.branchAddress || selectedBranch.address || '',
      branchPhone: qrCodeData.branchPhone || selectedBranch.phone || '',
      operationId: qrCodeData.operationId || orderDetails.orderId || '#' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      remainingWashes: qrCodeData.remainingWashes || packageDetails.washes || 1,
      totalWashes: qrCodeData.totalWashes || packageDetails.washes || 1,
      price: qrCodeData.price || packageDetails.price || 0,
      startDate: qrCodeData.startDate || new Date().toISOString(),
      expiryDate: qrCodeData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };
    
    setCustomerInfo(customerInfoData);
  }, []);

  const tipAmounts = [5, 10, 15, 20, 25, 30];

  const paymentMethods = [
    {
      id: 'apple',
      name: 'Apple Pay',
      icon: applePayIcon,
      description: 'دفع سريع وآمن',
      color: 'from-gray-800 to-gray-900',
      bgColor: 'from-gray-50 to-gray-100',
      isApplePay: true
    },
    {
      id: 'credit',
      name: 'بطاقة ائتمان',
      icon: FaCreditCard,
      description: 'فيزا، ماستركارد، مدى',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      isApplePay: false
    }
  ];

  const handleRatingSubmit = async () => {
    if (branchRating === 0) {
      alert('يرجى تقييم الفرع');
      return;
    }

    try {
      // Save ratings to localStorage and backend
      const ratingData = {
        branchId: customerInfo?.branchId,
        branchName: customerInfo?.branchName,
        branchAddress: customerInfo?.branchAddress,
        branchPhone: customerInfo?.branchPhone,
        branchRating: branchRating,
        employeeRating: employeeRating,
        ratingComment: ratingComment,
        date: new Date().toISOString(),
        operationId: customerInfo?.operationId,
        customerName: customerInfo?.name,
        customerPhone: customerInfo?.phone,
        packageName: customerInfo?.packageName,
        carType: customerInfo?.carType
      };
      
      localStorage.setItem('branchRating', JSON.stringify(ratingData));

      // Send to backend
      const token = localStorage.getItem('frontend_token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/feedback/submit-rating`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(ratingData)
      });

      // Move to tips step
      setCurrentStep('tips');
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('حدث خطأ في حفظ التقييم');
    }
  };

  const handleMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
    if (methodId === 'credit') {
      setShowCardForm(true);
    } else {
      setShowCardForm(false);
    }
  };

  const handleApplePay = () => {
    if (window.ApplePaySession && ApplePaySession.canMakePayments()) {
      alert('جاري فتح Apple Pay...');
    } else {
      alert('Apple Pay غير متاح على هذا الجهاز');
    }
  };

  const handleCardInputChange = (field, value) => {
    setCardData(prev => ({ ...prev, [field]: value }));
  };

  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleTipSubmit = async () => {
    if (!selectedTipAmount && !customTipAmount) {
      alert('يرجى اختيار مبلغ البقشيش');
      return;
    }

    if (!selectedPaymentMethod) {
      alert('يرجى اختيار طريقة الدفع');
      return;
    }

    setIsProcessing(true);

    try {
      const tipAmount = selectedTipAmount || parseInt(customTipAmount);
      
      const tipData = {
        amount: tipAmount,
        message: tipMessage,
        paymentMethod: selectedPaymentMethod,
        operationId: customerInfo?.operationId,
        customerName: customerInfo?.name,
        customerPhone: customerInfo?.phone,
        branchName: customerInfo?.branchName,
        date: new Date().toISOString()
      };

      localStorage.setItem('tipData', JSON.stringify(tipData));

      // Send to backend
      const token = localStorage.getItem('frontend_token');
      await fetch(`${import.meta.env.VITE_API_BASE_URL}/tips/submit-tip`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(tipData)
      });

      setShowThankYou(true);
    } catch (error) {
      console.error('Error submitting tip:', error);
      alert('حدث خطأ في إرسال البقشيش');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFinish = () => {
    navigate('/');
  };

  if (showThankYou) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6"
          >
            <CheckCircle className="w-8 h-8 text-green-600" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4">شكراً لك!</h2>
          <p className="text-gray-600 mb-6">
            تم حفظ تقييمك وبقشيشك بنجاح. نتمنى أن تكون قد استمتعت بخدمتنا!
          </p>
          
          <UnifiedButton
            onClick={handleFinish}
            className="w-full"
            size="lg"
          >
            العودة للصفحة الرئيسية
          </UnifiedButton>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {currentStep === 'rating' ? 'تقييم الخدمة' : 'البقشيش'}
            </h1>
            <p className="text-gray-600">
              {currentStep === 'rating' 
                ? 'ساعدنا في تحسين خدماتنا من خلال تقييمك' 
                : 'أظهر تقديرك للخدمة الممتازة'
              }
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4 rtl:space-x-reverse">
              <div className={`flex items-center ${currentStep === 'rating' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'rating' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Star className="w-4 h-4" />
                </div>
                <span className="mr-2 text-sm font-medium">التقييم</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-200"></div>
              <div className={`flex items-center ${currentStep === 'tips' ? 'text-green-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep === 'tips' ? 'bg-green-100' : 'bg-gray-100'}`}>
                  <Gift className="w-4 h-4" />
                </div>
                <span className="mr-2 text-sm font-medium">البقشيش</span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="md:col-span-2">
              <AnimatePresence mode="wait">
                {currentStep === 'rating' && (
                  <motion.div
                    key="rating"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                  >
                    {/* Branch Rating */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-green-600" />
                        تقييم الفرع
                      </h3>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setBranchRating(star)}
                            className={`text-3xl transition-colors ${
                              star <= branchRating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-sm text-gray-600">
                        {branchRating === 0 && 'اضغط على النجوم للتقييم'}
                        {branchRating === 1 && 'سيء جداً'}
                        {branchRating === 2 && 'سيء'}
                        {branchRating === 3 && 'مقبول'}
                        {branchRating === 4 && 'جيد'}
                        {branchRating === 5 && 'ممتاز'}
                      </p>
                    </div>

                    {/* Employee Rating */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <User className="w-5 h-5 text-blue-600" />
                        تقييم الموظف
                      </h3>
                      <div className="flex justify-center space-x-2 rtl:space-x-reverse mb-4">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => setEmployeeRating(star)}
                            className={`text-3xl transition-colors ${
                              star <= employeeRating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                      <p className="text-center text-sm text-gray-600">
                        {employeeRating === 0 && 'اضغط على النجوم للتقييم (اختياري)'}
                        {employeeRating === 1 && 'سيء جداً'}
                        {employeeRating === 2 && 'سيء'}
                        {employeeRating === 3 && 'مقبول'}
                        {employeeRating === 4 && 'جيد'}
                        {employeeRating === 5 && 'ممتاز'}
                      </p>
                    </div>

                    {/* Comment */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        تعليقك (اختياري)
                      </label>
                      <textarea
                        value={ratingComment}
                        onChange={(e) => setRatingComment(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows="4"
                        placeholder="اكتب تعليقك هنا..."
                      />
                    </div>

                    <UnifiedButton
                      onClick={handleRatingSubmit}
                      className="w-full"
                      size="lg"
                    >
                      التالي: البقشيش
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </UnifiedButton>
                  </motion.div>
                )}

                {currentStep === 'tips' && (
                  <motion.div
                    key="tips"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white rounded-2xl shadow-lg p-8"
                  >
                    {/* Tip Amount Selection */}
                    <div className="mb-8">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <Gift className="w-5 h-5 text-green-600" />
                        اختر مبلغ البقشيش
                      </h3>
                      <div className="grid grid-cols-3 gap-3 mb-4">
                        {tipAmounts.map((amount) => (
                          <button
                            key={amount}
                            onClick={() => setSelectedTipAmount(amount)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedTipAmount === amount
                                ? 'border-green-500 bg-green-50 text-green-700'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="text-lg font-semibold">{amount} ريال</div>
                          </button>
                        ))}
                      </div>
                      
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          أو اكتب مبلغ مخصص
                        </label>
                        <input
                          type="number"
                          value={customTipAmount}
                          onChange={(e) => {
                            setCustomTipAmount(e.target.value);
                            setSelectedTipAmount(null);
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="أدخل المبلغ"
                        />
                      </div>
                    </div>

                    {/* Tip Message */}
                    <div className="mb-8">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        رسالة البقشيش (اختياري)
                      </label>
                      <textarea
                        value={tipMessage}
                        onChange={(e) => setTipMessage(e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                        rows="3"
                        placeholder="اكتب رسالة للموظف..."
                      />
                    </div>

                    {/* Payment Method */}
                    <div className="mb-6">
                      <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        طريقة الدفع
                      </h3>
                      <div className="grid grid-cols-1 gap-3">
                        {paymentMethods.map((method) => (
                          <button
                            key={method.id}
                            onClick={() => handleMethodSelect(method.id)}
                            className={`p-4 rounded-lg border-2 transition-all text-right ${
                              selectedPaymentMethod === method.id
                                ? 'border-green-500 bg-green-50'
                                : 'border-gray-200 hover:border-green-300'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {method.isApplePay ? (
                                  <img src={method.icon} alt="Apple Pay" className="w-8 h-8" />
                                ) : (
                                  <method.icon className="w-8 h-8 text-green-600" />
                                )}
                                <div>
                                  <div className="font-semibold text-gray-800">{method.name}</div>
                                  <div className="text-sm text-gray-600">{method.description}</div>
                                </div>
                              </div>
                              {selectedPaymentMethod === method.id && (
                                <CheckCircle className="w-5 h-5 text-green-600" />
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Card Form */}
                    {showCardForm && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mb-6 p-4 bg-gray-50 rounded-lg"
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              رقم البطاقة
                            </label>
                            <input
                              type="text"
                              value={cardData.cardNumber}
                              onChange={(e) => handleCardInputChange('cardNumber', formatCardNumber(e.target.value))}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="0000 0000 0000 0000"
                              maxLength="19"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              اسم حامل البطاقة
                            </label>
                            <input
                              type="text"
                              value={cardData.cardHolder}
                              onChange={(e) => handleCardInputChange('cardHolder', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="الاسم كما يظهر على البطاقة"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              تاريخ الانتهاء
                            </label>
                            <input
                              type="text"
                              value={cardData.expiryDate}
                              onChange={(e) => handleCardInputChange('expiryDate', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              رمز الأمان
                            </label>
                            <div className="relative">
                              <input
                                type={cardData.showCvv ? "text" : "password"}
                                value={cardData.cvv}
                                onChange={(e) => handleCardInputChange('cvv', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="CVV"
                                maxLength="4"
                              />
                              <button
                                type="button"
                                onClick={() => handleCardInputChange('showCvv', !cardData.showCvv)}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {cardData.showCvv ? <FaEyeSlash /> : <FaEye />}
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    <UnifiedButton
                      onClick={handleTipSubmit}
                      className="w-full"
                      size="lg"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          جاري المعالجة...
                        </>
                      ) : (
                        'إرسال البقشيش'
                      )}
                    </UnifiedButton>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Service Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-green-600" />
                  ملخص الخدمة
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الباقة:</span>
                    <span className="font-semibold">{customerInfo?.packageName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الفرع:</span>
                    <span className="font-semibold">{customerInfo?.branchName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">نوع السيارة:</span>
                    <span className="font-semibold">{customerInfo?.carType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">رقم العملية:</span>
                    <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                      {customerInfo?.operationId}
                    </span>
                  </div>
                </div>
              </div>

              {/* Current Step Info */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  {currentStep === 'rating' ? <Star className="w-5 h-5" /> : <Gift className="w-5 h-5" />}
                  {currentStep === 'rating' ? 'تقييم الخدمة' : 'البقشيش'}
                </h3>
                <p className="text-sm opacity-90">
                  {currentStep === 'rating' 
                    ? 'ساعدنا في تحسين خدماتنا من خلال تقييمك للفرع والموظف'
                    : 'أظهر تقديرك للخدمة الممتازة من خلال البقشيش'
                  }
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RatingAndTips;
