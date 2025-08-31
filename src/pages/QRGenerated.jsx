import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  QrCode,
  Download,
  Copy,
  Share2,
  ArrowRight,
  Receipt,
  Package,
  User,
  MapPin,
  Calendar,
  Clock,
  CreditCard,
  Smartphone,
  Shield,
  Hash,
  Crown,
  Star,
  Gift,
  Smartphone as PhoneIcon,
  Car
} from 'lucide-react';


import UnifiedButton from '../components/common/UnifiedButton';
import UnifiedIcon from '../components/common/UnifiedIcon';
import { useAuth } from '../useAuth';

const QRGenerated = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [packageDetails, setPackageDetails] = useState(null);
  const [qrData, setQrData] = useState(null);
  const [showQRDetails, setShowQRDetails] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(true);

  useEffect(() => {
    // Get order details from localStorage
    const storedOrder = localStorage.getItem('orderDetails');
    const storedPackage = localStorage.getItem('packageDetails');

    if (storedOrder) {
      setOrderDetails(JSON.parse(storedOrder));
    }

    if (storedPackage) {
      setPackageDetails(JSON.parse(storedPackage));
    }

    // Generate QR Code if not exists
    generateQRCode();
  }, []);

  const generateQRCode = async () => {
    try {
      setIsGenerating(true);

      // Get token from localStorage
      const token = localStorage.getItem('frontend_token');

      if (!token) {
        throw new Error('Token not found');
      }

      // Fetch QR code data from API
      const qrResponse = await fetch(`https://carwash-backend-production.up.railway.app/api/user/package-qr-code`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      console.log('QR response:', qrResponse);

      if (qrResponse.ok) {
        const qrData = await qrResponse.json();
        console.log('QR data received:', qrData);

        // Set QR code image and package info
        setQrData({
          qrCodeImage: qrData.data.qrCode,
          packageInfo: qrData.data.packageInfo
        });

        // Save package info to localStorage for other pages
        localStorage.setItem('qrCodeData', JSON.stringify({
          qrCodeImage: qrData.data.qrCode,
          packageInfo: qrData.data.packageInfo
        }));
      } else {
        throw new Error('Failed to fetch QR code');
      }

      // Fetch package status for additional info
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
          setQrData(prev => ({
            ...prev,
            packageInfo: {
              ...prev.packageInfo,
              ...statusData.data.package
            }
          }));
        }
      }

    } catch (error) {
      console.error('Error generating QR code:', error);
      alert('حدث خطأ في إنشاء QR Code');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyQR = async () => {
    if (qrData?.qrCodeImage) {
      try {
        await navigator.clipboard.writeText(qrData.qrCodeImage);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (error) {
        console.error('Error copying QR code:', error);
      }
    }
  };

  const handleDownloadQR = () => {
    if (qrData?.qrCodeImage) {
      const link = document.createElement('a');
      link.download = 'qr-code.png';
      link.href = qrData.qrCodeImage;
      link.click();
    }
  };

  const handleShareQR = () => {
    if (navigator.share) {
      navigator.share({
        title: 'QR Code للغسيل',
        text: `QR Code الخاص بباقة ${qrData?.packageInfo?.packageName || qrData?.packageInfo?.name || 'الباقة الأساسية'}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط إلى الحافظة');
    }
  };

  const handlePrintQR = () => {
    if (qrData?.qrCodeImage) {
      const printWindow = window.open('', '_blank');
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${qrData.packageInfo?.packageName || qrData.packageInfo?.name || 'الباقة الأساسية'}</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
              .qr-container { margin: 20px auto; max-width: 400px; }
              .qr-code { margin: 20px 0; }
              .details { text-align: right; direction: rtl; margin: 20px 0; }
              .package-name { font-size: 18px; font-weight: bold; color: #059669; }
              .customer-info { margin: 10px 0; }
              .operation-id { font-family: monospace; background: #f3f4f6; padding: 5px; }
            </style>
          </head>
          <body>
            <div class="qr-container">
              <h2>QR Code للغسيل</h2>
              <div class="qr-code">
                <img src="${qrData.qrCodeImage}" alt="QR Code" style="width: 150px; height: 150px; border: 2px solid #059669;" />
              </div>
              <div class="details">
                <div class="package-name">${qrData.packageInfo?.packageName || qrData.packageInfo?.name || 'الباقة الأساسية'}</div>
                <div class="customer-info">العميل: ${user?.name || user?.username || 'المستخدم'}</div>
                <div class="customer-info">نوع السيارة: ${qrData.packageInfo?.size === 'small' ? 'صغير' : qrData.packageInfo?.size === 'medium' ? 'متوسط' : qrData.packageInfo?.size === 'large' ? 'كبير' : 'متوسط'}</div>
                <div class="customer-info">عدد الغسلات المتبقية: ${qrData.packageInfo?.washesLeft || qrData.packageInfo?.paidWashesLeft || 0}</div>
                <div class="customer-info">السعر: ${qrData.packageInfo?.basePrice || 0} ريال</div>
              </div>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleContinueToBranch = () => {
    navigate('/branch-selection');
  };

  // if (isGenerating) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-6"></div>
  //         <h2 className="text-2xl font-bold text-gray-800 mb-2">جاري إنشاء QR Code</h2>
  //         <p className="text-gray-600">يرجى الانتظار...</p>
  //       </div>
  //     </div>
  //   );
  // }

  // if (!orderDetails || !packageDetails || !qrData) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-white">
  //       <div className="text-center">
  //         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
  //         <p className="text-gray-600">جاري التحميل...</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
            >
              <CheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">تم إنشاء QR Code بنجاح!</h1>
            <p className="text-gray-600">يمكنك الآن استخدام هذا الكود في أي فرع من فروعنا</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* QR Code Section */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-6">QR Code الخاص بك</h2>

                <div className="bg-white p-6 rounded-xl border-2 border-green-200 mb-6">
                  {qrData?.qrCodeImage ? (
                    <img
                      src={qrData.qrCodeImage}
                      alt="QR Code"
                      className="w-[200px] h-[200px] mx-auto"
                      id="qr-code-canvas"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] mx-auto bg-gray-100 border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-4xl mb-2">📱</div>
                        <div className="text-sm text-gray-600 font-mono">QR Code</div>
                        <div className="text-xs text-gray-500 mt-1">Loading...</div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الباقة:</span>
                    <span className="font-semibold text-green-600">
                      {qrData?.packageInfo?.packageName || qrData?.packageInfo?.name || 'الباقة الأساسية'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">نوع السيارة:</span>
                    <span className="font-semibold">
                      {qrData?.packageInfo?.size === 'small' ? 'صغير' :
                        qrData?.packageInfo?.size === 'medium' ? 'متوسط' :
                          qrData?.packageInfo?.size === 'large' ? 'كبير' :
                            qrData?.packageInfo?.size || 'متوسط'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الغسلات المتبقية:</span>
                    <span className="font-semibold text-blue-600">
                      {qrData?.packageInfo?.washesLeft || qrData?.packageInfo?.paidWashesLeft || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-semibold text-green-600">
                      {qrData?.packageInfo?.basePrice || 0} ريال
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <UnifiedButton
                    onClick={handleCopyQR}
                    className="flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Copy className="w-4 h-4" />
                    نسخ
                  </UnifiedButton>
                  <UnifiedButton
                    onClick={handleDownloadQR}
                    className="flex items-center justify-center gap-2"
                    variant="outline"
                  >
                    <Download className="w-4 h-4" />
                    تحميل
                  </UnifiedButton>
                </div>
              </div>
            </motion.div>

            {/* Details Section */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Package Details */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-green-600" />
                  تفاصيل الباقة
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">اسم الباقة:</span>
                    <span className="font-semibold">
                      {qrData?.packageInfo?.packageName || qrData?.packageInfo?.name || packageDetails?.name || 'الباقة الأساسية'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">السعر:</span>
                    <span className="font-semibold text-green-600">
                      {qrData?.packageInfo?.basePrice || packageDetails?.basePrice || 0} ريال
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">عدد الغسلات المتبقية:</span>
                    <span className="font-semibold">
                      {qrData?.packageInfo?.washesLeft || qrData?.packageInfo?.paidWashesLeft || packageDetails?.washes || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">حجم السيارة:</span>
                    <span className="font-semibold text-sm">
                      {qrData?.packageInfo?.size === 'small' ? 'صغير' :
                        qrData?.packageInfo?.size === 'medium' ? 'متوسط' :
                          qrData?.packageInfo?.size === 'large' ? 'كبير' :
                            qrData?.packageInfo?.size || 'متوسط'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  معلومات العميل
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span>{user?.name || user?.username || 'المستخدم'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <PhoneIcon className="w-4 h-4 text-gray-400" />
                    <span>{user?.phone || 'غير محدد'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* <Mail className="w-4 h-4 text-gray-400" /> */}
                    <span>{user?.email || 'غير محدد'}</span>
                  </div>
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <ArrowRight className="w-5 h-5" />
                  الخطوات التالية
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                    <span>اختر الفرع المناسب لك</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                    <span>اعرض QR Code للموظف</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>استمتع بخدمة الغسيل</span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Bottom Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <UnifiedButton
              onClick={handlePrintQR}
              className="flex items-center justify-center gap-2"
              variant="outline"
              size="lg"
            >
              {/* <Print className="w-5 h-5" /> */}
              طباعة QR Code
            </UnifiedButton>

            <UnifiedButton
              onClick={handleContinueToBranch}
              className="flex items-center justify-center gap-2"
              size="lg"
            >
              اختيار الفرع
              <ArrowRight className="w-5 h-5" />
            </UnifiedButton>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default QRGenerated;
