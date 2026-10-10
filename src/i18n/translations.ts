export type Language = 'ar' | 'en';

export const detectInitialLanguage = (): Language => {
  try {
    const saved = localStorage.getItem('hotlink_lang');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // Ignore localStorage errors
  }
  const browserLang = navigator.language || (navigator as any).userLanguage || '';
  return browserLang.toLowerCase().startsWith('ar') ? 'ar' : 'en';
};

export const translations = {
  ar: {
    brand: 'أداة فحص بسيطة • لا تحفظ الصور',
    title: 'هل صورك محمية من الربط المباشر (Hotlinking)؟',
    description: 'اختبر رابط صورة موجودة على موقعك، واعرف هل يمكن تضمينها وعرضها من مواقع خارجية وسرقة استهلاك الباندويث الخاص بك.',
    switchLang: 'English',
    repoLink: 'المستودع الرئيسي على GitHub',
    
    // Panel 1: Main Test
    pillBasic: 'الاختبار الأساسي',
    urlLabel: 'رابط الصورة المباشر',
    urlPlaceholder: 'https://example.com/images/photo.jpg',
    testBtn: 'اختبر الرابط',
    testingBtn: 'جارٍ الاختبار…',
    clearBtn: 'مسح',
    presetsLabel: 'نماذج سريعة:',
    presets: {
      wikimedia: 'ويكيميديا (مفتوح)',
      placehold: 'صورة تجريبية (مباشر)',
    },
    advancedOptions: 'خيارات متقدمة',
    referrerPolicyLabel: 'سياسة ترويسة الإحالة (Referrer-Policy):',
    policyStrict: 'strict-origin-when-cross-origin (الافتراضي)',
    policyNoReferer: 'no-referrer (بدون ترويسة إحالة)',
    policyOrigin: 'origin (اسم النطاق فقط)',
    policyUnsafeUrl: 'unsafe-url (الرابط كاملاً)',
    bypassCacheLabel: 'تجاوز التخزين المؤقت (Cache-Busting):',
    noteUrl: 'استخدم رابط الصورة المباشر نفسه، وليس رابط صفحة المقال أو المعرض.',
    previewAlt: 'معاينة الصورة المختبرة',
    
    // Validation & Errors
    errEmptyUrl: 'الرجاء إدخال رابط الصورة أولاً.',
    errInvalidProtocol: 'البروتوكول غير مدعوم. يجب أن يبدأ الرابط بـ https:// أو http://',
    errInvalidUrlFormat: 'صيغة الرابط غير صحيحة. تأكد من كتابة عنوان URL كامل.',
    errInvalidImageFile: 'الرجاء اختيار ملف صورة صالح (JPEG, PNG, WebP, SVG, GIF, AVIF).',
    
    // Results
    resultGoodTitle: 'نجح تحميل الصورة (غير محمية من الربط)',
    resultGoodDetail: 'ظهرت الصورة داخل صفحة الاختبار بنجاح؛ الخادم لم يمنع هذا الطلب وسمح للنطاق الخارجي بعرضها. هذا يعني أن المواقع الأخرى يمكنها تضمين صورتك واستهلاك سعة الباندويث الخاصة بك.',
    resultBadTitle: 'تعذر تحميل الصورة (محمية من الربط المباشر)',
    resultBadDetail: 'فشل المتصفح في جلب الصورة عند طلبها من نطاق خارجي. في معظم الحالات، يعود هذا إلى تفعيل حماية منع الربط المباشر (Hotlink Protection) في خادمك برمز HTTP 403 Forbidden.',
    resultInconclusiveTitle: 'النتيجة غير حاسمة (انتهت المهلة)',
    resultInconclusiveDetail: 'لم نحصل على استجابة كاملة للصورة في الوقت المتوقع. قد يكون الخادم بطيئاً أو يرفض الطلبات الخارجية بصمت.',
    resultErrorTitle: 'رابط غير صالح',
    resultErrorDetail: 'يجب أن يبدأ الرابط بـ https:// أو http:// وأن يكون رابطاً مباشراً لملف الصورة.',
    
    metricsLatency: 'زمن الاستجابة:',
    metricsDimensions: 'الأبعاد:',
    copyReport: 'نسخ التقرير',
    copiedReport: 'تم النسخ!',
    testWithoutReferer: 'اختبار مقارنة: أعد الفحص بدون ترويسة إحالة (no-referrer)',
    
    // Panel 2: Local File
    pillLocal: 'معاينة محلية فقط',
    fileLabel: 'أو اختر صورة من جهازك',
    fileNote: 'عرض الصورة من جهازك يتم محلياً فقط في متصفحك؛ لا يختبر حماية الربط المباشر لأنها غير مستضافة على خادم الويب الخاص بموقعك.',
    fileSize: 'الحجم:',
    fileDimensions: 'الأبعاد:',
    fileRatio: 'النسبة:',
    fileMime: 'الصيغة:',
    localPreviewAlt: 'معاينة الصورة من جهازك',
    
    // Panel 3: How to read
    howToReadTitle: 'كيف تقرأ النتيجة؟',
    howToRead1: 'إذا ظهرت الصورة، فهذا يعني أن الطلب من صفحة الاختبار نجح، وبالتالي لم يمنعه الخادم في هذا الاختبار. إذا فشل، فقد يكون السبب حماية Hotlinking أو رابطاً غير صحيح أو قيوداً أخرى.',
    howToRead2: 'لنتيجة موثوقة، استضف هذه الصفحة على نطاق مختلف عن نطاق الصور. الاختبار من ملف محلي أو من نفس نطاق الصور قد لا يرسل ترويسة إحالة مناسبة. كما أن نجاح الاختبار لا يثبت أن كل المواقع تستطيع استخدام الصورة.',
    howToVerifyTitle: 'كيف تتأكد 100% أن الحماية تعمل؟',
    howToVerifyText: 'إذا فشل عرض الصورة هنا في صفحة الاختبار، افتح رابطها مباشرة في شريط العناوين بنافذة تصفح خاصة. إذا فُتحت الصورة مباشرة وفشلت في صفحة الاختبار، فهذا تأكيد قاطع على أن خادمك يحظر الربط الخارجي بنجاح!',
    
    // Copy Report Format
    reportHeader: '=== تقرير فحص حماية الربط المباشر (Hotlink Guard) ===',
    reportUrl: 'الرابط المختبر:',
    reportStatus: 'الحالة:',
    reportStatusAllowed: 'غير محمية (مسموح بالربط المباشر)',
    reportStatusBlocked: 'محمية (تم منع التحميل الخارجي)',
    reportStatusError: 'خطأ في الرابط',
    reportStatusInconclusive: 'غير حاسمة',
    reportLatency: 'زمن الاستجابة:',
    reportDimensions: 'أبعاد الصورة:',
    reportPolicy: 'سياسة الترويسة:',
    reportDetail: 'التفاصيل:',
    
    // Footer
    footerNote: 'تتم معاينة الصورة داخل متصفحك. لا يوجد أي رفع أو تخزين للصور في هذه الأداة • مرخص بموجب رخصة MIT مفتوحة المصدر (2026)',
  },
  en: {
    brand: 'Simple test tool • Does not store images',
    title: 'Are your images protected from Hotlinking?',
    description: 'Test an image link from your website to see whether it can be loaded and embedded from an external domain, preventing bandwidth theft.',
    switchLang: 'العربية',
    repoLink: 'Main GitHub Repository',
    
    // Panel 1: Main Test
    pillBasic: 'Basic Test',
    urlLabel: 'Direct image link',
    urlPlaceholder: 'https://example.com/images/photo.jpg',
    testBtn: 'Test link',
    testingBtn: 'Testing…',
    clearBtn: 'Clear',
    presetsLabel: 'Quick presets:',
    presets: {
      wikimedia: 'Wikimedia (Open)',
      placehold: 'Sample Image (Direct)',
    },
    advancedOptions: 'Advanced options',
    referrerPolicyLabel: 'Referrer-Policy header:',
    policyStrict: 'strict-origin-when-cross-origin (Default)',
    policyNoReferer: 'no-referrer (No Referer)',
    policyOrigin: 'origin (Origin domain only)',
    policyUnsafeUrl: 'unsafe-url (Full URL)',
    bypassCacheLabel: 'Cache-Busting:',
    noteUrl: 'Use the direct image URL itself, not the article or gallery page URL.',
    previewAlt: 'Tested image preview',
    
    // Validation & Errors
    errEmptyUrl: 'Please enter an image URL first.',
    errInvalidProtocol: 'Unsupported protocol. URL must start with https:// or http://',
    errInvalidUrlFormat: 'Invalid URL format. Please make sure to enter a complete URL.',
    errInvalidImageFile: 'Please choose a valid image file (JPEG, PNG, WebP, SVG, GIF, AVIF).',
    
    // Results
    resultGoodTitle: 'Image loaded successfully (Unprotected from hotlinking)',
    resultGoodDetail: 'The image appeared on the test page successfully; your server did not block this external cross-origin request. This means external websites can embed your images and consume your bandwidth.',
    resultBadTitle: 'Unable to load image (Protected from hotlinking)',
    resultBadDetail: 'The browser could not load the image when requested from an external origin. In most cases, this indicates active Hotlink Protection on your server (HTTP 403 Forbidden).',
    resultInconclusiveTitle: 'Inconclusive result (Timeout)',
    resultInconclusiveDetail: 'Did not receive a displayable image within the expected time limit. The server might be slow or silently dropping requests.',
    resultErrorTitle: 'Invalid URL',
    resultErrorDetail: 'The URL must start with http:// or https:// and point to a valid image resource.',
    
    metricsLatency: 'Latency:',
    metricsDimensions: 'Dimensions:',
    copyReport: 'Copy report',
    copiedReport: 'Copied!',
    testWithoutReferer: 'Compare: Re-test without Referer header (no-referrer)',
    
    // Panel 2: Local File
    pillLocal: 'Local preview only',
    fileLabel: 'Or choose an image from your device',
    fileNote: 'Selecting an image from your device previews it locally in your browser only; it does not test Hotlink protection because it is not hosted on your web server.',
    fileSize: 'Size:',
    fileDimensions: 'Dimensions:',
    fileRatio: 'Ratio:',
    fileMime: 'MIME:',
    localPreviewAlt: 'Local image preview',
    
    // Panel 3: How to read
    howToReadTitle: 'How to interpret the result?',
    howToRead1: 'If the image appears, the request from the test page succeeded, meaning the server did not block it in this test. If it fails, the cause may be hotlink protection, an invalid link, or other restrictions.',
    howToRead2: 'For a reliable result, host this page on a domain different from the image domain. Testing from a local file or from the same domain may not send an appropriate Referer. A successful test does not guarantee every site can use the image.',
    howToVerifyTitle: 'How to 100% verify protection works?',
    howToVerifyText: 'If the image fails to load on this test page, open its direct link in a new private browser tab. If it opens directly but fails on this test page, that is conclusive proof that your server successfully blocks hotlinking!',
    
    // Copy Report Format
    reportHeader: '=== Hotlink Guard Test Report ===',
    reportUrl: 'Tested URL:',
    reportStatus: 'Status:',
    reportStatusAllowed: 'Unprotected (Hotlinking allowed)',
    reportStatusBlocked: 'Protected (Cross-origin embedding blocked)',
    reportStatusError: 'Invalid URL error',
    reportStatusInconclusive: 'Inconclusive',
    reportLatency: 'Latency:',
    reportDimensions: 'Dimensions:',
    reportPolicy: 'Referrer Policy:',
    reportDetail: 'Detail:',
    
    // Footer
    footerNote: 'Images are previewed locally inside your browser. No image uploads or storage • Licensed under the open-source MIT License (2026)',
  },
};
