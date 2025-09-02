import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Printer,
  FileText,
  Download,
  Share2,
  CheckCircle,
  ArrowRight,
  Clock,
  User,
  MapPin,
  Car,
  Package,
  Receipt,
  QrCode,
  Calendar,
  Hash
} from 'lucide-react';
import UnifiedButton from '../components/common/UnifiedButton';
import UnifiedIcon from '../components/common/UnifiedIcon';

const WashPrinter = () => {
  const navigate = useNavigate();
  const [isPrinting, setIsPrinting] = useState(false);
  const [printComplete, setPrintComplete] = useState(false);
  const [customerInfo, setCustomerInfo] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [qrData, setQrData] = useState(null);

  useEffect(() => {
    // Get data from localStorage
    const orderDetails = JSON.parse(localStorage.getItem('orderDetails') || '{}');
    const packageDetails = JSON.parse(localStorage.getItem('packageDetails') || '{}');
    const qrCodeData = JSON.parse(localStorage.getItem('qrCodeData') || '{}');
    const branchData = JSON.parse(localStorage.getItem('selectedBranch') || '{}');

    const customerInfoData = {
      name: qrCodeData.customerName || orderDetails.customerName || 'العميل',
      phone: qrCodeData.customerPhone || orderDetails.customerPhone || '',
      carType: qrCodeData.carType || orderDetails.carType || 'متوسط',
      packageName: qrCodeData.packageName || packageDetails.name || 'الباقة الأساسية',
      packageType: qrCodeData.packageType || packageDetails.type || 'basic',
      operationId: qrCodeData.operationId || orderDetails.orderId || '#' + Math.random().toString(36).substr(2, 9).toUpperCase(),
      remainingWashes: qrCodeData.remainingWashes || packageDetails.washes || 1,
      totalWashes: qrCodeData.totalWashes || packageDetails.washes || 1,
      price: qrCodeData.price || packageDetails.price || 0,
      startDate: qrCodeData.startDate || new Date().toISOString(),
      expiryDate: qrCodeData.expiryDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    };

    setCustomerInfo(customerInfoData);
    setSelectedBranch(branchData);
    setQrData(qrCodeData);
  }, []);

  const handlePrint = async () => {
    setIsPrinting(true);

    try {
      // محاكاة عملية الطباعة
      await new Promise(resolve => setTimeout(resolve, 3000));

      // إنشاء محتوى الطباعة
      const printContent = `
        <html>
          <head>
            <title>إيصال الغسيل - ${customerInfo?.packageName}</title>
            <style>
              @media print {
                body { font-family: Arial, sans-serif; margin: 0; padding: 20px; direction: rtl; }
                .header { text-align: center; border-bottom: 2px solid #059669; padding-bottom: 10px; margin-bottom: 20px; }
                .logo { font-size: 24px; font-weight: bold; color: #059669; }
                .receipt { max-width: 400px; margin: 0 auto; }
                .section { margin: 15px 0; padding: 10px 0; border-bottom: 1px solid #eee; }
                .label { font-weight: bold; color: #333; }
                .value { color: #666; }
                .qr-code { text-align: center; margin: 20px 0; }
                .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #999; }
                .operation-id { font-family: monospace; background: #f3f4f6; padding: 5px; border-radius: 4px; }
                .package-name { font-size: 18px; font-weight: bold; color: #059669; }
                .branch-info { background: #f9fafb; padding: 10px; border-radius: 8px; }
              }
            </style>
          </head>
          <body>
            <div class="receipt">
              <div class="header">
                <div class="logo">مغسلة النقاء المطلق</div>
                <div>إيصال الغسيل</div>
              </div>
              
              <div class="section">
                <div class="package-name">${customerInfo?.packageName}</div>
                <div>نوع السيارة: ${customerInfo?.carType}</div>
                <div>عدد الغسلات: ${customerInfo?.remainingWashes}</div>
              </div>
              
              <div class="section">
                <div class="label">معلومات العميل:</div>
                <div class="value">الاسم: ${customerInfo?.name}</div>
                <div class="value">الهاتف: ${customerInfo?.phone}</div>
              </div>
              
              <div class="section">
                <div class="label">معلومات الفرع:</div>
                <div class="branch-info">
                  <div class="value">الفرع: ${selectedBranch?.arabicName || 'الفرع المختار'}</div>
                  <div class="value">العنوان: ${selectedBranch?.arabicAddress || ''}</div>
                  <div class="value">الهاتف: ${selectedBranch?.phone || ''}</div>
                </div>
              </div>
              
              <div class="section">
                <div class="label">تفاصيل العملية:</div>
                <div class="operation-id">رقم العملية: ${customerInfo?.operationId}</div>
                <div class="value">التاريخ: ${new Date().toLocaleDateString('ar-SA')}</div>
                <div class="value">الوقت: ${new Date().toLocaleTimeString('ar-SA')}</div>
              </div>
              
                             <div class="qr-code">
                 <div style="font-size: 12px; margin-bottom: 10px;">QR Code للتحقق</div>
                 <div style="width: 150px; height: 150px; border: 2px solid #059669; margin: 0 auto; display: flex; align-items: center; justify-content: center; font-size: 10px; color: #059669; background: #f9fafb;">
                   <div style="text-align: center;">
                     <div style="font-size: 24px; margin-bottom: 5px;">📱</div>
                     <div style="font-size: 8px;">QR Code</div>
                     <div style="font-size: 6px; color: #666;">Static</div>
                   </div>
                 </div>
               </div>
              
              <div class="footer">
                <div>شكراً لاختيارك مغسلة النقاء المطلق</div>
                <div>نتمنى لك تجربة غسيل ممتعة</div>
                <div>تاريخ الانتهاء: ${new Date(customerInfo?.expiryDate).toLocaleDateString('ar-SA')}</div>
              </div>
            </div>
          </body>
        </html>
      `;

      // فتح نافذة الطباعة
      const printWindow = window.open('', '_blank');
      printWindow.document.write(printContent);
      printWindow.document.close();

      // انتظار تحميل المحتوى ثم الطباعة
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
        setPrintComplete(true);
      }, 500);

    } catch (error) {
      console.error('Error printing:', error);
      alert('حدث خطأ في الطباعة');
    } finally {
      setIsPrinting(false);
    }
  };

  const handleDownload = () => {
    // إنشاء ملف PDF أو صورة للإيصال
    const receiptData = {
      customerName: customerInfo?.name,
      packageName: customerInfo?.packageName,
      carType: customerInfo?.carType,
      branchName: selectedBranch?.arabicName,
      operationId: customerInfo?.operationId,
      date: new Date().toLocaleDateString('ar-SA'),
      time: new Date().toLocaleTimeString('ar-SA')
    };

    // تحويل البيانات إلى JSON وتحميلها
    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${customerInfo?.operationId}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'إيصال الغسيل',
        text: `تم غسيل سيارتي في ${selectedBranch?.arabicName} - ${customerInfo?.packageName}`,
        url: window.location.href
      });
    } else {
      // نسخ الرابط للحافظة
      navigator.clipboard.writeText(window.location.href);
      alert('تم نسخ الرابط للحافظة');
    }
  };

  const handleContinue = () => {
    navigate('/');
  };

  if (!customerInfo || !selectedBranch) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

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
              <Printer className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">مطبعة الغسيل</h1>
            <p className="text-gray-600">اطبع إيصالك أو احفظه رقمياً</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Receipt Preview */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl shadow-lg p-8"
            >
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">معاينة الإيصال</h2>

                <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-300">
                  <div className="text-center mb-4">
                    <div className="text-2xl font-bold text-green-600 mb-2">مغسلة النقاء المطلق</div>
                    <div className="text-gray-600">إيصال الغسيل</div>
                  </div>

                  <div className="space-y-3 text-right">
                    <div className="flex justify-between">
                      <span className="text-gray-600">الباقة:</span>
                      <span className="font-semibold text-green-600">{customerInfo.packageName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">نوع السيارة:</span>
                      <span className="font-semibold">{customerInfo.carType}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الفرع:</span>
                      <span className="font-semibold">{selectedBranch.arabicName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">رقم العملية:</span>
                      <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                        {customerInfo.operationId}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">التاريخ:</span>
                      <span className="font-semibold">{new Date().toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">الوقت:</span>
                      <span className="font-semibold">{new Date().toLocaleTimeString('ar-SA')}</span>
                    </div>
                  </div>

                </div>
              </div>


            </motion.div>

            {/* Service Details */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-6"
            >
              {/* Service Summary */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-green-600" />
                  ملخص الخدمة
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الباقة:</span>
                    <span className="font-semibold">{customerInfo.packageName}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">نوع السيارة:</span>
                    <span className="font-semibold">{customerInfo.carType}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">الغسلات المتبقية:</span>
                    <span className="font-semibold text-blue-600">{customerInfo.remainingWashes}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">تاريخ الانتهاء:</span>
                    <span className="font-semibold text-sm">
                      {new Date(customerInfo.expiryDate).toLocaleDateString('ar-SA')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Branch Info */}
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-600" />
                  معلومات الفرع
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="font-semibold">{selectedBranch.arabicName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedBranch.arabicAddress}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">{selectedBranch.workingHours}</span>
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
                    <span>احتفظ بار كود للغسيل</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center  text-xs font-bold">2</div>
                    <span>انتقل لصفحة التقييم والبقشيش</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-white bg-opacity-20 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                    <span>أعطِ تقييمك للفرع والموظف</span>
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
              onClick={handleContinue}
              className="flex items-center justify-center gap-2 py-2 px-4 "
              size="lg"
            >
                العوده لصفحه الرئيسيه
              <ArrowRight className="w-5 h-5" />
            </UnifiedButton>
          </motion.div>
          <p className='text-center text-sm mt-2'>يمكنك ايجاد بار كود في صفحتك الشخصيه</p>

        </motion.div>
      </div>
    </div>
  );
};

export default WashPrinter;
