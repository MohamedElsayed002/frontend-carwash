import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  User,
  Shield,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Loader2,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../useAuth';
import Notification from '../components/common/Notification';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  // State management
  const [isVisible, setIsVisible] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationData, setNotificationData] = useState({});

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});

  // Initialize component
  useEffect(() => {
    setIsVisible(true);
    window.scrollTo(0, 0);

    // Check for redirect message
    if (location.state?.message) {
      showSuccessNotification(location.state.message);
    }
  }, [location]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'البريد الإلكتروني غير صحيح';
    }

    if (!formData.password) {
      newErrors.password = 'كلمة المرور مطلوبة';
    } else if (formData.password.length < 6) {
      newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    // Clear any server-side errors when user starts typing
    if (name === 'email' || name === 'password') {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Show notification helper
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

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});
    console.log('formData', formData)
    try {
      const result = await login({
        email: formData.email.trim().toLowerCase(),
        password: formData.password
      });
      console.log('result', result)
      if (result.success) {
        showSuccessNotification('تم تسجيل الدخول بنجاح');
        setTimeout(() => {
          navigate('/profile');
        }, 1500);
      } else {
        showErrorNotification(result.error || 'خطأ في تسجيل الدخول');

        // Also show field-specific errors if available
        if (result.error && result.error.includes('البريد الإلكتروني')) {
          setErrors(prev => ({ ...prev, email: result.error }));
        } else if (result.error && result.error.includes('كلمة المرور')) {
          setErrors(prev => ({ ...prev, password: result.error }));
        } else if (result.error && (result.error.includes('غير صحيحة') || result.error.includes('غير مسجل'))) {
          // For general credential errors, show in both fields
          setErrors(prev => ({
            email: 'بيانات تسجيل الدخول غير صحيحة',
            password: 'بيانات تسجيل الدخول غير صحيحة'
          }));
        }
      }
    } catch (error) {
      console.log(error)
      showErrorNotification('خطأ في الاتصال. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid place-items-center ">
      <div className="w-4/5 md:w-3/5 mx-auto gap-8">

        {/* Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: isVisible ? 1 : 0, x: isVisible ? 0 : -50 }}
          transition={{ duration: 0.6 }}
          className="bg-white rounded-3xl shadow-sm p-8 lg:p-12"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: isVisible ? 1 : 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <User className="w-8 h-8" />
            </motion.div>

            <h1 className="text-3xl font-bold text-gray-900 mb-2">تسجيل الدخول</h1>
            <p className="text-gray-600">مرحباً بك مرة أخرى في PayPass</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pr-12 pl-4 py-4 placeholder:text-right border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.email ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  placeholder="أدخل بريدك الإلكتروني"
                  dir="ltr"
                />
              </div>
              {errors.email && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.email}
                </motion.p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pr-12 pl-12 placeholder:text-right py-4 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 ${errors.password ? 'border-red-300 focus:border-red-500' : 'border-gray-200 focus:border-green-500'
                    }`}
                  placeholder="أدخل كلمة المرور"
                  dir="ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-500 text-sm mt-2 flex items-center gap-1"
                >
                  <AlertCircle className="w-4 h-4" />
                  {errors.password}
                </motion.p>
              )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  جاري تسجيل الدخول...
                </>
              ) : (
                <>
                  تسجيل الدخول
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <p className="text-gray-600">
                ليس لديك حساب؟{' '}
                <Link
                  to="/signup"
                  className="text-green-600 hover:text-green-700 font-semibold transition-colors"
                >
                  إنشاء حساب جديد
                </Link>
              </p>
            </div>
          </form>
        </motion.div>

      </div>

      {/* Notification Component */}
      {showNotification && (
        <Notification
          type={notificationData.type}
          title={notificationData.title}
          message={notificationData.message}
          onClose={() => setShowNotification(false)}
        />
      )}
    </div>
  );
};

export default Login;