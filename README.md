# فاحص حماية الصور من Hotlinking | Image Hotlink Guard

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178c6.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6+-646cff.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8.svg)](https://tailwindcss.com/)

أداة ويب حديثة وعالية الأداء لفحص واختبار حماية الصور من الربط الخارجي المباشر (**Hotlinking**) وسرقة الباندويث، مصممة بواجهة نظيفة وسريعة وتعمل بالكامل داخل المتصفح.

---

## 🌟 المميزات الرئيسية (Key Features)

- ⚡ **فحص سريع فوري (Sub-200ms latency)**: يقوم بمحاكاة طلب الصورة من نطاق خارجي مع ترويسة `Referer` لاختبار استجابة الخادم فورياً.
- 🛡️ **فحص سياسات الترويسة (Referrer-Policy)**: إمكانية فحص الصور تحت سياسات متعددة (`strict-origin-when-cross-origin`، `no-referrer`، `origin`).
- 🔄 **تجاوز الذاكرة المؤقتة (Cache Busting)**: إضافة وسوم فريدة للرابط لمنع قراءة النسخة المخبأة في المتصفح.
- 📁 **معاينة الصور المحلية (Local Inspector)**: فحص الأبعاد، حجم الملف، ونسبة العرض للارتفاع محلياً في متصفحك مع تفريغ وإدارة تلقائية للذاكرة (`URL.revokeObjectURL`) لمنع تسرب الذاكرة (Memory Leaks).
- 🔒 **خصوصية 100%**: لا يتم إرسال أو حفظ أي صور أو روابط على خوادم وسيطة، الفحص يتم مباشرة داخل متصفح المستخدم.
- 🌐 **دعم كامل للغتين (العربية والإنجليزية)**: كشف تلقائي عن لغة الجهاز وتبديل سريع بين اللغتين واتجاهي RTL / LTR.

---

## 🚀 طريقة التثبيت والتشغيل المحلي (Getting Started)

### المتطلبات المسبقة:
- [Node.js](https://nodejs.org/) الإصدار 18 أو أحدث.
- npm أو pnpm أو yarn.

### خطوات التثبيت:

```bash
# 1. استنساخ المستودع (Clone the repository)
git clone https://github.com/mrbillionaire77/hotlink-guard.git

# 2. الدخول إلى مجلد المشروع
cd hotlink-guard

# 3. تثبيت الحزم والمكتبات
npm install

# 4. تشغيل خادم التطوير المحلي
npm run dev
```

سيفتح المشروع على العنوان: `http://localhost:3000`

### أوامر المشروع المتاحة (Available Scripts):

| الأمر | الوصف |
| --- | --- |
| `npm run dev` | تشغيل خادم التطوير مع التحديث السريع |
| `npm run build` | بناء نسخة الإنتاج المحسنة في مجلد `dist` |
| `npm run preview` | معاينة نسخة الإنتاج محلياً |
| `npm run lint` | التحقق من صحة كود TypeScript وأنواعه |

---

## 📂 هيكلية المشروع (Project Architecture)

```text
├── LICENSE                 # رخصة MIT الرسمية
├── README.md               # التوثيق والتعليمات
├── index.html              # الصفحة الرئيسية وبيانات الميتا
├── metadata.json           # إعدادات التطبيق
├── package.json            # الحزم والاعتماديات
├── src/
│   ├── App.tsx             # التطبيق الرئيسي المتكامل
│   ├── i18n/
│   │   └── translations.ts # قاموس الترجمة ونظام التعرف التلقائي على اللغة
│   ├── types/
│   │   └── index.ts        # تعريفات الأنواع (TypeScript Types)
│   ├── utils/
│   │   └── hotlinkTester.ts# محرك الفحص والأداء وإدارة الترويسات
│   ├── index.css           # تنسيقات التصميم المخصص وTailwind CSS
│   └── main.tsx            # نقطة انطلاق React
└── vite.config.ts          # إعدادات Vite ومترجم Tailwind
```

---

## ⚖️ إخلاء المسؤولية القانونية (Legal Disclaimer)

- **الغرض من الأداة**: تم تطوير هذا المشروع كأداة تشخيصية وتعليمية لمساعدة مديري المواقع والمطورين على اختبار سياسات حماية خوادمهم ضد الربط الخارجي المباشر (Hotlinking) وترشيد استهلاك سعة الباندويث.
- **التنفيذ من جانب العميل فقط (Client-Side Only)**: تعمل الأداة بالكامل داخل متصفح المستخدم النهائي. لا يقوم المشروع بتشغيل أي خوادم وسيطة (Proxies)، ولا يقوم بنسخ أو حفظ أو فهرسة أو إعادة توزيع أي صور أو محتويات مملوكة لأطراف ثالثة.
- **مسؤولية الاستخدام**: يتحمل المستخدم المسؤولية الكاملة عن الروابط التي يقوم باختبارها.
- **إخلاء الضمانات**: وفقاً لنصوص رخصة MIT، يُقدم هذا البرنامج "كما هو" (AS IS) دون أي ضمانات صريحة أو ضمنية من أي نوع، ولا يتحمل المطورون أو المساهمون أي مسؤولية قانونية عن أي استخدام ناتج عن هذه البرمجية.

---

## 📜 الترخيص (License)

هذا المشروع مرخص بموجب **رخصة MIT (MIT License)** - راجع ملف [LICENSE](LICENSE) للتفاصيل الكاملة.

حقوق النشر (c) 2026 مساهمو مشروع Hotlink Guard (Hotlink Guard Project Contributors). جميع الحقوق محفوظة للمستودع الرئيسي.
