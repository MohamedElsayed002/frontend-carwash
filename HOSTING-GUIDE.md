# دليل استضافة مشروع PayPass

## الملفات المطلوبة للاستضافة

تم إنشاء ملفات التكوين التالية لدعم مختلف منصات الاستضافة:

### 1. **Netlify** - `public/_redirects` و `netlify.toml`
### 2. **Vercel** - `vercel.json`
### 3. **Firebase Hosting** - `firebase.json`
### 4. **Apache** - `.htaccess`
### 5. **Nginx** - `nginx.conf`
### 6. **IIS (Windows)** - `web.config`

## كيفية الاستضافة على كل منصة

### 🌐 **Netlify**

1. **رفع المشروع:**
   ```bash
   # بناء المشروع
   npm run build
   
   # رفع مجلد dist إلى Netlify
   ```

2. **إعدادات Netlify:**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Node version: `18`

3. **الملفات المطلوبة:**
   - `public/_redirects` - للتوجيه
   - `netlify.toml` - للإعدادات المتقدمة

### ⚡ **Vercel**

1. **ربط المشروع:**
   ```bash
   # تثبيت Vercel CLI
   npm i -g vercel
   
   # نشر المشروع
   vercel
   ```

2. **الملفات المطلوبة:**
   - `vercel.json` - للتوجيه والإعدادات

### 🔥 **Firebase Hosting**

1. **إعداد Firebase:**
   ```bash
   # تثبيت Firebase CLI
   npm install -g firebase-tools
   
   # تسجيل الدخول
   firebase login
   
   # تهيئة المشروع
   firebase init hosting
   ```

2. **بناء ونشر:**
   ```bash
   npm run build
   firebase deploy
   ```

3. **الملفات المطلوبة:**
   - `firebase.json` - لإعدادات الاستضافة

### 🐧 **Apache (cPanel, Shared Hosting)**

1. **رفع الملفات:**
   - ارفع محتويات مجلد `dist` إلى `public_html`
   - ارفع ملف `.htaccess` إلى المجلد الجذر

2. **الملفات المطلوبة:**
   - `.htaccess` - للتوجيه والأمان

### 🚀 **Nginx (VPS, Dedicated Server)**

1. **تثبيت Nginx:**
   ```bash
   sudo apt update
   sudo apt install nginx
   ```

2. **إعداد الموقع:**
   ```bash
   # نسخ ملف التكوين
   sudo cp nginx.conf /etc/nginx/sites-available/paypass
   
   # تفعيل الموقع
   sudo ln -s /etc/nginx/sites-available/paypass /etc/nginx/sites-enabled/
   
   # اختبار التكوين
   sudo nginx -t
   
   # إعادة تشغيل Nginx
   sudo systemctl restart nginx
   ```

3. **الملفات المطلوبة:**
   - `nginx.conf` - لتكوين الخادم

### 🪟 **IIS (Windows Server)**

1. **إعداد IIS:**
   - تثبيت IIS على Windows Server
   - إنشاء موقع جديد
   - رفع محتويات مجلد `dist`

2. **الملفات المطلوبة:**
   - `web.config` - للتوجيه والإعدادات

## الميزات المشتركة في جميع الملفات

### 🔒 **أمان**
- منع Clickjacking (`X-Frame-Options`)
- حماية من XSS (`X-XSS-Protection`)
- منع MIME sniffing (`X-Content-Type-Options`)
- سياسة المراجع (`Referrer-Policy`)
- سياسة الأذونات (`Permissions-Policy`)

### ⚡ **الأداء**
- ضغط الملفات (Gzip)
- تخزين مؤقت للملفات الثابتة
- تحسين تحميل الصور

### 🔄 **التوجيه**
- توجيه جميع الطلبات إلى `index.html` للـ SPA
- توجيه طلبات API إلى الخادم الخلفي
- معالجة صفحات الخطأ

## متغيرات البيئة

### **الإنتاج:**
```env
VITE_API_BASE_URL=https://carwash-backend-production.up.railway.app/api
NODE_ENV=production
```

### **التطوير:**
```env
VITE_API_BASE_URL=http://localhost:5000/api
NODE_ENV=development
```

## خطوات النشر العامة

### 1. **بناء المشروع:**
```bash
npm install
npm run build
```

### 2. **اختبار البناء محلياً:**
```bash
npm run preview
```

### 3. **رفع الملفات:**
- ارفع محتويات مجلد `dist`
- ارفع ملف التكوين المناسب للمنصة

### 4. **إعداد النطاق:**
- إضافة النطاق في لوحة التحكم
- تكوين DNS إذا لزم الأمر

## استكشاف الأخطاء

### **مشكلة: الصفحات لا تعمل عند التحديث**
**الحل:** تأكد من وجود ملف التوجيه الصحيح للمنصة المستخدمة

### **مشكلة: API لا يعمل**
**الحل:** تحقق من إعدادات التوجيه للـ API في ملف التكوين

### **مشكلة: الصور لا تظهر**
**الحل:** تأكد من أن الصور موجودة في مجلد `dist/assets`

### **مشكلة: بطء التحميل**
**الحل:** تحقق من إعدادات الضغط والتخزين المؤقت

## نصائح مهمة

1. **اختبار محلي:** دائماً اختبر البناء محلياً قبل النشر
2. **النسخ الاحتياطية:** احتفظ بنسخة احتياطية من ملفات التكوين
3. **التحديثات:** راجع ملفات التكوين عند تحديث المشروع
4. **الأمان:** تأكد من تفعيل HTTPS في الإنتاج
5. **الأداء:** راقب أداء الموقع بعد النشر

## روابط مفيدة

- [Netlify Documentation](https://docs.netlify.com/)
- [Vercel Documentation](https://vercel.com/docs)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Apache Documentation](https://httpd.apache.org/docs/)
