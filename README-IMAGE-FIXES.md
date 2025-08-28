# حل مشاكل الصور وأسماء الملفات

## المشاكل التي تم حلها

### 1. مشكلة المسارات الثابتة
**المشكلة:** كان الكود يستخدم مسارات ثابتة مثل `/src/assets/` بدلاً من استيراد الصور بشكل صحيح.

**الحل:** تم استبدال جميع المسارات الثابتة باستيرادات صحيحة للصور.

### 2. مشكلة أسماء الملفات
**المشكلة:** كانت أسماء الملفات في مجلد `dist/assets` تحتوي على hashes (مثل `alahli-DE8rnl4g.jpeg`) مما يسبب مشاكل في التحميل.

**الحل:** تم استخدام استيرادات مباشرة للصور من مجلد `src/assets` مما يضمن أن Vite يتعامل معها بشكل صحيح.

## الملفات التي تم إصلاحها

### الصفحات الرئيسية:
- `src/pages/BranchSelection.jsx` - صور الفروع
- `src/pages/VIPBranchSelection.jsx` - صور الفنادق VIP
- `src/components/footer/Footer.jsx` - صور التذييل

### مكونات الدفع:
- `src/components/Payment.jsx` - صور طرق الدفع
- `src/components/PaymentMethods.jsx` - صور البطاقات

### صفحات أخرى:
- `src/pages/TipSystem.jsx` - صور طرق الدفع
- `src/pages/WashingCompleted.jsx` - صور Apple Pay

## كيفية الاستيراد الصحيح

### قبل الإصلاح (خطأ):
```jsx
<img src="/src/assets/helton.png" alt="Helton" />
```

### بعد الإصلاح (صحيح):
```jsx
import heltonImage from '../assets/helton.png';

<img src={heltonImage} alt="Helton" />
```

## الصور المتوفرة في مجلد الأصول

### صور الفروع:
- `helton.png` - مغسلة هيلتون
- `karlton.png` - مغسلة كارلتون
- `regis.png` - مغسلة ريجس
- `alahli.jpeg` - مغسلة الأهلي
- `alnma.jpeg` - مغسلة النعمة
- `cod.jpeg` - مغسلة COD

### صور الفنادق VIP:
- `كارلتون.jpeg` - فندق كارلتون
- `ريتز.jpeg` - فندق ريتز
- `هيلتون.jpeg` - فندق هيلتون

### صور طرق الدفع:
- `apple-pay.png` - Apple Pay
- `Visa.png` - Visa
- `mastercard.png` - Mastercard
- `Mada.png` - مدى

### صور أخرى:
- `logo.png` - شعار PayPass
- `sbc.webp` - شعار المركز السعودي للأعمال
- `app-store-badge.png` - شارة App Store
- `google-play-badge.png` - شارة Google Play

## نصائح لتجنب المشاكل مستقبلاً

1. **استخدم الاستيرادات المباشرة:** دائماً استورد الصور في بداية الملف
2. **تجنب المسارات الثابتة:** لا تستخدم `/src/assets/` أو `/public/assets/`
3. **تحقق من وجود الملفات:** تأكد من أن الصور موجودة في مجلد `src/assets`
4. **استخدم أسماء واضحة:** استخدم أسماء ملفات واضحة ومفهومة

## كيفية البناء والتشغيل

### للتطوير:
```bash
npm run dev
```

### للبناء:
```bash
npm run build
```

### لمعاينة البناء:
```bash
npm run preview
```

## ملاحظات مهمة

- Vite يتعامل مع الصور تلقائياً ويضيف hashes لها في البناء
- الاستيرادات المباشرة تضمن أن الصور تُحمل بشكل صحيح
- لا حاجة لتغيير أسماء الملفات في مجلد `dist/assets`
- جميع الصور يجب أن تكون في مجلد `src/assets`
