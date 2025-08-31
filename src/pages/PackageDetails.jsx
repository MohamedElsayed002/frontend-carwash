import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Car,
  Clock,
  Star,
  CheckCircle,
  ArrowLeft,
  Sparkles,
  Shield,
  Crown,
  Gift,
  Users,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Zap,
  Award,
  Heart,
  TrendingUp,
  DollarSign,
  Percent,
  ShoppingCart,
  ArrowRight,
  Loader2,
  Settings,
  Search,
  Package
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/footer/Footer';
import { hyperpayAPI } from '../api-hyperpay-fixed';

const PackageDetails = () => {
  const navigate = useNavigate();
  const [packageData, setPackageData] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchUserProfile();
  }, []);


  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://carwash-backend-production.up.railway.app/api/users/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('frontend_token')}`
        }
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setUserData(data.data);
        if (data.data.package) {
          setPackageData(data.data.package);
        } else {
          setError('لا توجد باقة نشطة');
        }
      } else {
        setError(data.message || 'فشل في تحميل بيانات الملف الشخصي');
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
      setError('حدث خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      // Save package and user data to localStorage for checkout page
      const reservationData = {
        package: {
          _id: packageData._id,
          name: packageData.name,
          type: packageData.type,
          basePrice: packageData.basePrice,
          washes: packageData.washes,
          size: packageData.size,
          description: packageData.description,
          features: packageData.features
        },
        customer: {
          name: userData.name,
          email: userData.email,
          phone: userData.phone,
          _id: userData._id
        },
        carType: packageData.size || 'medium',
        totalPrice: packageData.basePrice,
        orderId: 'ORDER-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        orderDate: new Date().toISOString()
      };

      // Save to localStorage
      localStorage.setItem('reservationData', JSON.stringify(reservationData));
      localStorage.setItem('packageDetails', JSON.stringify(packageData));
      localStorage.setItem('orderDetails', JSON.stringify(reservationData));

      // Step 1: Prepare checkout with HyperPay
      const checkoutData = {
        amount: packageData.basePrice,
        currency: 'SAR',
        paymentType: "DB",
        customer: {
          email: userData.email,
          givenName: userData.name,
          surname: userData.username,
        },
        billing: {
          street1: "Test Street",
          city: "Riyadh",
          state: "Riyadh",
          country: "SA",
          postcode: "12345"
        }
      };

      const checkoutResponse = await hyperpayAPI.prepareCheckout(checkoutData);
      console.log('data', checkoutResponse)
      if (checkoutResponse.success && checkoutResponse.data.checkoutId) {
        localStorage.setItem('checkoutData', JSON.stringify(checkoutResponse));
        localStorage.setItem('checkoutId', checkoutResponse.data.checkoutId);
        navigate(`/payment-form/${checkoutResponse.data.checkoutId}`);
      }
    } catch (error) {
      console.log(error)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-green-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">جاري تحميل بيانات الباقة...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">حدث خطأ</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/profile')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            العودة إلى الملف الشخصي
          </button>
        </div>
      </div>
    );
  }

  if (!packageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-yellow-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">لا توجد باقة نشطة</h2>
          <p className="text-gray-600 mb-6">لم يتم العثور على باقة نشطة في ملفك الشخصي</p>
          <button
            onClick={() => navigate('/packages')}
            className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors"
          >
            اشترك في باقة جديدة
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <Header />

      {/* Main Content */}
      <div className="pt-20 pb-16">
        <div className="max-w-6xl mx-auto px-4">

          {/* Back Button */}
          <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            العودة إلى الملف الشخصي
          </motion.button>

          {/* Package Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-xl p-8 mb-8"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
              {/* Package Icon */}
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-lg">
                <Crown className="w-10 h-10" />
              </div>

              {/* Package Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">تفاصيل الباقة</h1>
                  <span className="bg-gradient-to-r from-blue-400 to-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
                    <Package className="w-4 h-4" />
                    متاحة للشراء
                  </span>
                </div>
                <p className="text-gray-600 text-lg mb-4">
                  {packageData.name} - {packageData.washes} غسلة
                </p>

                {/* Package Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{packageData.washes}</div>
                    <div className="text-sm text-gray-600">عدد الغسلات</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{packageData.duration}</div>
                    <div className="text-sm text-gray-600">دقيقة للغسلة</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{packageData.savings}</div>
                    <div className="text-sm text-gray-600">ريال توفير</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      {packageData.size === 'small' ? 'صغيرة' :
                        packageData.size === 'medium' ? 'متوسطة' :
                          packageData.size === 'large' ? 'كبيرة' : packageData.size}
                    </div>
                    <div className="text-sm text-gray-600">حجم السيارة</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">

            {/* Package Features */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-green-600" />
                  مميزات الباقة
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {packageData.features && packageData.features.map((feature, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-center gap-3 p-4 bg-green-50 rounded-2xl"
                    >
                      <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* User Information */}
              {userData && (
                <div className="bg-white rounded-3xl shadow-xl p-8 mb-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                    <Users className="w-6 h-6 text-green-600" />
                    معلومات المستخدم
                  </h2>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-6 bg-green-50 rounded-2xl border-2 border-green-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Users className="w-6 h-6 text-green-600" />
                        <h3 className="font-semibold text-gray-900">البيانات الشخصية</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">الاسم:</span>
                          <span className="font-semibold text-gray-900">{userData.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">اسم المستخدم:</span>
                          <span className="font-semibold text-gray-900">{userData.username}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">البريد الإلكتروني:</span>
                          <span className="font-semibold text-gray-900">{userData.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">رقم الهاتف:</span>
                          <span className="font-semibold text-gray-900">{userData.phone}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-blue-50 rounded-2xl border-2 border-blue-200">
                      <div className="flex items-center gap-3 mb-4">
                        <Calendar className="w-6 h-6 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">معلومات الحساب</h3>
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600">نوع الحساب:</span>
                          <span className="font-semibold text-gray-900">
                            {userData.role === 'user' ? 'مستخدم عادي' : userData.role}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">تاريخ الإنشاء:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(userData.createdAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">آخر تحديث:</span>
                          <span className="font-semibold text-gray-900">
                            {new Date(userData.updatedAt).toLocaleDateString('ar-SA')}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">عدد السيارات:</span>
                          <span className="font-semibold text-gray-900">{userData.cars?.length || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Package Details & Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-1"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <DollarSign className="w-6 h-6 text-green-600" />
                  تفاصيل الباقة
                </h2>

                {/* Package Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">اسم الباقة:</span>
                    <span className="font-semibold">{packageData.name}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعر الأصلي:</span>
                    <span className="font-semibold">{packageData.originalPrice} ريال</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">السعر المدفوع:</span>
                    <span className="font-semibold">{packageData.basePrice} ريال</span>
                  </div>

                  <div className="flex justify-between items-center text-green-600">
                    <span className="font-semibold">التوفير:</span>
                    <span className="font-bold">{packageData.savings} ريال</span>
                  </div>


                  <hr className="border-gray-200" />

                  <div className="flex justify-between items-center text-xl font-bold text-gray-900">
                    <span>الحالة:</span>
                    <span className="text-green-600">نشطة</span>
                  </div>
                </div>

                {/* Package Benefits */}
                <div className="bg-green-50 rounded-2xl p-6 mb-6">
                  <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-green-600" />
                    مميزات إضافية
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      صابون إيطالي فاخر
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      معطر داخلي مجاني
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      ضمان الجودة
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      خدمة عملاء 24/7
                    </li>
                  </ul>
                </div>

                {/* Package Actions */}
                <div className="space-y-3">
                  <motion.button
                    onClick={handleCheckout}
                    className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    شراء الباقة
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>

                  <motion.button
                    onClick={() => navigate('/packages')}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-3 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Package className="w-5 h-5" />
                    تصفح الباقات الأخرى
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center text-sm text-gray-600">
                  <p className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-4 h-4" />
                    صالح لمدة شهر واحد
                  </p>
                  <p className="flex items-center justify-center gap-2">
                    <Shield className="w-4 h-4" />
                    ضمان استرداد الأموال
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PackageDetails; 