import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  QrCode,
  Car,
  Star,
  Clock,
  MapPin,
  Settings,
  LogOut,
  Edit,
  Download,
  Share2,
  Crown,
  Award,
  Sparkles,
  CheckCircle,
  ArrowRight,
  Loader2,
  AlertTriangle,
  Gift,
  Receipt,
  CreditCard
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAuth } from '../useAuth';
import { userPackageAPI, packageAPI } from '../api';

const Profile = () => {
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('qr-code');
  const { user, logout, isAuth, token } = useAuth();

  const [userPackages, setUserPackages] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qrCodeData, setQrCodeData] = useState(null);
  const [packageInfo, setPackageInfo] = useState(null);
  const [qrLoading, setQrLoading] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);

  // Tips and Feedback state
  const [currentStep, setCurrentStep] = useState('rating');
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

  const tipAmounts = [5, 10, 15, 20, 25, 30];

  const paymentMethods = [
    {
      id: 'apple',
      name: 'Apple Pay',
      description: 'دفع سريع وآمن',
      color: 'from-gray-800 to-gray-900',
      bgColor: 'from-gray-50 to-gray-100',
      isApplePay: true
    },
    {
      id: 'credit',
      name: 'بطاقة ائتمان',
      icon: '💳',
      description: 'فيزا، ماستركارد، مدى',
      color: 'from-green-500 to-green-600',
      bgColor: 'from-green-50 to-green-100',
      isApplePay: false
    }
  ];

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);
  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
    fetchUserData();
  }, []);

  useEffect(() => {
    // Get customer info from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    const packageDetails = JSON.parse(localStorage.getItem('packageDetails') || '{}');
    const qrCodeData = JSON.parse(localStorage.getItem('qrCodeData') || '{}');
    const selectedBranch = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    const customerInfoData = {
      name: qrCodeData.customerName || orderDetails.customerName || user?.username || 'العميل',
      phone: qrCodeData.customerPhone || orderDetails.customerPhone || user?.phone || '',
      carType: qrCodeData.carType || orderDetails.carType || userPackages?.size || 'متوسط',
      packageName: qrCodeData.packageName || packageDetails.name || userPackages?.name || 'الباقة الأساسية',
      packageType: qrCodeData.packageType || packageDetails.type || 'basic',
      branchName: qrCodeData.branchName || selectedBranch.name || orderDetails.branchName || 'الفرع الرئيسي',
      branchAddress: qrCodeData.branchAddress || selectedBranch.address || '',
      branchPhone: qrCodeData.branchPhone || selectedBranch.phone || '',
      operationId: qrCodeData.operationId || orderDetails.orderId || '#' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      remainingWashes: qrCodeData.remainingWashes || packageDetails.washes || userPackages?.washes || 1,
      totalWashes: qrCodeData.totalWashes || packageDetails.washes || userPackages?.washes || 1,
      price: qrCodeData.price || packageDetails.price || userPackages?.basePrice || 0,
      startDate: qrCodeData.startDate || new Date().toISOString(),
      expiryDate: qrCodeData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    setCustomerInfo(customerInfoData);
  }, [user, userPackages]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      if (user) {
        // جلب باقات المستخدم
        setUserPackages(user.package);

        // Fetch QR code and package info
        await fetchQRCodeData();
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('حدث خطأ في تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  };

  const fetchQRCodeData = async () => {
    try {
      setQrLoading(true);

      // Fetch QR code data
      const qrResponse = await fetch(`https://carwash-backend-production.up.railway.app/api/user/package-qr-code`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('QR response:', qrResponse);
      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        setQrCodeData(qrData.data.qrCode);
        setPackageInfo(qrData.data.packageInfo);
      }

      // Fetch package status
      const statusResponse = await fetch(`https://carwash-backend-production.up.railway.app/api/user/package-status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('Status response:', statusResponse);

      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        if (statusData.data.hasPackage) {
          setPackageInfo(prev => ({
            ...prev,
            ...statusData.data.package
          }));
        }
      }
    } catch (error) {
      console.error('Error fetching QR code data:', error);
    } finally {
      setQrLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'paypass-qr-code.png';
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'PayPass QR Code',
          text: 'استخدم هذا QR Code للوصول إلى خدمات غسيل السيارات',
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };

  const tabs = [
    { id: 'qr-code', label: 'QR Code', icon: <QrCode className="w-5 h-5" /> },
    { id: 'profile', label: 'الملف الشخصي', icon: <User className="w-5 h-5" /> },
    { id: 'packages', label: 'الباقات', icon: <Package className="w-5 h-5" /> },
    { id: 'feedback', label: 'التقييم والبقشيش', icon: <Star className="w-5 h-5" /> }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-green-100">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }


  // console.log('qrCodeData', qrCodeData);
  console.log('userPackes', userPackages);

  return (
    <div className="container mx-auto px-4 py-8">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : -20 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-8"
      >
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-full text-sm font-bold mb-6 shadow-lg">
          <User className="w-4 h-4" />
          الملف الشخصي
          <User className="w-4 h-4" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">مرحباً بك، {user?.username}</h1>
        <p className="text-gray-600 text-lg">إدارة حسابك وباقاتك</p>
      </motion.div>





      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="flex justify-center mb-8"
      >
        <div className="flex  gap-5 bg-white rounded-2xl p-2 shadow-lg border border-gray-100">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 ${activeTab === tab.id
                ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="max-w-4xl mx-auto"
      >

        {/* QR Code Tab */}
        {activeTab === 'qr-code' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <QrCode className="w-4 h-4" />
                  QR Code الخاص بك
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">عرض QR Code للوصول السريع</h3>
                <p className="text-gray-600">استخدم هذا QR Code للوصول إلى خدمات غسيل السيارات</p>
              </div>

              {qrLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-8 h-8 animate-spin text-green-600" />
                  <span className="ml-3 text-gray-600">جاري تحميل QR Code...</span>
                </div>
              ) : user.isPaid && qrCodeData && packageInfo.washesLeft > 0 ? (
                <div className="grid md:grid-cols-2 gap-6 items-center">
                  {/* QR Code */}
                  <div className="text-center">
                    <h1>{packageInfo.washesLeft === 0 || packageInfo.washesLeft === null ? 'لا يوجد غسلات متبقية' : 'يوجد غسلات متبقية'}</h1>
                    <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-200 inline-block">
                      <img
                        src={qrCodeData}
                        alt="QR Code"
                        className="w-48 h-48 mx-auto"
                        id="qr-code-canvas"
                      />
                    </div>
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={downloadQRCode}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Download className="w-4 h-4" />
                        تحميل QR Code
                      </button>
                      <button
                        onClick={shareQRCode}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                      >
                        <Share2 className="w-4 h-4" />
                        مشاركة
                      </button>
                    </div>
                  </div>

                  {/* Package Info */}
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-2xl border border-green-200">
                      <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                        <Package className="w-5 h-5 text-green-600" />
                        معلومات الباقة
                      </h4>

                      {packageInfo ? (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">اسم الباقة:</span>
                            <span className="font-semibold text-gray-900">{packageInfo.packageName || packageInfo.name}</span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">عدد الغسلات المتبقية:</span>
                            <span className="font-semibold text-green-600">
                              {packageInfo.washesLeft || packageInfo.paidWashesLeft || 0}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">حجم السيارة:</span>
                            <span className="font-semibold text-gray-900 capitalize">
                              {packageInfo.size === 'small' ? 'صغير' :
                                packageInfo.size === 'medium' ? 'متوسط' :
                                  packageInfo.size === 'large' ? 'كبير' : packageInfo.size}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">السعر الأساسي:</span>
                            <span className="font-semibold text-gray-900">{packageInfo.basePrice} ريال</span>
                          </div>

                          {packageInfo.originalPrice && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">السعر الأصلي:</span>
                              <span className="font-semibold text-gray-500 line-through">{packageInfo.originalPrice} ريال</span>
                            </div>
                          )}

                          {packageInfo.savings && (
                            <div className="flex items-center justify-between">
                              <span className="text-gray-600">التوفير:</span>
                              <span className="font-semibold text-green-600">{packageInfo.savings} ريال</span>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-center py-4">
                          <Package className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-500">لا توجد باقة نشطة</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">لا يمكن تحميل QR Code في الوقت الحالي</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="grid gap-8">
            {/* User Info Card */}
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <User className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{user?.name || user?.email || 'المستخدم'}</h3>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Mail className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">البريد الإلكتروني</p>
                    <p className="font-semibold text-gray-900">{user?.email || 'غير محدد'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Phone className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">رقم الهاتف</p>
                    <p className="font-semibold text-gray-900">{user?.phone || 'غير محدد'}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl">
                  <Calendar className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-500">تاريخ الانضمام</p>
                    <p className="font-semibold text-gray-900">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ar-SA') : 'غير محدد'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button
                  onClick={() => navigate('/update-profile')}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                >
                  <Edit className="w-5 h-5" />
                  تعديل الملف الشخصي
                </button>
                <button
                  onClick={handleLogout}
                  className="w-full border-2 border-red-500 text-red-600 font-bold py-3 px-6 rounded-xl hover:bg-red-50 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  <LogOut className="w-5 h-5" />
                  تسجيل الخروج
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Packages Tab */}
        {activeTab === 'packages' && user.isPaid && (
          <div className="grid gap-8">
            <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-full text-sm font-bold mb-4">
                  <Package className="w-4 h-4" />
                  باقاتي
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">الباقات المشتركة</h3>
                <p className="text-gray-600">عرض جميع الباقات المشتركة وتفاصيلها</p>
              </div>

              {userPackages ? (
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-xl font-bold text-gray-900">{userPackages.name}</h4>
                      <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        نشطة
                      </span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">عدد الغسلات المتبقية:</span>
                          <span className="font-semibold text-green-600">{userPackages.washes || 0}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">حجم السيارة:</span>
                          <span className="font-semibold text-gray-900">
                            {userPackages.size === 'small' ? 'صغير' :
                              userPackages.size === 'medium' ? 'متوسط' :
                                userPackages.size === 'large' ? 'كبير' : userPackages.size}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">مدة الباقة:</span>
                          <span className="font-semibold text-gray-900">{userPackages.duration} يوم</span>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">السعر الأساسي:</span>
                          <span className="font-semibold text-gray-900">{userPackages.basePrice} ريال</span>
                        </div>
                        {userPackages.originalPrice && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">السعر الأصلي:</span>
                            <span className="font-semibold text-gray-500 line-through">{userPackages.originalPrice} ريال</span>
                          </div>
                        )}
                        {userPackages.savings && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">التوفير:</span>
                            <span className="font-semibold text-green-600">{userPackages.savings} ريال</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Features */}
                    {userPackages.features && userPackages.features.length > 0 && (
                      <div className="mt-6 pt-6 border-t border-green-200">
                        <h5 className="font-semibold text-gray-900 mb-3">المميزات:</h5>
                        <div className="grid md:grid-cols-2 gap-2">
                          {userPackages.features.map((feature, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">{feature}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h4 className="text-xl font-semibold text-gray-900 mb-2">لا توجد باقات</h4>
                  <p className="text-gray-600 mb-6">لم تقم بشراء أي باقات بعد</p>
                  <button
                    onClick={() => navigate('/packages')}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center gap-2 mx-auto"
                  >
                    <Package className="w-5 h-5" />
                    تصفح الباقات
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Tab */}
        {activeTab === 'feedback' && (
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-gray-800 mb-2">
                {currentStep === 'rating' ? 'تقييم الخدمة' : 'البقشيش'}
              </h3>
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
                {currentStep === 'rating' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
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
                            className={`text-3xl transition-colors ${star <= branchRating ? 'text-yellow-400' : 'text-gray-300'
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
                            className={`text-3xl transition-colors ${star <= employeeRating ? 'text-yellow-400' : 'text-gray-300'
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

                    <button
                      onClick={() => setCurrentStep('tips')}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                      التالي: البقشيش
                      <ArrowRight className="w-5 h-5 mr-2" />
                    </button>
                  </div>
                )}

                {currentStep === 'tips' && (
                  <div className="bg-white rounded-2xl shadow-lg p-8">
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
                            className={`p-4 rounded-lg border-2 transition-all ${selectedTipAmount === amount
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
                            className={`p-4 rounded-lg border-2 transition-all text-right ${selectedPaymentMethod === method.id
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-200 hover:border-green-300'
                              }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-2xl">{method.icon}</span>
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
                      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
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
                                {cardData.showCvv ? '👁️' : '👁️‍🗨️'}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => setShowThankYou(true)}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
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
                    </button>
                  </div>
                )}
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
                      <span className="font-semibold">{customerInfo?.packageName || userPackages?.name || 'الباقة الأساسية'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الفرع:</span>
                      <span className="font-semibold">{customerInfo?.branchName || 'الفرع الرئيسي'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">نوع السيارة:</span>
                      <span className="font-semibold">{customerInfo?.carType || userPackages?.size || 'متوسط'}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">رقم العملية:</span>
                      <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                        {customerInfo?.operationId || '#' + Math.random().toString(36).substr(2, 9).toUpperCase()}
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
          </div>
        )}

        {/* Thank You Modal */}
        {showThankYou && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mb-4">شكراً لك!</h2>
              <p className="text-gray-600 mb-6">
                تم حفظ تقييمك وبقشيشك بنجاح. نتمنى أن تكون قد استمتعت بخدمتنا!
              </p>

              <button
                onClick={() => {
                  setShowThankYou(false);
                  setCurrentStep('rating');
                  setBranchRating(0);
                  setEmployeeRating(0);
                  setRatingComment('');
                  setSelectedTipAmount(null);
                  setCustomTipAmount('');
                  setSelectedPaymentMethod(null);
                  setTipMessage('');
                  setShowCardForm(false);
                  setCardData({
                    cardNumber: '',
                    cardHolder: '',
                    expiryDate: '',
                    cvv: '',
                    showCvv: false
                  });
                }}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                العودة للصفحة الرئيسية
              </button>
            </div>
          </div>
        )}

      </motion.div>
    </div>
  );
};

export default Profile; 