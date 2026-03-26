export interface AppFeature {
  titleKey: string
  descKey: string
  icon: string
}

export interface AppStep {
  titleKey: string
  descKey: string
}

export interface AppLandingPage {
  slug: string
  name: string
  iconId: string
  iconColor: string
  category: "marketing" | "analytics" | "communication" | "productivity"
  metaTitle: { en: string; ar: string; fr: string }
  metaDescription: { en: string; ar: string; fr: string }
  keywords: string[]
  heroDescKey: string
  features: AppFeature[]
  steps: AppStep[]
  faqs: Array<{
    question: { en: string; ar: string; fr: string }
    answer: { en: string; ar: string; fr: string }
  }>
}

export const APP_PAGES: AppLandingPage[] = [
  {
    slug: "whatsapp",
    name: "WhatsApp",
    iconId: "whatsapp",
    iconColor: "#25D366",
    category: "communication",
    metaTitle: {
      en: "WhatsApp Integration for E-commerce Stores",
      ar: "تكامل واتساب للمتاجر الإلكترونية",
      fr: "Intégration WhatsApp pour boutiques en ligne",
    },
    metaDescription: {
      en: "Send order confirmations, delivery updates, and abandoned cart recovery messages via WhatsApp. Built into Leadivo with AI-powered messaging.",
      ar: "أرسل تأكيدات الطلبات وتحديثات التوصيل ورسائل استرداد السلات عبر واتساب. مدمج في Leadivo مع رسائل ذكية بالذكاء الاصطناعي.",
      fr: "Envoyez des confirmations de commandes, mises à jour de livraison et messages de récupération de paniers via WhatsApp. Intégré à Leadivo.",
    },
    keywords: [
      "whatsapp ecommerce integration",
      "whatsapp order notifications",
      "whatsapp abandoned cart recovery",
      "واتساب متجر الكتروني",
      "اشعارات واتساب للطلبات",
      "whatsapp business ecommerce",
    ],
    heroDescKey: "apps.whatsapp.heroDesc",
    features: [
      { titleKey: "apps.whatsapp.feature.orderNotify.title", descKey: "apps.whatsapp.feature.orderNotify.desc", icon: "Bell" },
      { titleKey: "apps.whatsapp.feature.cartRecovery.title", descKey: "apps.whatsapp.feature.cartRecovery.desc", icon: "ShoppingCart" },
      { titleKey: "apps.whatsapp.feature.aiMessages.title", descKey: "apps.whatsapp.feature.aiMessages.desc", icon: "Sparkles" },
      { titleKey: "apps.whatsapp.feature.statusUpdates.title", descKey: "apps.whatsapp.feature.statusUpdates.desc", icon: "Truck" },
      { titleKey: "apps.whatsapp.feature.reviewLinks.title", descKey: "apps.whatsapp.feature.reviewLinks.desc", icon: "Star" },
      { titleKey: "apps.whatsapp.feature.multiLang.title", descKey: "apps.whatsapp.feature.multiLang.desc", icon: "Globe" },
    ],
    steps: [
      { titleKey: "apps.whatsapp.step.connect.title", descKey: "apps.whatsapp.step.connect.desc" },
      { titleKey: "apps.whatsapp.step.configure.title", descKey: "apps.whatsapp.step.configure.desc" },
      { titleKey: "apps.whatsapp.step.automate.title", descKey: "apps.whatsapp.step.automate.desc" },
    ],
    faqs: [
      {
        question: {
          en: "How does WhatsApp integration work with Leadivo?",
          ar: "كيف يعمل تكامل واتساب مع Leadivo؟",
          fr: "Comment fonctionne l'intégration WhatsApp avec Leadivo ?",
        },
        answer: {
          en: "Connect your WhatsApp Business account in one click. Leadivo automatically sends order confirmations, status updates, and abandoned cart recovery messages to your customers via WhatsApp.",
          ar: "اربط حساب واتساب بزنس بنقرة واحدة. Leadivo يرسل تلقائياً تأكيدات الطلبات وتحديثات الحالة ورسائل استرداد السلات لعملائك عبر واتساب.",
          fr: "Connectez votre compte WhatsApp Business en un clic. Leadivo envoie automatiquement des confirmations, mises à jour et messages de récupération à vos clients via WhatsApp.",
        },
      },
      {
        question: {
          en: "Can I customize WhatsApp messages?",
          ar: "هل يمكنني تخصيص رسائل واتساب؟",
          fr: "Puis-je personnaliser les messages WhatsApp ?",
        },
        answer: {
          en: "Leadivo uses AI to generate contextual messages based on your order data, store language, and customer info. Messages are personalized automatically for each order.",
          ar: "يستخدم Leadivo الذكاء الاصطناعي لإنشاء رسائل سياقية بناءً على بيانات طلبك ولغة المتجر ومعلومات العميل. الرسائل مخصصة تلقائياً لكل طلب.",
          fr: "Leadivo utilise l'IA pour générer des messages contextuels basés sur vos données de commande, la langue du magasin et les infos client. Les messages sont personnalisés automatiquement.",
        },
      },
    ],
  },
  {
    slug: "facebook-pixel",
    name: "Facebook Pixel & Meta CAPI",
    iconId: "meta",
    iconColor: "#0081FB",
    category: "marketing",
    metaTitle: {
      en: "Facebook Pixel for COD Stores — Meta CAPI",
      ar: "فيسبوك بيكسل للمتاجر — Meta CAPI",
      fr: "Facebook Pixel pour boutiques COD — Meta CAPI",
    },
    metaDescription: {
      en: "Track conversions and retarget customers with Facebook Pixel and Meta Conversions API. Built into Leadivo with server-side tracking for accurate COD attribution.",
      ar: "تتبع التحويلات وأعد استهداف العملاء مع فيسبوك بيكسل وMeta CAPI. مدمج في Leadivo مع تتبع من جانب السيرفر لإسناد دقيق لطلبات COD.",
      fr: "Suivez les conversions et reciblez vos clients avec Facebook Pixel et Meta CAPI. Intégré à Leadivo avec suivi serveur pour une attribution COD précise.",
    },
    keywords: [
      "facebook pixel ecommerce",
      "meta conversions api",
      "facebook pixel cod store",
      "meta capi setup",
      "فيسبوك بيكسل متجر",
      "تتبع التحويلات فيسبوك",
      "facebook pixel for online store",
    ],
    heroDescKey: "apps.meta.heroDesc",
    features: [
      { titleKey: "apps.meta.feature.serverSide.title", descKey: "apps.meta.feature.serverSide.desc", icon: "Server" },
      { titleKey: "apps.meta.feature.clientEvents.title", descKey: "apps.meta.feature.clientEvents.desc", icon: "MousePointerClick" },
      { titleKey: "apps.meta.feature.purchase.title", descKey: "apps.meta.feature.purchase.desc", icon: "CreditCard" },
      { titleKey: "apps.meta.feature.testMode.title", descKey: "apps.meta.feature.testMode.desc", icon: "FlaskConical" },
      { titleKey: "apps.meta.feature.retarget.title", descKey: "apps.meta.feature.retarget.desc", icon: "Target" },
      { titleKey: "apps.meta.feature.accurate.title", descKey: "apps.meta.feature.accurate.desc", icon: "BarChart3" },
    ],
    steps: [
      { titleKey: "apps.meta.step.pixel.title", descKey: "apps.meta.step.pixel.desc" },
      { titleKey: "apps.meta.step.token.title", descKey: "apps.meta.step.token.desc" },
      { titleKey: "apps.meta.step.track.title", descKey: "apps.meta.step.track.desc" },
    ],
    faqs: [
      {
        question: {
          en: "What events does Leadivo track with Facebook Pixel?",
          ar: "ما الأحداث التي يتتبعها Leadivo مع فيسبوك بيكسل؟",
          fr: "Quels événements Leadivo suit-il avec Facebook Pixel ?",
        },
        answer: {
          en: "Leadivo tracks ViewContent (product views), AddToCart, InitiateCheckout on the client side, and Purchase events server-side via Meta Conversions API for accurate COD conversion tracking.",
          ar: "يتتبع Leadivo أحداث عرض المنتج وإضافة للسلة وبدء الدفع من جانب العميل، وأحداث الشراء من جانب السيرفر عبر Meta CAPI لتتبع دقيق لتحويلات COD.",
          fr: "Leadivo suit ViewContent, AddToCart, InitiateCheckout côté client, et les événements Purchase côté serveur via Meta CAPI pour un suivi précis des conversions COD.",
        },
      },
      {
        question: {
          en: "Why is server-side tracking important for COD stores?",
          ar: "لماذا التتبع من جانب السيرفر مهم لمتاجر COD؟",
          fr: "Pourquoi le suivi serveur est-il important pour les boutiques COD ?",
        },
        answer: {
          en: "Browser-based tracking misses conversions due to ad blockers and cookie restrictions. Server-side Meta CAPI sends purchase data directly from Leadivo's servers, ensuring accurate conversion attribution for your Facebook ads.",
          ar: "التتبع عبر المتصفح يفقد التحويلات بسبب حاجبات الإعلانات وقيود الكوكيز. Meta CAPI من جانب السيرفر يرسل بيانات الشراء مباشرة من سيرفرات Leadivo لضمان إسناد دقيق لإعلانات فيسبوك.",
          fr: "Le suivi navigateur perd des conversions à cause des bloqueurs de pub et restrictions de cookies. Meta CAPI côté serveur envoie les données directement depuis les serveurs de Leadivo pour une attribution précise.",
        },
      },
    ],
  },
  {
    slug: "google-sheets",
    name: "Google Sheets",
    iconId: "google-sheets",
    iconColor: "#0F9D58",
    category: "productivity",
    metaTitle: {
      en: "Google Sheets Integration for Order Tracking",
      ar: "تكامل Google Sheets لتتبع الطلبات",
      fr: "Intégration Google Sheets pour suivi des commandes",
    },
    metaDescription: {
      en: "Automatically sync orders to Google Sheets with customizable field mapping. Track orders, manage inventory, and share data with your team in real time.",
      ar: "مزامنة الطلبات تلقائياً مع Google Sheets مع تخصيص حقول البيانات. تتبع الطلبات وأدر المخزون وشارك البيانات مع فريقك.",
      fr: "Synchronisez automatiquement les commandes dans Google Sheets avec un mappage personnalisable. Suivez les commandes et partagez les données en temps réel.",
    },
    keywords: [
      "google sheets ecommerce",
      "google sheets order tracking",
      "order sync google sheets",
      "ecommerce spreadsheet",
      "google sheets متجر",
      "مزامنة الطلبات google sheets",
    ],
    heroDescKey: "apps.sheets.heroDesc",
    features: [
      { titleKey: "apps.sheets.feature.autoSync.title", descKey: "apps.sheets.feature.autoSync.desc", icon: "RefreshCw" },
      { titleKey: "apps.sheets.feature.fieldMap.title", descKey: "apps.sheets.feature.fieldMap.desc", icon: "Settings" },
      { titleKey: "apps.sheets.feature.abandoned.title", descKey: "apps.sheets.feature.abandoned.desc", icon: "ShoppingCart" },
      { titleKey: "apps.sheets.feature.fields.title", descKey: "apps.sheets.feature.fields.desc", icon: "Table" },
      { titleKey: "apps.sheets.feature.grouping.title", descKey: "apps.sheets.feature.grouping.desc", icon: "Rows3" },
      { titleKey: "apps.sheets.feature.manualSync.title", descKey: "apps.sheets.feature.manualSync.desc", icon: "Upload" },
    ],
    steps: [
      { titleKey: "apps.sheets.step.connect.title", descKey: "apps.sheets.step.connect.desc" },
      { titleKey: "apps.sheets.step.select.title", descKey: "apps.sheets.step.select.desc" },
      { titleKey: "apps.sheets.step.map.title", descKey: "apps.sheets.step.map.desc" },
    ],
    faqs: [
      {
        question: {
          en: "What order data can I sync to Google Sheets?",
          ar: "ما بيانات الطلبات التي يمكنني مزامنتها مع Google Sheets؟",
          fr: "Quelles données de commande puis-je synchroniser avec Google Sheets ?",
        },
        answer: {
          en: "Leadivo offers 20+ fields including order number, customer name, phone, email, city, country, items, quantities, prices, variants, subtotal, delivery fee, discount, total, payment method, status, and order date. You choose which fields to include and customize column headers.",
          ar: "يقدم Leadivo أكثر من 20 حقلاً تشمل رقم الطلب واسم العميل والهاتف والبريد والمدينة والبلد والمنتجات والكميات والأسعار والمتغيرات والمجموع ورسوم التوصيل والخصم والإجمالي وطريقة الدفع والحالة والتاريخ.",
          fr: "Leadivo propose plus de 20 champs : numéro de commande, nom client, téléphone, email, ville, pays, articles, quantités, prix, variantes, sous-total, frais de livraison, remise, total, méthode de paiement, statut et date.",
        },
      },
      {
        question: {
          en: "Does Google Sheets sync happen automatically?",
          ar: "هل المزامنة مع Google Sheets تلقائية؟",
          fr: "La synchronisation Google Sheets est-elle automatique ?",
        },
        answer: {
          en: "Yes, new orders are automatically synced to your Google Sheet as they come in. You can also trigger a manual sync anytime from the integration settings to backfill existing orders.",
          ar: "نعم، الطلبات الجديدة تتم مزامنتها تلقائياً مع جدول البيانات فور وصولها. يمكنك أيضاً تشغيل مزامنة يدوية في أي وقت من إعدادات التكامل.",
          fr: "Oui, les nouvelles commandes sont automatiquement synchronisées. Vous pouvez aussi déclencher une synchronisation manuelle à tout moment depuis les paramètres d'intégration.",
        },
      },
    ],
  },
  {
    slug: "tiktok-pixel",
    name: "TikTok Pixel & Events API",
    iconId: "tiktok",
    iconColor: "#000000",
    category: "marketing",
    metaTitle: {
      en: "TikTok Pixel for Online Stores — Events API",
      ar: "تيك توك بيكسل للمتاجر الإلكترونية",
      fr: "TikTok Pixel pour boutiques en ligne — Events API",
    },
    metaDescription: {
      en: "Track TikTok ad conversions with server-side Events API. Optimize your TikTok campaigns with accurate purchase tracking built into Leadivo.",
      ar: "تتبع تحويلات إعلانات تيك توك مع Events API من جانب السيرفر. حسّن حملات تيك توك بتتبع شراء دقيق مدمج في Leadivo.",
      fr: "Suivez les conversions TikTok avec l'Events API côté serveur. Optimisez vos campagnes TikTok avec un suivi d'achat précis intégré à Leadivo.",
    },
    keywords: [
      "tiktok pixel ecommerce",
      "tiktok events api",
      "tiktok pixel setup online store",
      "tiktok conversion tracking",
      "تيك توك بيكسل متجر",
      "تتبع تحويلات تيك توك",
    ],
    heroDescKey: "apps.tiktok.heroDesc",
    features: [
      { titleKey: "apps.tiktok.feature.serverSide.title", descKey: "apps.tiktok.feature.serverSide.desc", icon: "Server" },
      { titleKey: "apps.tiktok.feature.purchase.title", descKey: "apps.tiktok.feature.purchase.desc", icon: "CreditCard" },
      { titleKey: "apps.tiktok.feature.testMode.title", descKey: "apps.tiktok.feature.testMode.desc", icon: "FlaskConical" },
      { titleKey: "apps.tiktok.feature.optimize.title", descKey: "apps.tiktok.feature.optimize.desc", icon: "TrendingUp" },
      { titleKey: "apps.tiktok.feature.hashing.title", descKey: "apps.tiktok.feature.hashing.desc", icon: "Shield" },
      { titleKey: "apps.tiktok.feature.realtime.title", descKey: "apps.tiktok.feature.realtime.desc", icon: "Zap" },
    ],
    steps: [
      { titleKey: "apps.tiktok.step.pixel.title", descKey: "apps.tiktok.step.pixel.desc" },
      { titleKey: "apps.tiktok.step.token.title", descKey: "apps.tiktok.step.token.desc" },
      { titleKey: "apps.tiktok.step.track.title", descKey: "apps.tiktok.step.track.desc" },
    ],
    faqs: [
      {
        question: {
          en: "How does TikTok Pixel work with Leadivo?",
          ar: "كيف يعمل تيك توك بيكسل مع Leadivo؟",
          fr: "Comment fonctionne TikTok Pixel avec Leadivo ?",
        },
        answer: {
          en: "Add your TikTok Pixel ID and access token in Leadivo's integration settings. Leadivo sends purchase events server-side via TikTok Events API, giving you accurate conversion data even with ad blockers.",
          ar: "أضف معرف تيك توك بيكسل ورمز الوصول في إعدادات تكاملات Leadivo. يرسل Leadivo أحداث الشراء من جانب السيرفر عبر TikTok Events API لبيانات تحويل دقيقة.",
          fr: "Ajoutez votre Pixel ID et token d'accès TikTok dans les paramètres d'intégration. Leadivo envoie les événements d'achat côté serveur via TikTok Events API pour des données précises.",
        },
      },
      {
        question: {
          en: "What TikTok events does Leadivo track?",
          ar: "ما أحداث تيك توك التي يتتبعها Leadivo؟",
          fr: "Quels événements TikTok Leadivo suit-il ?",
        },
        answer: {
          en: "Leadivo tracks CompletePayment (purchase) events server-side with full order data including value, currency, and product details. This helps TikTok optimize your ad delivery for actual buyers.",
          ar: "يتتبع Leadivo أحداث إتمام الدفع (الشراء) من جانب السيرفر مع بيانات الطلب الكاملة بما في ذلك القيمة والعملة وتفاصيل المنتج لتحسين توصيل إعلانات تيك توك.",
          fr: "Leadivo suit les événements CompletePayment côté serveur avec toutes les données de commande pour aider TikTok à optimiser la diffusion de vos publicités.",
        },
      },
    ],
  },
  {
    slug: "google-analytics",
    name: "Google Analytics",
    iconId: "google-analytics",
    iconColor: "#E37400",
    category: "analytics",
    metaTitle: {
      en: "Google Analytics for Online Stores — GA4 Setup",
      ar: "Google Analytics للمتاجر الإلكترونية — إعداد GA4",
      fr: "Google Analytics pour boutiques en ligne — GA4",
    },
    metaDescription: {
      en: "Add Google Analytics to your online store with one click. Track visitor behavior, traffic sources, and conversions on your Leadivo storefront.",
      ar: "أضف Google Analytics لمتجرك بنقرة واحدة. تتبع سلوك الزوار ومصادر الحركة والتحويلات على واجهة متجر Leadivo.",
      fr: "Ajoutez Google Analytics à votre boutique en un clic. Suivez le comportement des visiteurs, les sources de trafic et les conversions sur votre vitrine Leadivo.",
    },
    keywords: [
      "google analytics ecommerce",
      "google analytics online store",
      "ga4 ecommerce setup",
      "google analytics متجر",
      "تحليلات جوجل متجر الكتروني",
      "google analytics storefront",
    ],
    heroDescKey: "apps.ga.heroDesc",
    features: [
      { titleKey: "apps.ga.feature.oneClick.title", descKey: "apps.ga.feature.oneClick.desc", icon: "MousePointerClick" },
      { titleKey: "apps.ga.feature.traffic.title", descKey: "apps.ga.feature.traffic.desc", icon: "BarChart3" },
      { titleKey: "apps.ga.feature.behavior.title", descKey: "apps.ga.feature.behavior.desc", icon: "Eye" },
      { titleKey: "apps.ga.feature.sources.title", descKey: "apps.ga.feature.sources.desc", icon: "Globe" },
      { titleKey: "apps.ga.feature.realtime.title", descKey: "apps.ga.feature.realtime.desc", icon: "Zap" },
      { titleKey: "apps.ga.feature.free.title", descKey: "apps.ga.feature.free.desc", icon: "Gift" },
    ],
    steps: [
      { titleKey: "apps.ga.step.id.title", descKey: "apps.ga.step.id.desc" },
      { titleKey: "apps.ga.step.paste.title", descKey: "apps.ga.step.paste.desc" },
      { titleKey: "apps.ga.step.done.title", descKey: "apps.ga.step.done.desc" },
    ],
    faqs: [
      {
        question: {
          en: "How do I add Google Analytics to my Leadivo store?",
          ar: "كيف أضيف Google Analytics لمتجري على Leadivo؟",
          fr: "Comment ajouter Google Analytics à ma boutique Leadivo ?",
        },
        answer: {
          en: "Go to your dashboard integrations, click Google Analytics, paste your GA4 Measurement ID (starts with G-), and save. Leadivo automatically adds the tracking script to your storefront.",
          ar: "اذهب لتكاملات لوحة التحكم، انقر Google Analytics، الصق معرف القياس GA4 (يبدأ بـ G-)، واحفظ. Leadivo يضيف سكريبت التتبع تلقائياً لواجهة متجرك.",
          fr: "Allez dans les intégrations du tableau de bord, cliquez sur Google Analytics, collez votre ID de mesure GA4 (commence par G-), et enregistrez. Leadivo ajoute automatiquement le script de suivi.",
        },
      },
      {
        question: {
          en: "Is Google Analytics free to use with Leadivo?",
          ar: "هل Google Analytics مجاني مع Leadivo؟",
          fr: "Google Analytics est-il gratuit avec Leadivo ?",
        },
        answer: {
          en: "Yes, Google Analytics is free from Google and built into every Leadivo store. Just add your measurement ID — no extra cost or plugins needed.",
          ar: "نعم، Google Analytics مجاني من جوجل ومدمج في كل متجر Leadivo. فقط أضف معرف القياس — بدون تكاليف إضافية أو إضافات.",
          fr: "Oui, Google Analytics est gratuit de Google et intégré à chaque boutique Leadivo. Ajoutez simplement votre ID de mesure — sans coût supplémentaire ni plugins.",
        },
      },
    ],
  },
]

export function getAppPage(slug: string): AppLandingPage | undefined {
  return APP_PAGES.find((a) => a.slug === slug)
}

export function getAllAppSlugs(): string[] {
  return APP_PAGES.map((a) => a.slug)
}
