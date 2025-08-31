import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  User,
  Phone,
  Shield,
  Sparkles,
  Car,
  Loader2,
  AtSign,
  MailIcon,
  Inbox,
  AtSignIcon,
  MailCheck
} from 'lucide-react';
import { useAuth } from '../useAuth';
import Notification from '../components/common/Notification';

const SignUp = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});

  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);
  }, []);

  // Notification helpers
  const displayNotification = (type, title, message) => {
    setNotificationData({ type, title, message });
    setShowNotification(true);
  };

  const showSuccessNotification = (message) => {
    displayNotification('success', 'تم بنجاح', message);
  };

  const showErrorNotification = (message) => {
    displayNotification('error', 'خطأ', message);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'الاسم الكامل مطلوب';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'الاسم الكامل يجب أن يكون 3 أحرف على الأقل';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'اسم المستخدم مطلوب';
    } else if (formData.username.trim().length < 3) {
      newErrors.username = 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل';
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username.trim())) {
      newErrors.username = "اسم المستخدم يجب أن يحتوي على أحرف إنجليزية وأرقام فقط'. يجب لا يوجد مسافه";
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'رقم الهاتف مطلوب';
    } else if (!/^\+966\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = 'رقم الهاتف يجب أن يكون بالصيغة: +966xxxxxxxxx';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 8) {
      newErrors.password = 'كلمة المرور يجب أن تكون 8 أحرف على الأقل';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'تأكيد كلمة المرور مطلوب';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'كلمة المرور غير متطابقة';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const result = await signup({
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        username: formData.username.trim()
      });

      console.log('result',result)

      if (result.success) {
        showSuccessNotification('تم إنشاء الحساب بنجاح! يمكنك الآن تسجيل الدخول.');

        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        const errorMessage = result.error || 'خطأ في إنشاء الحساب';
        setErrors({ general: errorMessage });
        showErrorNotification(errorMessage);
      }
    } catch (error) {
      console.error('Signup error:', error);
      const errorMessage = error.response?.data?.error || 'خطأ في الاتصال. يرجى المحاولة مرة أخرى.';
      setErrors({ general: errorMessage });
      showErrorNotification("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-center p-4 pt-32 pb-16 md:-mt-64">
        <div className="w-4/5 mx-auto max-w-6xl gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-3xl shadow-2xl p-6 lg:p-8"
          >
            <div className="text-center mb-6">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: isVisible ? 1 : 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg"
              >
                <User className="w-7 h-7" />
              </motion.div>

              <h1 className="text-2xl font-bold text-gray-900 mb-2">إنشاء حساب جديد</h1>
              <p className="text-gray-600 text-sm">انضم إلى PayPass واستمتع بخدمات غسيل السيارات المميزة</p>
            </div>

            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                {successMessage}
              </motion.div>
            )}

            {errors.general && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 flex items-center gap-2"
              >
                <AlertCircle className="w-5 h-5" />
                {errors.general}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  الاسم الكامل <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pr-12 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="أدخل اسمك الكامل"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  اسم المستخدم <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    className={`w-full pr-12 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.username ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="أدخل اسم المستخدم"
                    disabled={isLoading}
                  />
                </div>
                {errors.username && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  البريد الإلكتروني <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={`w-full pr-12 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="أدخل بريدك الإلكتروني"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  رقم الهاتف <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={`w-full placeholder:text-right pr-12 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.phone ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="+966 59 870 2593"
                    disabled={isLoading}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.phone}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`w-full pr-12 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.password ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="أدخل كلمة المرور"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  تأكيد كلمة المرور <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pr-12 pl-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.confirmPassword ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                      }`}
                    placeholder="أعد إدخال كلمة المرور"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-red-600 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.confirmPassword}
                  </p>
                )}
              </div>


              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-6 rounded-xl hover:from-green-600 hover:to-emerald-700 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    جاري إنشاء الحساب...
                  </>
                ) : (
                  <div>
                    <p className='text-white'>إنشاء الحساب</p>
                  </div>
                )}
              </motion.button>
            </form>

            <div className="text-center mt-4">
              <p className="text-gray-600">
                لديك حساب بالفعل؟{' '}
                <Link to="/login" className="text-green-600 hover:text-green-700 font-semibold">
                  تسجيل الدخول
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Toaster Notification */}
      {
        showNotification && (
          <Notification
            type={notificationData.type}
            title={notificationData.title}
            message={notificationData.message}
            onClose={() => setShowNotification(false)}
            position="top-right"
            duration={4000}
          />
        )
      }
    </>
  );
};

export default SignUp; 