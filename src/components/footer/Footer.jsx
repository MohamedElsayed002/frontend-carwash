import React from 'react';
import { Link } from 'react-router-dom';

// استيراد الصور بشكل صحيح
import sbcLogo from '../../assets/sbc.webp';
import appStoreBadge from '../../assets/app-store-badge.png';
import googlePlayBadge from '../../assets/google-play-badge.png';
import logo from '../../assets/logo.png';
import visaLogo from '../../assets/Visa.png';
import mastercardLogo from '../../assets/mastercard.png';
import applePayLogo from '../../assets/apple-pay.png';
import madaLogo from '../../assets/Mada.png';
import { MdEmail } from 'react-icons/md';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-600 via-gray-700 to-gray-800 text-white shadow-2xl" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
            <div className="flex items-center gap-3 lg:gap-4 mb-6 lg:mb-8">
              <Link className="group" to="/">
                <div className="relative">
                  <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-xl lg:rounded-2xl bg-gradient-to-br from-white to-gray-100 flex items-center justify-center border border-white/50 shadow-xl hover:shadow-2xl transition-all duration-300 group-hover:scale-105">
                    <img alt="PayPass Logo" className="w-7 h-7 sm:w-10 sm:h-10 lg:w-12 lg:h-12 object-contain" src={logo} />
                  </div>
                  <div className="absolute -top-1 -right-1 lg:-top-1.5 lg:-right-1.5 w-4 h-4 lg:w-6 lg:h-6 bg-gray-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-phone w-2 h-2 lg:w-3 lg:h-3 text-white" aria-hidden="true">
                      <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384"></path>
                    </svg>
                  </div>
                </div>
              </Link>
              <Link className="group" to="/">
                <div>
                  <h2 className="text-white font-bold text-xl sm:text-2xl lg:text-3xl xl:text-4xl mb-1 lg:mb-2 tracking-wide group-hover:text-gray-200 transition-colors">PayPass</h2>
                  <p className="text-gray-300 font-semibold text-sm sm:text-base lg:text-lg group-hover:text-gray-100 transition-colors">غسيل السيارات الذكي</p>
                </div>
              </Link>
            </div>
            <div className="mb-6 lg:mb-8">
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg leading-relaxed max-w-md">تجربة غسيل السيارات الذكية مع PayPass. سهولة الاستخدام، خدمات متقدمة، وضمان الجودة.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8 order-1 lg:order-2">
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl border-b-2 border-gray-400 pb-2 lg:pb-3 bg-gradient-to-r from-transparent to-gray-600/20 px-2 py-1 rounded-t-lg">الدعم</h3>
              <div className="space-y-1 lg:space-y-2">
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg focus:bg-gray-800 focus:text-white outline-none" to="/help-center">مركز المساعدة</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/technical-support">الدعم الفني</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/complaints">الشكاوى والاقتراحات</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/faq">الأسئلة الشائعة</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/contact">تواصل معنا</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/user-guide">دليل الاستخدام</Link>
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl border-b-2 border-gray-500 pb-2 lg:pb-3">الخدمات</h3>
              <div className="space-y-1 lg:space-y-2">
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/services">غسيل خارجي شامل</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/services">غسيل داخلي وخارجي</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/services">تلميع احترافي</Link>
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl border-b-2 border-gray-500 pb-2 lg:pb-3">الباقات</h3>
              <div className="space-y-1 lg:space-y-2">
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/packages">الباقة الأساسية</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/packages">الباقة المتقدمة</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/packages">الباقة الشاملة</Link>
              </div>
            </div>
            <div className="space-y-3 lg:space-y-4">
              <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl border-b-2 border-gray-500 pb-2 lg:pb-3">الشركة</h3>
              <div className="space-y-1 lg:space-y-2">
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/about">من نحن</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/team">فريق العمل</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/careers">الوظائف الشاغرة</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/news">الأخبار والتحديثات</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/partners">الشركاء</Link>
                <Link className="block text-gray-300 hover:text-white transition-all duration-300 text-sm lg:text-base py-1 px-2 lg:px-3 rounded-lg hover:bg-gray-800 focus:bg-gray-800 focus:text-white outline-none" to="/certificates">الشهادات والجوائز</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-500 bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-8">
            <div className="flex items-center gap-3 lg:gap-4 order-2 lg:order-1">
              <img alt="المركز السعودي للأعمال" className="h-10 lg:h-12 xl:h-16 w-auto object-contain opacity-90 hover:opacity-100 transition-opacity" src={sbcLogo} />
              <div className="text-gray-300 text-sm lg:text-base text-center">منصة موثقة من قبل<br />المركز السعودي للأعمال</div>
            </div>
            <div className="text-center flex-1 order-1 lg:order-2">
              <h3 className="text-white font-bold text-base lg:text-lg xl:text-xl mb-2 lg:mb-4">حمل تطبيق PayPass الآن</h3>
              <p className="text-gray-300 text-sm lg:text-base mb-4 lg:mb-6 max-w-2xl mx-auto">استمتع بخصومات حصرية وتتبع غسيل سيارتك بسهولة</p>
              <div className="flex justify-center items-center gap-2 lg:gap-3 flex-wrap">
                <a href="#" className="group block hover:scale-105 transition-all duration-300">
                  <img alt="App Store" className="h-11 lg:h-10 xl:h-12 w-auto object-contain filter drop-shadow-lg group-hover:drop-shadow-xl" src={appStoreBadge} />
                </a>
                <a href="#" className="group block hover:scale-105 transition-all duration-300">
                  <img alt="Google Play" className="h-10 lg:h-10 xl:h-12 w-auto object-contain filter drop-shadow-lg group-hover:drop-shadow-xl" src={googlePlayBadge} />
                </a>
              </div>
            </div>
            <Link className="group order-3" to="/">
              <div className="flex items-center gap-2 lg:gap-3">
                <div className="w-10 h-10 lg:w-12 lg:h-12 xl:w-14 xl:h-14 bg-gradient-to-br from-white to-gray-100 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-xl border border-white/40 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                  <img alt="PayPass Logo" className="w-6 h-6 lg:w-8 lg:h-8 xl:w-10 xl:h-10 object-contain" src={logo} />
                </div>
                <div className="hidden lg:block">
                  <h4 className="text-white font-bold text-base lg:text-lg group-hover:text-gray-200 transition-colors">PayPass</h4>
                  <p className="text-gray-300 text-sm lg:text-base group-hover:text-gray-100 transition-colors">غسيل السيارات الذكي</p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-500 bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 lg:gap-6">
            <div className="text-gray-300 text-sm lg:text-base text-center lg:text-right">© 2025 PayPass. جميع الحقوق محفوظة.</div>
            <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4">
              <Link to="/privacy" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors underline">سياسة الخصوصية</Link>
              <span className="hidden lg:inline-block text-gray-500">|</span>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors underline">الشروط والأحكام</Link>
              <span className="hidden lg:inline-block text-gray-500">|</span>
              <Link to="/terms" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors underline">شروط الاستخدام</Link>
              <span className="hidden lg:inline-block text-gray-500">|</span>
              <Link to="/sitemap" className="text-gray-300 hover:text-white text-sm lg:text-base transition-colors underline">خريطة الموقع</Link>
            </div>
            <div className="mb-20 md:mb-0 flex flex-row items-center gap-1 lg:gap-2">
              <div className="bg-white rounded-md p-1 lg:p-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <img alt="Visa" className="h-5 lg:h-6 w-auto object-contain" src={visaLogo} />
              </div>
              <div className="bg-white rounded-md p-1 lg:p-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <img alt="Mastercard" className="h-5 lg:h-6 w-auto object-contain" src={mastercardLogo} />
              </div>
              <div className="bg-white rounded-md p-1 lg:p-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <img alt="Apple Pay" className="h-5 lg:h-6 w-auto object-contain" src={applePayLogo} />
              </div>
              <div className="bg-white rounded-md p-1 lg:p-1.5 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105">
                <img alt="Mada" className="h-5 lg:h-6 w-auto object-contain" src={madaLogo} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 