import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  QrCode,
  CheckCircle,
  Clock,
  MapPin,
  User,
  Star,
  Package,
  Car,
  Calendar,
  AlertTriangle,
  ArrowRight,
  Download,
  Share2,
  Copy,
  Heart,
  ThumbsUp,
  MessageCircle,
  Gift,
  CreditCard
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useWash, addUsageRecord } from '../utils/qrSystem';
import UnifiedButton from '../components/common/UnifiedButton';

const WashProcess = () => {
  const navigate = useNavigate();
  const [qrData, setQrData] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [washStatus, setWashStatus] = useState('ready'); // ready, washing, completed
  const [washProgress, setWashProgress] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [showTip, setShowTip] = useState(false);
  const [rating, setRating] = useState(0);
  const [branchRating, setBranchRating] = useState(0);
  const [employeeRating, setEmployeeRating] = useState(0);
  const [comment, setComment] = useState('');
  const [tipAmount, setTipAmount] = useState(0);
  const [selectedTipMethod, setSelectedTipMethod] = useState('card');

  useEffect(() => {
    try {
      // تحميل البيانات من localStorage
      const storedQR = localStorage.getItem('qrCodeData');
      const storedBranch = localStorage.getItem('selectedBranch');

      console.log("storedQR", storedQR);
      console.log("storedBranch", storedBranch);
      setSelectedBranch(JSON.parse(storedBranch));
      setQrData(JSON.parse(storedQR));
      console.log("QR DATA", qrData);
      console.log("BRANCH DATA", selectedBranch);
      // إنشاء بيانات تجريبية
      const demoQRData = {
        operationId: 'DEMO-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        customerName: qrData.customerName,
        //   customerPhone: '+966501234567',
        //   carType: 'متوسط',
        //   packageName: 'الباقة المميزة',
        //   packageType: 'premium',
        //   totalWashes: 10,
        //   remainingWashes: 7,
        //   price: 150,
        //   startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        //   expiryDate: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000).toISOString(),
        //   branchName: 'مغسلة النقاء المطلق',
        //   branchAddress: 'طريق الملك فهد، العليا، الرياض',
        //   id: 1,
        //   arabicName: 'مغسلة النقاء المطلق',
        //   address: 'طريق الملك فهد، العليا، الرياض',
        //   phone: '+966 11 488 1234',
        //   rating: 4.7,
        //   type: 'premium'
      };
      console.log("demoQRData", demoQRData);
      // setQrData(demoQRData);
      // localStorage.setItem('qrCodeData', JSON.stringify(demoQRData));
    } catch (error) {
      console.error('خطأ في تحميل البيانات:', error);
      alert('حدث خطأ في تحميل البيانات');
    }
  }, []);

  const startWashing = async () => {
    if (!qrData || !selectedBranch) {
      alert('بيانات غير مكتملة');
      return;
    }

    setWashStatus('washing');
    setWashProgress(0);

    // محاكاة عملية الغسيل
    const interval = setInterval(() => {
      setWashProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          completeWashing();
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const completeWashing = async () => {
    try {
      // خصم غسلة من QR
      const updatedQR = await useWash(qrData, selectedBranch.arabicName);

      // إضافة سجل الاستخدام
      await addUsageRecord(qrData, selectedBranch.arabicName, 'wash_completed');

      // تحديث QR في localStorage
      localStorage.setItem('qrCodeData', JSON.stringify(updatedQR));
      setQrData(updatedQR);

      setWashStatus('completed');

      // عرض التقييم بعد 2 ثانية
      setTimeout(() => {
        setShowRating(true);
      }, 2000);

    } catch (error) {
      alert('حدث خطأ أثناء إتمام الغسيل');
      setWashStatus('ready');
    }
  };

  const handleRatingSubmit = () => {
    // حفظ التقييم
    const ratingData = {
      branchId: selectedBranch.id,
      branchName: selectedBranch.arabicName,
      branchRating,
      employeeRating,
      comment,
      date: new Date().toISOString(),
      customerName: qrData.customerName
    };

    localStorage.setItem('branchRating', JSON.stringify(ratingData));

    // عرض خيار البقشيش
    setShowRating(false);
    setShowTip(true);
  };

  const handleTipPayment = async () => {
    if (tipAmount <= 0) {
      // تخطي البقشيش
      navigate('/rating-and-tips');
      return;
    }

    // محاكاة دفع البقشيش
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const tipData = {
        amount: tipAmount,
        method: selectedTipMethod,
        branchId: selectedBranch.id,
        branchName: selectedBranch.arabicName,
        date: new Date().toISOString(),
        customerName: qrData.customerName
      };

      localStorage.setItem('tipData', JSON.stringify(tipData));

      alert('شكراً لك! تم دفع البقشيش بنجاح');
      navigate('/rating-and-tips');

    } catch (error) {
      alert('حدث خطأ أثناء دفع البقشيش');
    }
  };

  const tipOptions = [
    { amount: 10, label: '10 ريال' },
    { amount: 20, label: '20 ريال' },
    { amount: 30, label: '30 ريال' },
    { amount: 50, label: '50 ريال' }
  ];

  const getWashStatusText = () => {
    switch (washStatus) {
      case 'ready': return 'جاهز للغسيل';
      case 'washing': return 'جاري الغسيل...';
      case 'completed': return 'تم الغسيل بنجاح!';
      default: return '';
    }
  };

  const getWashStatusColor = () => {
    switch (washStatus) {
      case 'ready': return 'text-blue-600';
      case 'washing': return 'text-orange-600';
      case 'completed': return 'text-green-600';
      default: return 'text-gray-600';
    }
  };

  if (!qrData || !selectedBranch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
        <div className="text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-800 mb-2">بيانات غير مكتملة</h3>
          <p className="text-gray-600">يرجى العودة لصفحة اختيار الفرع</p>
          <UnifiedButton
            onClick={() => navigate('/branches')}
            className="mt-4"
          >
            العودة لاختيار الفرع
          </UnifiedButton>
        </div>
      </div>
    );
  }

  return (
    <h1>Wash Process</h1>
  );
};

export default WashProcess; 