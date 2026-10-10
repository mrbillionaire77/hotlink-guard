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
    
    // Standard Results (With Referer)
    resultGoodTitle: 'نجح تحميل الصورة (غير محمية من الربط)',
    resultGoodDetail: 'ظهرت الصورة بنجاح مع إرسال ترويسة إحالة تدل على نطاق خارجي. هذا يعني أن خادمك يسمح للمواقع الخارجية بتضمين صورك واستهلاك سعة الباندويث الخاصة بك دون حماية.',
    resultBadTitle: 'تم حظر الصورة (محمية من الربط الخارجي)',
    resultBadDetail: 'فشل المتصفح في جلب الصورة عند إرسال ترويسة إحالة تشير لنطاق خارجي. هذا يدل على أن خادمك يمنع بنجاح الربط الخارجي برمز HTTP 403 Forbidden.',
    
    // No-Referer Results (Direct access test)
    resultNoRefererGoodTitle: 'نجح الاختبار بدون ترويسة إحالة (دليل على فعالية الحماية!)',
    resultNoRefererGoodDetail: 'تم تحميل وعرض الصورة بنجاح عند حجب ترويسة الإحالة (no-referrer). إذا كانت الصورة قد حُظرت في الاختبار العادي ونجحت هنا، فهذا إثبات قاطع 100% أن حماية Hotlink على خادمك فعالة ومضبوطة بشكل سليم (تحظر المواقع الخارجية وتسمح بالزيارات المباشرة).',
    resultNoRefererBadTitle: 'تعذر تحميل الصورة حتى بدون ترويسة إحالة',
    resultNoRefererBadDetail: 'فشل تحميل الصورة حتى بعد إلغاء ترويسة الإحالة تماماً (no-referrer). هذا يعني أن المشكلة ليست حظر Hotlink عادي، بل إما أن الرابط غير صحيح، أو الصورة محذوفة (404)، أو أن خادمك يحظر حتى الزيارات المباشرة الخالية من الإحالة (Blank Referers).',

    resultInconclusiveTitle: 'النتيجة غير حاسمة (انتهت المهلة)',
    resultInconclusiveDetail: 'لم نحصل على استجابة كاملة للصورة في الوقت المتوقع. قد يكون الخادم بطيئاً أو يرفض الطلبات الخارجية بصمت.',
    resultErrorTitle: 'رابط غير صالح',
    resultErrorDetail: 'يجب أن يبدأ الرابط بـ https:// أو http:// وأن يكون رابطاً مباشراً لملف الصورة.',
    
    metricsLatency: 'زمن الاستجابة:',
    metricsDimensions: 'الأبعاد:',
    copyReport: 'نسخ التقرير',
    copiedReport: 'تم النسخ!',
    testWithoutReferer: 'اختبار مقارنة: أعد الفحص بدون ترويسة إحالة (no-referrer)',
    testWithReferer: 'اختبار مقارنة: أعد الفحص مع إرسال ترويسة إحالة عادية (مع Referer)',
    
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
    howToRead1: 'إذا ظهرت الصورة مع إرسال Referer، فهذا يعني أن الخادم يسمح لأي موقع خارجي بتضمينها. وإذا فُشلت مع Referer ونجحت بدونه (no-referrer)، فهذا يثبت تفعيل حماية Hotlink بنجاح.',
    howToRead2: 'لنتيجة موثوقة، استضف هذه الصفحة على نطاق مختلف عن نطاق الصور لضمان إرسال Referer خارجي.',
    howToVerifyTitle: 'كيف تتأكد 100% أن الحماية تعمل؟',
    howToVerifyText: 'إذا فشل عرض الصورة هنا في صفحة الاختبار، افتح رابطها مباشرة في شريط العناوين بنافذة تصفح خاصة. إذا فُتحت الصورة مباشرة وفشلت في صفحة الاختبار، فهذا تأكيد قاطع على أن خادمك يحظر الربط الخارجي بنجاح!',
    
    // Copy Report Format
    reportHeader: '=== تقرير فحص حماية الربط المباشر (Hotlink Guard) ===',
    reportUrl: 'الرابط المختبر:',
    reportStatus: 'الحالة:',
    reportStatusAllowed: 'مسموح بالتحميل',
    reportStatusBlocked: 'تم الحظر (محمية)',
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
    
    // Standard Results (With Referer)
    resultGoodTitle: 'Image loaded successfully (Unprotected from hotlinking)',
    resultGoodDetail: 'The image appeared on the test page successfully while sending an external cross-origin Referer. This means your server allows external websites to embed your images and consume your bandwidth.',
    resultBadTitle: 'Image blocked (Protected from cross-origin hotlinking)',
    resultBadDetail: 'The browser failed to fetch the image when sending a cross-origin Referer header. This indicates that your server successfully prevents hotlinking with HTTP 403 Forbidden.',
    
    // No-Referer Results (Direct access test)
    resultNoRefererGoodTitle: 'Loaded without Referer (Proof of active protection!)',
    resultNoRefererGoodDetail: 'The image was retrieved and displayed successfully when stripping the Referer header (no-referrer). If this image was blocked in the standard test with a Referer but succeeded here, this is 100% conclusive proof that your server\'s Hotlink Protection is active and correctly configured (blocking external sites while permitting direct visits)!',
    resultNoRefererBadTitle: 'Unable to load image even without Referer',
    resultNoRefererBadDetail: 'Failed to load the image even with the Referer header completely omitted (no-referrer). This means the issue is not standard hotlink protection; the URL may be invalid, the image missing (404), or your server blocks even blank referer requests.',

    resultInconclusiveTitle: 'Inconclusive result (Timeout)',
    resultInconclusiveDetail: 'Did not receive a displayable image within the expected time limit. The server might be slow or silently dropping requests.',
    resultErrorTitle: 'Invalid URL',
    resultErrorDetail: 'The URL must start with http:// or https:// and point to a valid image resource.',
    
    metricsLatency: 'Latency:',
    metricsDimensions: 'Dimensions:',
    copyReport: 'Copy report',
    copiedReport: 'Copied!',
    testWithoutReferer: 'Compare: Re-test without Referer header (no-referrer)',
    testWithReferer: 'Compare: Re-test with standard Referer header (with Referer)',
    
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
    howToRead1: 'If the image appears with a Referer sent, it means the server permits external embedding. If it is blocked with a Referer but succeeds without one (no-referrer), that proves hotlink protection is active.',
    howToRead2: 'For a reliable result, host this page on a domain different from the image domain so an external Referer is sent.',
    howToVerifyTitle: 'How to 100% verify protection works?',
    howToVerifyText: 'If the image fails to load on this test page, open its direct link in a new private browser tab. If it opens directly but fails on this test page, that is conclusive proof that your server successfully blocks hotlinking!',
    
    // Copy Report Format
    reportHeader: '=== Hotlink Guard Test Report ===',
    reportUrl: 'Tested URL:',
    reportStatus: 'Status:',
    reportStatusAllowed: 'Allowed',
    reportStatusBlocked: 'Blocked (Protected)',
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
