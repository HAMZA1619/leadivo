export interface CompareFeature {
  key: string
  leadivo: boolean | string
  other: boolean | string
}

export interface CompareHighlight {
  titleKey: string
  descKey: string
  icon: string
}

export interface ComparePlatform {
  slug: string
  name: string
  metaTitle: { en: string; ar: string; fr: string }
  metaDescription: { en: string; ar: string; fr: string }
  keywords: string[]
  /** What this platform is known for — always respectful */
  knownForKey: string
  /** Why Leadivo is a great fit for the user */
  leadivoFitKey: string
  features: CompareFeature[]
  highlights: CompareHighlight[]
  faqs: Array<{
    question: { en: string; ar: string; fr: string }
    answer: { en: string; ar: string; fr: string }
  }>
}

export const COMPARE_PLATFORMS: ComparePlatform[] = [
  {
    slug: "shopify",
    name: "Shopify",
    metaTitle: {
      en: "Leadivo vs Shopify — COD Store Builder Comparison",
      ar: "Leadivo مقابل Shopify — أفضل منشئ متاجر الدفع عند الاستلام",
      fr: "Leadivo vs Shopify — Créateur de boutiques COD pour vendeurs sociaux",
    },
    metaDescription: {
      en: "Compare Leadivo and Shopify. See why social sellers and COD businesses choose Leadivo for fast, mobile-first storefronts with built-in WhatsApp and COD analytics.",
      ar: "قارن بين Leadivo وShopify. اكتشف لماذا يختار البائعون عبر السوشيال ميديا Leadivo لمتاجر COD سريعة ومتوافقة مع الهاتف.",
      fr: "Comparez Leadivo et Shopify. Découvrez pourquoi les vendeurs sociaux choisissent Leadivo pour des boutiques COD rapides et mobiles.",
    },
    keywords: [
      "leadivo vs shopify",
      "shopify alternative",
      "cod store builder",
      "shopify alternative for cod",
      "social media store builder",
      "shopify alternative arabic",
      "ecommerce platform cod",
      "fake cod orders protection",
    ],
    knownForKey: "compare.shopify.knownFor",
    leadivoFitKey: "compare.shopify.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "30+ min" },
      { key: "compare.feature.cod", leadivo: true, other: "plugin" },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: "plugin" },
      { key: "compare.feature.cartRecovery", leadivo: true, other: true },
      { key: "compare.feature.multiLanguage", leadivo: true, other: true },
      { key: "compare.feature.multiCurrency", leadivo: true, other: true },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.customDomain", leadivo: true, other: true },
      { key: "compare.feature.designBuilder", leadivo: true, other: true },
      { key: "compare.feature.metaCapi", leadivo: true, other: "plugin" },
      { key: "compare.feature.shippingZones", leadivo: true, other: true },
      { key: "compare.feature.reviews", leadivo: true, other: "plugin" },
      { key: "compare.feature.customerDatabase", leadivo: true, other: true },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$39/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
      { titleKey: "compare.highlight.instant.title", descKey: "compare.highlight.instant.desc", icon: "Zap" },
      { titleKey: "compare.highlight.social.title", descKey: "compare.highlight.social.desc", icon: "Smartphone" },
    ],
    faqs: [
      {
        question: {
          en: "Is Leadivo a good alternative to Shopify for COD sellers?",
          ar: "هل Leadivo بديل جيد لـ Shopify لبائعي الدفع عند الاستلام؟",
          fr: "Leadivo est-il une bonne alternative à Shopify pour les vendeurs COD ?",
        },
        answer: {
          en: "Leadivo is purpose-built for COD and social media sellers. You get built-in COD analytics, WhatsApp order notifications, and abandoned cart recovery — all included from day one with no plugins needed.",
          ar: "Leadivo مصمم خصيصاً لبائعي الدفع عند الاستلام والسوشيال ميديا. تحصل على تحليلات COD مدمجة وإشعارات طلبات واتساب واسترداد السلات المتروكة — كل ذلك مشمول من اليوم الأول بدون إضافات.",
          fr: "Leadivo est conçu pour les vendeurs COD et réseaux sociaux. Vous bénéficiez d'analytiques COD intégrées, de notifications WhatsApp et de récupération de paniers — tout inclus dès le premier jour sans plugins.",
        },
      },
      {
        question: {
          en: "Can I migrate from Shopify to Leadivo?",
          ar: "هل يمكنني الانتقال من Shopify إلى Leadivo؟",
          fr: "Puis-je migrer de Shopify vers Leadivo ?",
        },
        answer: {
          en: "You can set up your Leadivo store in under 2 minutes and add your products right away. Many sellers run both stores during transition, then switch their bio link once ready.",
          ar: "يمكنك إعداد متجر Leadivo في أقل من دقيقتين وإضافة منتجاتك فوراً. كثير من البائعين يشغلون المتجرين أثناء الانتقال، ثم يغيرون رابط البايو عندما يكونون جاهزين.",
          fr: "Vous pouvez créer votre boutique Leadivo en moins de 2 minutes et ajouter vos produits immédiatement. Beaucoup de vendeurs font tourner les deux boutiques pendant la transition, puis changent leur lien bio une fois prêts.",
        },
      },
    ],
  },
  {
    slug: "woocommerce",
    name: "WooCommerce",
    metaTitle: {
      en: "Leadivo vs WooCommerce — No-Code COD Store Builder",
      ar: "Leadivo مقابل WooCommerce — منشئ متاجر COD بدون برمجة",
      fr: "Leadivo vs WooCommerce — Créateur de boutiques COD sans code",
    },
    metaDescription: {
      en: "Compare Leadivo and WooCommerce. Launch a mobile-first COD store in 2 minutes with zero hosting, plugins, or coding — all included in one simple plan.",
      ar: "قارن بين Leadivo وWooCommerce. أطلق متجر COD متوافق مع الهاتف في دقيقتين بدون استضافة أو إضافات أو برمجة.",
      fr: "Comparez Leadivo et WooCommerce. Lancez une boutique COD mobile en 2 minutes sans hébergement, plugins ou code.",
    },
    keywords: [
      "leadivo vs woocommerce",
      "woocommerce alternative",
      "woocommerce alternative no coding",
      "cod store no hosting",
      "ecommerce without wordpress",
      "simple online store builder",
      "fake cod orders protection",
    ],
    knownForKey: "compare.woocommerce.knownFor",
    leadivoFitKey: "compare.woocommerce.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "1+ hour" },
      { key: "compare.feature.hosting", leadivo: true, other: false },
      { key: "compare.feature.noCode", leadivo: true, other: false },
      { key: "compare.feature.cod", leadivo: true, other: "plugin" },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: "plugin" },
      { key: "compare.feature.cartRecovery", leadivo: true, other: "plugin" },
      { key: "compare.feature.multiLanguage", leadivo: true, other: "plugin" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: "plugin" },
      { key: "compare.feature.mobileFirst", leadivo: true, other: "theme" },
      { key: "compare.feature.metaCapi", leadivo: true, other: "plugin" },
      { key: "compare.feature.maintenance", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: "plugin" },
      { key: "compare.feature.customerDatabase", leadivo: true, other: "plugin" },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$20+/mo*" },
    ],
    highlights: [
      { titleKey: "compare.highlight.noSetup.title", descKey: "compare.highlight.noSetup.desc", icon: "Zap" },
      { titleKey: "compare.highlight.allInOne.title", descKey: "compare.highlight.allInOne.desc", icon: "Package" },
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
    ],
    faqs: [
      {
        question: {
          en: "Do I need hosting or WordPress to use Leadivo?",
          ar: "هل أحتاج استضافة أو ووردبريس لاستخدام Leadivo؟",
          fr: "Ai-je besoin d'un hébergement ou de WordPress pour utiliser Leadivo ?",
        },
        answer: {
          en: "Leadivo is fully hosted — just sign up, add products, and share your link. Everything is managed for you including hosting, security updates, and performance optimization.",
          ar: "Leadivo مستضاف بالكامل — فقط سجّل، أضف المنتجات، وشارك رابطك. كل شيء مُدار لك بما في ذلك الاستضافة وتحديثات الأمان وتحسين الأداء.",
          fr: "Leadivo est entièrement hébergé — inscrivez-vous, ajoutez des produits et partagez votre lien. Tout est géré pour vous, y compris l'hébergement, les mises à jour de sécurité et l'optimisation des performances.",
        },
      },
      {
        question: {
          en: "Is Leadivo easier to use than WooCommerce?",
          ar: "هل Leadivo أسهل استخداماً من WooCommerce؟",
          fr: "Leadivo est-il plus facile à utiliser que WooCommerce ?",
        },
        answer: {
          en: "Leadivo is designed for non-technical users. You can create your store, add products, configure shipping, and start selling in under 2 minutes — with zero coding or plugin management.",
          ar: "Leadivo مصمم للمستخدمين غير التقنيين. يمكنك إنشاء متجرك وإضافة المنتجات وإعداد الشحن والبدء بالبيع في أقل من دقيقتين — بدون أي برمجة أو إدارة إضافات.",
          fr: "Leadivo est conçu pour les utilisateurs non techniques. Vous pouvez créer votre boutique, ajouter des produits, configurer la livraison et commencer à vendre en moins de 2 minutes — sans code ni gestion de plugins.",
        },
      },
    ],
  },
  {
    slug: "youcan",
    name: "YouCan",
    metaTitle: {
      en: "Leadivo vs YouCan — COD & Multi-Market Comparison",
      ar: "Leadivo مقابل YouCan — تحليلات COD ومنشئ متاجر متعدد الأسواق",
      fr: "Leadivo vs YouCan — Analytiques COD et boutique multi-marché",
    },
    metaDescription: {
      en: "Compare Leadivo and YouCan. Built-in COD analytics, WhatsApp cart recovery, multi-market pricing, and 20+ languages — purpose-built for social sellers.",
      ar: "قارن بين Leadivo وYouCan. تحليلات COD مدمجة واسترداد سلات واتساب وتسعير متعدد الأسواق و20+ لغة — مصمم خصيصاً لبائعي السوشيال.",
      fr: "Comparez Leadivo et YouCan. Analytiques COD intégrées, récupération WhatsApp, tarification multi-marché et 20+ langues — conçu pour les vendeurs sociaux.",
    },
    keywords: [
      "leadivo vs youcan",
      "youcan alternative",
      "youcan alternative cod",
      "cod ecommerce platform",
      "multi market store builder",
      "arabic ecommerce platform",
      "fake cod orders protection",
    ],
    knownForKey: "compare.youcan.knownFor",
    leadivoFitKey: "compare.youcan.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "5+ min" },
      { key: "compare.feature.cod", leadivo: true, other: true },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: false },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "limited" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: true },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.metaCapi", leadivo: true, other: true },
      { key: "compare.feature.tiktokApi", leadivo: true, other: false },
      { key: "compare.feature.googleSheets", leadivo: true, other: false },
      { key: "compare.feature.cityShipping", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: true },
      { key: "compare.feature.customerDatabase", leadivo: true, other: "limited" },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$19/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.codAnalytics.title", descKey: "compare.highlight.codAnalytics.desc", icon: "BarChart3" },
      { titleKey: "compare.highlight.whatsappRecovery.title", descKey: "compare.highlight.whatsappRecovery.desc", icon: "MessageCircle" },
      { titleKey: "compare.highlight.multiMarket.title", descKey: "compare.highlight.multiMarket.desc", icon: "Globe" },
    ],
    faqs: [
      {
        question: {
          en: "What does Leadivo offer that YouCan doesn't?",
          ar: "ما الذي يقدمه Leadivo ولا يقدمه YouCan؟",
          fr: "Qu'est-ce que Leadivo offre que YouCan n'a pas ?",
        },
        answer: {
          en: "Leadivo includes built-in COD analytics (confirmation, delivery, and return rates), WhatsApp abandoned cart recovery, multi-market pricing with automatic currency conversion, TikTok Events API, Google Sheets sync, and city-level shipping rates — all in one plan.",
          ar: "يشمل Leadivo تحليلات COD مدمجة (معدلات التأكيد والتسليم والإرجاع) واسترداد السلات عبر واتساب وتسعير متعدد الأسواق مع تحويل عملات تلقائي وTikTok Events API ومزامنة Google Sheets وأسعار شحن حسب المدينة — كل ذلك في خطة واحدة.",
          fr: "Leadivo inclut des analytiques COD intégrées (taux de confirmation, livraison et retour), la récupération de paniers via WhatsApp, la tarification multi-marché avec conversion automatique, TikTok Events API, synchronisation Google Sheets et tarifs de livraison par ville — tout dans un seul plan.",
        },
      },
      {
        question: {
          en: "Is Leadivo good for sellers in Morocco and North Africa?",
          ar: "هل Leadivo مناسب لبائعي المغرب وشمال أفريقيا؟",
          fr: "Leadivo est-il adapté aux vendeurs au Maroc et en Afrique du Nord ?",
        },
        answer: {
          en: "Leadivo supports Arabic and French with full RTL, local currencies (MAD, DZD, TND), city-level delivery rates, and WhatsApp notifications — everything North African sellers need to serve their customers effectively.",
          ar: "يدعم Leadivo العربية والفرنسية مع RTL كامل والعملات المحلية (MAD، DZD، TND) وأسعار توصيل حسب المدينة وإشعارات واتساب — كل ما يحتاجه بائعو شمال أفريقيا لخدمة عملائهم بفعالية.",
          fr: "Leadivo prend en charge l'arabe et le français avec RTL complet, les devises locales (MAD, DZD, TND), les tarifs de livraison par ville et les notifications WhatsApp — tout ce dont les vendeurs nord-africains ont besoin pour servir efficacement leurs clients.",
        },
      },
    ],
  },
  {
    slug: "salla",
    name: "Salla",
    metaTitle: {
      en: "Leadivo vs Salla — Multi-Market COD Store for Global Sellers",
      ar: "Leadivo مقابل سلة — متجر COD متعدد الأسواق للبائعين العالميين",
      fr: "Leadivo vs Salla — Boutique COD multi-marché pour vendeurs internationaux",
    },
    metaDescription: {
      en: "Compare Leadivo and Salla. Sell across markets with multi-currency pricing, 20 languages, WhatsApp recovery, and COD analytics — built for social sellers everywhere.",
      ar: "قارن بين Leadivo وسلة. بيع عبر أسواق متعددة بعملات محلية و20 لغة واسترداد واتساب وتحليلات COD — مصمم للبائعين في كل مكان.",
      fr: "Comparez Leadivo et Salla. Vendez sur plusieurs marchés avec tarification multi-devises, 20 langues, récupération WhatsApp et analytiques COD.",
    },
    keywords: [
      "leadivo vs salla",
      "salla alternative",
      "salla alternative international",
      "cod store international",
      "multi market ecommerce",
      "arabic store builder global",
      "fake cod orders protection",
    ],
    knownForKey: "compare.salla.knownFor",
    leadivoFitKey: "compare.salla.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "10+ min" },
      { key: "compare.feature.cod", leadivo: true, other: true },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: true },
      { key: "compare.feature.cartRecovery", leadivo: true, other: false },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "2 langs" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: "limited" },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.metaCapi", leadivo: true, other: true },
      { key: "compare.feature.tiktokApi", leadivo: true, other: false },
      { key: "compare.feature.googleSheets", leadivo: true, other: false },
      { key: "compare.feature.cityShipping", leadivo: true, other: true },
      { key: "compare.feature.reviews", leadivo: true, other: true },
      { key: "compare.feature.customerDatabase", leadivo: true, other: true },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$27/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.global.title", descKey: "compare.highlight.global.desc", icon: "Globe" },
      { titleKey: "compare.highlight.codAnalytics.title", descKey: "compare.highlight.codAnalytics.desc", icon: "BarChart3" },
      { titleKey: "compare.highlight.whatsappRecovery.title", descKey: "compare.highlight.whatsappRecovery.desc", icon: "MessageCircle" },
    ],
    faqs: [
      {
        question: {
          en: "How is Leadivo different from Salla?",
          ar: "كيف يختلف Leadivo عن سلة؟",
          fr: "En quoi Leadivo diffère-t-il de Salla ?",
        },
        answer: {
          en: "Leadivo is built for sellers who want to reach customers across multiple countries and markets. With 20 languages, multi-market pricing with automatic currency conversion, COD analytics, and WhatsApp cart recovery, Leadivo helps you scale beyond a single region.",
          ar: "Leadivo مصمم للبائعين الذين يريدون الوصول لعملاء في عدة دول وأسواق. مع 20 لغة وتسعير متعدد الأسواق مع تحويل عملات تلقائي وتحليلات COD واسترداد سلات واتساب، يساعدك Leadivo على التوسع خارج منطقة واحدة.",
          fr: "Leadivo est conçu pour les vendeurs qui veulent atteindre des clients dans plusieurs pays et marchés. Avec 20 langues, une tarification multi-marché avec conversion automatique, des analytiques COD et la récupération de paniers WhatsApp, Leadivo vous aide à vous développer au-delà d'une seule région.",
        },
      },
      {
        question: {
          en: "Can I use Leadivo if I sell in Saudi Arabia?",
          ar: "هل يمكنني استخدام Leadivo إذا كنت أبيع في السعودية؟",
          fr: "Puis-je utiliser Leadivo si je vends en Arabie Saoudite ?",
        },
        answer: {
          en: "Leadivo fully supports Arabic with RTL, SAR currency, city-level delivery rates for Saudi cities, and WhatsApp notifications. You can also expand to other markets with multi-currency pricing when you're ready.",
          ar: "يدعم Leadivo العربية بالكامل مع RTL وعملة SAR وأسعار توصيل حسب المدينة للمدن السعودية وإشعارات واتساب. يمكنك أيضاً التوسع لأسواق أخرى بتسعير متعدد العملات عندما تكون جاهزاً.",
          fr: "Leadivo prend entièrement en charge l'arabe avec RTL, la devise SAR, les tarifs de livraison par ville pour les villes saoudiennes et les notifications WhatsApp. Vous pouvez aussi vous étendre à d'autres marchés avec la tarification multi-devises quand vous êtes prêt.",
        },
      },
    ],
  },
  {
    slug: "expandcart",
    name: "ExpandCart",
    metaTitle: {
      en: "Leadivo vs ExpandCart — COD Store Builder Comparison",
      ar: "Leadivo مقابل ExpandCart — مقارنة منشئ متاجر COD",
      fr: "Leadivo vs ExpandCart — Comparaison de boutiques COD",
    },
    metaDescription: {
      en: "Compare Leadivo and ExpandCart. See how Leadivo offers built-in COD analytics, WhatsApp recovery, multi-market pricing, and fake order protection in one plan.",
      ar: "قارن بين Leadivo وExpandCart. اكتشف كيف يقدم Leadivo تحليلات COD مدمجة واسترداد واتساب وتسعير متعدد الأسواق وحماية من الطلبات الوهمية.",
      fr: "Comparez Leadivo et ExpandCart. Découvrez comment Leadivo offre des analytiques COD intégrées, récupération WhatsApp et tarification multi-marché.",
    },
    keywords: [
      "leadivo vs expandcart",
      "expandcart alternative",
      "expandcart alternative cod",
      "cod ecommerce egypt",
      "arabic ecommerce platform",
      "expandcart pricing",
      "بديل اكسباند كارت",
    ],
    knownForKey: "compare.expandcart.knownFor",
    leadivoFitKey: "compare.expandcart.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "15+ min" },
      { key: "compare.feature.cod", leadivo: true, other: true },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: "plugin" },
      { key: "compare.feature.cartRecovery", leadivo: true, other: true },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "limited" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: true },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.metaCapi", leadivo: true, other: true },
      { key: "compare.feature.tiktokApi", leadivo: true, other: false },
      { key: "compare.feature.googleSheets", leadivo: true, other: false },
      { key: "compare.feature.cityShipping", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: true },
      { key: "compare.feature.customerDatabase", leadivo: true, other: true },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$29/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.codAnalytics.title", descKey: "compare.highlight.codAnalytics.desc", icon: "BarChart3" },
      { titleKey: "compare.highlight.instant.title", descKey: "compare.highlight.instant.desc", icon: "Zap" },
      { titleKey: "compare.highlight.multiMarket.title", descKey: "compare.highlight.multiMarket.desc", icon: "Globe" },
    ],
    faqs: [
      {
        question: {
          en: "Is Leadivo a good alternative to ExpandCart?",
          ar: "هل Leadivo بديل جيد لـ ExpandCart؟",
          fr: "Leadivo est-il une bonne alternative à ExpandCart ?",
        },
        answer: {
          en: "Leadivo offers built-in COD analytics, WhatsApp abandoned cart recovery, multi-market pricing with automatic currency conversion, and fake order protection via SMS OTP — all included in one simple plan with no plugins needed.",
          ar: "يقدم Leadivo تحليلات COD مدمجة واسترداد السلات عبر واتساب وتسعير متعدد الأسواق مع تحويل عملات تلقائي وحماية من الطلبات الوهمية عبر SMS OTP — كل ذلك في خطة واحدة بدون إضافات.",
          fr: "Leadivo offre des analytiques COD intégrées, la récupération de paniers via WhatsApp, la tarification multi-marché avec conversion automatique et la protection contre les fausses commandes via SMS OTP — tout inclus dans un seul plan sans plugins.",
        },
      },
      {
        question: {
          en: "Can I use Leadivo if I sell in Egypt?",
          ar: "هل يمكنني استخدام Leadivo إذا كنت أبيع في مصر؟",
          fr: "Puis-je utiliser Leadivo si je vends en Égypte ?",
        },
        answer: {
          en: "Leadivo fully supports Arabic with RTL, EGP currency, city-level delivery rates for Egyptian cities, and WhatsApp notifications. You can also expand to other markets with multi-currency pricing when you're ready.",
          ar: "يدعم Leadivo العربية بالكامل مع RTL وعملة الجنيه المصري وأسعار توصيل حسب المدينة وإشعارات واتساب. يمكنك أيضاً التوسع لأسواق أخرى بتسعير متعدد العملات.",
          fr: "Leadivo prend entièrement en charge l'arabe avec RTL, la devise EGP, les tarifs de livraison par ville et les notifications WhatsApp. Vous pouvez aussi vous étendre à d'autres marchés.",
        },
      },
    ],
  },
  {
    slug: "ecwid",
    name: "Ecwid",
    metaTitle: {
      en: "Leadivo vs Ecwid — Social Selling Store Comparison",
      ar: "Leadivo مقابل Ecwid — مقارنة متاجر البيع عبر السوشيال",
      fr: "Leadivo vs Ecwid — Comparaison de boutiques social selling",
    },
    metaDescription: {
      en: "Compare Leadivo and Ecwid. Leadivo is built for social sellers with COD support, WhatsApp notifications, multi-market pricing, and 20 languages included.",
      ar: "قارن بين Leadivo وEcwid. Leadivo مصمم لبائعي السوشيال مع دعم COD وإشعارات واتساب وتسعير متعدد الأسواق و20 لغة.",
      fr: "Comparez Leadivo et Ecwid. Leadivo est conçu pour les vendeurs sociaux avec COD, WhatsApp, tarification multi-marché et 20 langues incluses.",
    },
    keywords: [
      "leadivo vs ecwid",
      "ecwid alternative",
      "ecwid alternative cod",
      "social selling store",
      "ecwid alternative arabic",
      "simple online store builder",
    ],
    knownForKey: "compare.ecwid.knownFor",
    leadivoFitKey: "compare.ecwid.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "10+ min" },
      { key: "compare.feature.cod", leadivo: true, other: false },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: true },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "limited" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: true },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.metaCapi", leadivo: true, other: true },
      { key: "compare.feature.tiktokApi", leadivo: true, other: false },
      { key: "compare.feature.googleSheets", leadivo: true, other: false },
      { key: "compare.feature.cityShipping", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: true },
      { key: "compare.feature.customerDatabase", leadivo: true, other: "limited" },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$25/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
      { titleKey: "compare.highlight.social.title", descKey: "compare.highlight.social.desc", icon: "Smartphone" },
      { titleKey: "compare.highlight.multiMarket.title", descKey: "compare.highlight.multiMarket.desc", icon: "Globe" },
    ],
    faqs: [
      {
        question: {
          en: "Is Leadivo better than Ecwid for social sellers?",
          ar: "هل Leadivo أفضل من Ecwid لبائعي السوشيال؟",
          fr: "Leadivo est-il mieux qu'Ecwid pour les vendeurs sociaux ?",
        },
        answer: {
          en: "Leadivo is purpose-built for social sellers with COD support, WhatsApp order notifications, abandoned cart recovery, multi-market pricing, and fake order protection — features that Ecwid doesn't offer natively.",
          ar: "Leadivo مصمم خصيصاً لبائعي السوشيال مع دعم COD وإشعارات واتساب واسترداد السلات وتسعير متعدد الأسواق وحماية الطلبات — ميزات لا يقدمها Ecwid بشكل أصلي.",
          fr: "Leadivo est conçu pour les vendeurs sociaux avec COD, notifications WhatsApp, récupération de paniers, tarification multi-marché et protection des commandes — des fonctionnalités qu'Ecwid n'offre pas nativement.",
        },
      },
      {
        question: {
          en: "Does Leadivo support embedding in existing websites like Ecwid?",
          ar: "هل يدعم Leadivo التضمين في مواقع موجودة مثل Ecwid؟",
          fr: "Leadivo prend-il en charge l'intégration sur des sites existants comme Ecwid ?",
        },
        answer: {
          en: "Leadivo gives you a standalone, mobile-first storefront with your own link and optional custom domain. Most social sellers prefer sharing a direct link in their bio rather than embedding in another website.",
          ar: "Leadivo يمنحك واجهة متجر مستقلة ومتوافقة مع الهاتف برابط خاص ونطاق مخصص اختياري. معظم بائعي السوشيال يفضلون مشاركة رابط مباشر في البايو بدلاً من التضمين في موقع آخر.",
          fr: "Leadivo vous offre une vitrine autonome et mobile-first avec votre propre lien et un domaine personnalisé optionnel. La plupart des vendeurs sociaux préfèrent partager un lien direct dans leur bio.",
        },
      },
    ],
  },
  {
    slug: "wix",
    name: "Wix",
    metaTitle: {
      en: "Leadivo vs Wix — COD-Ready Store Builder Comparison",
      ar: "Leadivo مقابل Wix — مقارنة منشئ متاجر الدفع عند الاستلام",
      fr: "Leadivo vs Wix — Comparaison de boutiques COD prêtes",
    },
    metaDescription: {
      en: "Compare Leadivo and Wix for online selling. Leadivo is built for COD sellers with WhatsApp integration, multi-market pricing, and fake order protection included.",
      ar: "قارن بين Leadivo وWix للبيع أونلاين. Leadivo مصمم لبائعي COD مع واتساب وتسعير متعدد الأسواق وحماية الطلبات الوهمية.",
      fr: "Comparez Leadivo et Wix pour la vente en ligne. Leadivo est conçu pour les vendeurs COD avec WhatsApp, tarification multi-marché et protection anti-fraude.",
    },
    keywords: [
      "leadivo vs wix",
      "wix alternative",
      "wix alternative cod",
      "wix ecommerce alternative",
      "cod store builder",
      "wix alternative arabic",
      "simple store builder",
    ],
    knownForKey: "compare.wix.knownFor",
    leadivoFitKey: "compare.wix.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "30+ min" },
      { key: "compare.feature.cod", leadivo: true, other: false },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: true },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "limited" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: true },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.customDomain", leadivo: true, other: true },
      { key: "compare.feature.designBuilder", leadivo: true, other: true },
      { key: "compare.feature.metaCapi", leadivo: true, other: "plugin" },
      { key: "compare.feature.shippingZones", leadivo: true, other: true },
      { key: "compare.feature.reviews", leadivo: true, other: true },
      { key: "compare.feature.customerDatabase", leadivo: true, other: true },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$27/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
      { titleKey: "compare.highlight.instant.title", descKey: "compare.highlight.instant.desc", icon: "Zap" },
      { titleKey: "compare.highlight.whatsappRecovery.title", descKey: "compare.highlight.whatsappRecovery.desc", icon: "MessageCircle" },
    ],
    faqs: [
      {
        question: {
          en: "Is Leadivo better than Wix for COD businesses?",
          ar: "هل Leadivo أفضل من Wix لأعمال الدفع عند الاستلام؟",
          fr: "Leadivo est-il meilleur que Wix pour les entreprises COD ?",
        },
        answer: {
          en: "Leadivo is purpose-built for COD sellers. You get built-in COD analytics, WhatsApp order notifications, abandoned cart recovery, multi-market pricing, and fake order protection — features Wix doesn't offer for COD businesses.",
          ar: "Leadivo مصمم خصيصاً لبائعي COD. تحصل على تحليلات COD وإشعارات واتساب واسترداد السلات وتسعير متعدد الأسواق وحماية الطلبات الوهمية — ميزات لا يقدمها Wix لأعمال COD.",
          fr: "Leadivo est conçu pour les vendeurs COD. Vous bénéficiez d'analytiques COD, notifications WhatsApp, récupération de paniers, tarification multi-marché et protection anti-fraude — des fonctionnalités que Wix n'offre pas pour le COD.",
        },
      },
      {
        question: {
          en: "Can I build a store faster on Leadivo than on Wix?",
          ar: "هل يمكنني بناء متجر أسرع على Leadivo من Wix؟",
          fr: "Puis-je créer une boutique plus vite sur Leadivo que sur Wix ?",
        },
        answer: {
          en: "Leadivo gets your store live in under 2 minutes — just add products and share your link. Wix offers more general website-building tools, but Leadivo is laser-focused on getting you selling quickly.",
          ar: "Leadivo يجعل متجرك جاهزاً في أقل من دقيقتين — أضف المنتجات وشارك رابطك. Wix يقدم أدوات بناء مواقع أكثر، لكن Leadivo مركز على بدء البيع بسرعة.",
          fr: "Leadivo met votre boutique en ligne en moins de 2 minutes — ajoutez des produits et partagez votre lien. Wix offre plus d'outils de création de sites, mais Leadivo se concentre sur la vente rapide.",
        },
      },
    ],
  },
  {
    slug: "bigcommerce",
    name: "BigCommerce",
    metaTitle: {
      en: "Leadivo vs BigCommerce — Simple COD Store Builder",
      ar: "Leadivo مقابل BigCommerce — منشئ متاجر COD بسيط",
      fr: "Leadivo vs BigCommerce — Créateur de boutiques COD simple",
    },
    metaDescription: {
      en: "Compare Leadivo and BigCommerce. Leadivo offers a simpler, faster setup for COD sellers with WhatsApp, multi-market pricing, and order protection built in.",
      ar: "قارن بين Leadivo وBigCommerce. Leadivo يقدم إعداداً أبسط وأسرع لبائعي COD مع واتساب وتسعير متعدد الأسواق وحماية الطلبات.",
      fr: "Comparez Leadivo et BigCommerce. Leadivo offre une configuration plus simple et rapide pour les vendeurs COD avec WhatsApp et tarification multi-marché.",
    },
    keywords: [
      "leadivo vs bigcommerce",
      "bigcommerce alternative",
      "bigcommerce alternative simple",
      "bigcommerce alternative cod",
      "simple ecommerce platform",
      "cod store builder",
    ],
    knownForKey: "compare.bigcommerce.knownFor",
    leadivoFitKey: "compare.bigcommerce.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "30+ min" },
      { key: "compare.feature.cod", leadivo: true, other: false },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: true },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "limited" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: true },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.customDomain", leadivo: true, other: true },
      { key: "compare.feature.metaCapi", leadivo: true, other: true },
      { key: "compare.feature.tiktokApi", leadivo: true, other: true },
      { key: "compare.feature.shippingZones", leadivo: true, other: true },
      { key: "compare.feature.reviews", leadivo: true, other: true },
      { key: "compare.feature.customerDatabase", leadivo: true, other: true },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$39/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.instant.title", descKey: "compare.highlight.instant.desc", icon: "Zap" },
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
      { titleKey: "compare.highlight.social.title", descKey: "compare.highlight.social.desc", icon: "Smartphone" },
    ],
    faqs: [
      {
        question: {
          en: "Why choose Leadivo over BigCommerce?",
          ar: "لماذا تختار Leadivo بدلاً من BigCommerce؟",
          fr: "Pourquoi choisir Leadivo plutôt que BigCommerce ?",
        },
        answer: {
          en: "BigCommerce is built for large-scale online retailers. Leadivo is built for social sellers and COD businesses who need a fast, simple setup with WhatsApp, COD analytics, and multi-market pricing — all in one affordable plan.",
          ar: "BigCommerce مصمم لتجار التجزئة الكبار. Leadivo مصمم لبائعي السوشيال وأعمال COD الذين يحتاجون إعداداً سريعاً وبسيطاً مع واتساب وتحليلات COD وتسعير متعدد الأسواق — في خطة واحدة بسعر معقول.",
          fr: "BigCommerce est conçu pour les grands détaillants. Leadivo est conçu pour les vendeurs sociaux et COD qui ont besoin d'une configuration rapide avec WhatsApp, analytiques COD et tarification multi-marché — dans un seul plan abordable.",
        },
      },
      {
        question: {
          en: "Is Leadivo easier to use than BigCommerce?",
          ar: "هل Leadivo أسهل استخداماً من BigCommerce؟",
          fr: "Leadivo est-il plus facile à utiliser que BigCommerce ?",
        },
        answer: {
          en: "Leadivo is designed for simplicity — your store is live in 2 minutes with zero technical knowledge needed. BigCommerce has a steeper learning curve suited to larger operations.",
          ar: "Leadivo مصمم للبساطة — متجرك جاهز في دقيقتين بدون أي معرفة تقنية. BigCommerce لديه منحنى تعلم أكثر حدة مناسب للعمليات الأكبر.",
          fr: "Leadivo est conçu pour la simplicité — votre boutique est en ligne en 2 minutes sans connaissance technique. BigCommerce a une courbe d'apprentissage plus raide adaptée aux grandes opérations.",
        },
      },
    ],
  },
  {
    slug: "ecomadina",
    name: "EcoMadina",
    metaTitle: {
      en: "Leadivo vs EcoMadina — MENA COD Store Comparison",
      ar: "Leadivo مقابل EcoMadina — مقارنة متاجر COD في MENA",
      fr: "Leadivo vs EcoMadina — Comparaison de boutiques COD MENA",
    },
    metaDescription: {
      en: "Compare Leadivo and EcoMadina. Leadivo offers 20 languages, multi-market pricing, WhatsApp recovery, COD analytics, and fake order protection for MENA sellers.",
      ar: "قارن بين Leadivo وEcoMadina. يقدم Leadivo عشرين لغة وتسعير متعدد الأسواق واسترداد واتساب وتحليلات COD وحماية الطلبات الوهمية.",
      fr: "Comparez Leadivo et EcoMadina. Leadivo offre 20 langues, tarification multi-marché, récupération WhatsApp et analytiques COD pour les vendeurs MENA.",
    },
    keywords: [
      "leadivo vs ecomadina",
      "ecomadina alternative",
      "ecomadina alternative arabic",
      "mena ecommerce platform",
      "arabic store builder",
      "بديل ايكومدينة",
      "منصة تجارة الكترونية عربية",
    ],
    knownForKey: "compare.ecomadina.knownFor",
    leadivoFitKey: "compare.ecomadina.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "10+ min" },
      { key: "compare.feature.cod", leadivo: true, other: true },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: false },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: "limited" },
      { key: "compare.feature.multiCurrency", leadivo: true, other: "limited" },
      { key: "compare.feature.multiMarket", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.metaCapi", leadivo: true, other: false },
      { key: "compare.feature.tiktokApi", leadivo: true, other: false },
      { key: "compare.feature.googleSheets", leadivo: true, other: false },
      { key: "compare.feature.cityShipping", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: "limited" },
      { key: "compare.feature.customerDatabase", leadivo: true, other: false },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "$15/mo+" },
    ],
    highlights: [
      { titleKey: "compare.highlight.allInOne.title", descKey: "compare.highlight.allInOne.desc", icon: "Package" },
      { titleKey: "compare.highlight.codAnalytics.title", descKey: "compare.highlight.codAnalytics.desc", icon: "BarChart3" },
      { titleKey: "compare.highlight.global.title", descKey: "compare.highlight.global.desc", icon: "Globe" },
    ],
    faqs: [
      {
        question: {
          en: "How does Leadivo compare to EcoMadina for MENA sellers?",
          ar: "كيف يقارن Leadivo مع EcoMadina لبائعي منطقة MENA؟",
          fr: "Comment Leadivo se compare-t-il à EcoMadina pour les vendeurs MENA ?",
        },
        answer: {
          en: "Leadivo offers a more complete feature set with 20 languages, multi-market pricing, WhatsApp cart recovery, COD analytics, Google Sheets sync, TikTok Events API, and built-in fake order protection via SMS OTP.",
          ar: "يقدم Leadivo مجموعة ميزات أكثر اكتمالاً مع 20 لغة وتسعير متعدد الأسواق واسترداد سلات واتساب وتحليلات COD ومزامنة Google Sheets وTikTok Events API وحماية مدمجة من الطلبات الوهمية عبر SMS OTP.",
          fr: "Leadivo offre un ensemble de fonctionnalités plus complet avec 20 langues, tarification multi-marché, récupération WhatsApp, analytiques COD, synchronisation Google Sheets, TikTok Events API et protection anti-fraude intégrée via SMS OTP.",
        },
      },
      {
        question: {
          en: "Can I sell internationally with Leadivo unlike EcoMadina?",
          ar: "هل يمكنني البيع دولياً مع Leadivo على عكس EcoMadina؟",
          fr: "Puis-je vendre à l'international avec Leadivo contrairement à EcoMadina ?",
        },
        answer: {
          en: "Leadivo supports multi-market selling with automatic currency conversion, 20 languages, and city-level shipping rates across countries — helping you expand beyond your local market from a single store.",
          ar: "يدعم Leadivo البيع متعدد الأسواق مع تحويل عملات تلقائي و20 لغة وأسعار شحن حسب المدينة عبر الدول — يساعدك على التوسع خارج سوقك المحلي من متجر واحد.",
          fr: "Leadivo prend en charge la vente multi-marché avec conversion automatique, 20 langues et tarifs de livraison par ville — pour vous étendre au-delà de votre marché local depuis une seule boutique.",
        },
      },
    ],
  },
  {
    slug: "instagram-selling",
    name: "Instagram Selling",
    metaTitle: {
      en: "Leadivo vs Instagram Selling — Your Own Store Link",
      ar: "Leadivo مقابل البيع عبر إنستغرام — رابط متجرك الخاص",
      fr: "Leadivo vs Vente Instagram — Votre propre boutique",
    },
    metaDescription: {
      en: "Stop losing sales in DMs. Leadivo turns your Instagram followers into real orders with a mobile-first store, COD support, and WhatsApp notifications.",
      ar: "توقف عن خسارة المبيعات في الرسائل. Leadivo يحول متابعي إنستغرام لطلبات حقيقية مع متجر متوافق مع الهاتف ودعم COD وإشعارات واتساب.",
      fr: "Arrêtez de perdre des ventes en DM. Leadivo transforme vos abonnés Instagram en vraies commandes avec une boutique mobile, COD et WhatsApp.",
    },
    keywords: [
      "sell on instagram",
      "instagram store",
      "link in bio store",
      "instagram selling alternative",
      "stop selling in dms",
      "instagram to store",
      "البيع عبر انستغرام",
      "متجر رابط البايو",
    ],
    knownForKey: "compare.instagram.knownFor",
    leadivoFitKey: "compare.instagram.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "instant" },
      { key: "compare.feature.cod", leadivo: true, other: false },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: false },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: false },
      { key: "compare.feature.multiCurrency", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.customDomain", leadivo: true, other: false },
      { key: "compare.feature.metaCapi", leadivo: true, other: "limited" },
      { key: "compare.feature.shippingZones", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: false },
      { key: "compare.feature.customerDatabase", leadivo: true, other: false },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "Free" },
    ],
    highlights: [
      { titleKey: "compare.highlight.social.title", descKey: "compare.highlight.social.desc", icon: "Smartphone" },
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
      { titleKey: "compare.highlight.whatsappRecovery.title", descKey: "compare.highlight.whatsappRecovery.desc", icon: "MessageCircle" },
    ],
    faqs: [
      {
        question: {
          en: "Why do I need Leadivo if I already sell on Instagram?",
          ar: "لماذا أحتاج Leadivo إذا كنت أبيع بالفعل على إنستغرام؟",
          fr: "Pourquoi ai-je besoin de Leadivo si je vends déjà sur Instagram ?",
        },
        answer: {
          en: "Selling in DMs means lost messages, no order tracking, no analytics, and no way to recover abandoned carts. Leadivo gives you a professional storefront link to put in your bio — customers browse, order, and pay on their own while you track everything from a dashboard.",
          ar: "البيع عبر الرسائل يعني رسائل ضائعة وبدون تتبع طلبات وبدون تحليلات وبدون استرداد سلات. Leadivo يمنحك رابط متجر احترافي لوضعه في البايو — العملاء يتصفحون ويطلبون ويدفعون بأنفسهم وأنت تتابع كل شيء من لوحة التحكم.",
          fr: "Vendre en DM signifie des messages perdus, pas de suivi de commandes, pas d'analytiques et pas de récupération de paniers. Leadivo vous donne un lien de boutique professionnel pour votre bio — les clients naviguent, commandent et paient seuls pendant que vous suivez tout depuis le tableau de bord.",
        },
      },
      {
        question: {
          en: "Can I still use Instagram with Leadivo?",
          ar: "هل يمكنني الاستمرار في استخدام إنستغرام مع Leadivo؟",
          fr: "Puis-je toujours utiliser Instagram avec Leadivo ?",
        },
        answer: {
          en: "Leadivo works alongside Instagram — put your store link in your bio, share it in stories, and let followers order directly. You keep your Instagram presence while Leadivo handles the store, orders, and shipping.",
          ar: "Leadivo يعمل بجانب إنستغرام — ضع رابط متجرك في البايو وشاركه في الستوري ودع المتابعين يطلبون مباشرة. تحتفظ بحضورك على إنستغرام بينما Leadivo يتولى المتجر والطلبات والشحن.",
          fr: "Leadivo fonctionne avec Instagram — mettez votre lien boutique dans votre bio, partagez-le en story et laissez vos abonnés commander directement. Vous gardez votre présence Instagram tandis que Leadivo gère la boutique, les commandes et la livraison.",
        },
      },
    ],
  },
  {
    slug: "facebook-marketplace",
    name: "Facebook Marketplace",
    metaTitle: {
      en: "Leadivo vs Facebook Marketplace — Your Own Online Store",
      ar: "Leadivo مقابل فيسبوك ماركتبليس — متجرك الإلكتروني الخاص",
      fr: "Leadivo vs Facebook Marketplace — Votre propre boutique",
    },
    metaDescription: {
      en: "Move beyond Facebook Marketplace. Leadivo gives you a branded store with COD, WhatsApp notifications, order tracking, and a customer database — all in one place.",
      ar: "تجاوز فيسبوك ماركتبليس. Leadivo يمنحك متجراً مع COD وإشعارات واتساب وتتبع الطلبات وقاعدة بيانات العملاء — في مكان واحد.",
      fr: "Allez au-delà de Facebook Marketplace. Leadivo vous offre une boutique avec COD, WhatsApp, suivi des commandes et base clients — tout en un.",
    },
    keywords: [
      "facebook marketplace alternative",
      "sell beyond facebook",
      "facebook marketplace vs online store",
      "own store vs marketplace",
      "facebook marketplace selling",
      "بديل فيسبوك ماركتبليس",
    ],
    knownForKey: "compare.facebook.knownFor",
    leadivoFitKey: "compare.facebook.leadivoFit",
    features: [
      { key: "compare.feature.setup", leadivo: "2 min", other: "instant" },
      { key: "compare.feature.cod", leadivo: true, other: false },
      { key: "compare.feature.codAnalytics", leadivo: true, other: false },
      { key: "compare.feature.whatsapp", leadivo: true, other: false },
      { key: "compare.feature.cartRecovery", leadivo: true, other: false },
      { key: "compare.feature.multiLanguage", leadivo: "20 langs", other: false },
      { key: "compare.feature.multiCurrency", leadivo: true, other: false },
      { key: "compare.feature.mobileFirst", leadivo: true, other: true },
      { key: "compare.feature.customDomain", leadivo: true, other: false },
      { key: "compare.feature.designBuilder", leadivo: true, other: false },
      { key: "compare.feature.metaCapi", leadivo: true, other: false },
      { key: "compare.feature.shippingZones", leadivo: true, other: false },
      { key: "compare.feature.reviews", leadivo: true, other: "limited" },
      { key: "compare.feature.customerDatabase", leadivo: true, other: false },
      { key: "compare.feature.orderProtection", leadivo: true, other: false },
      { key: "compare.feature.pricing", leadivo: "$19/mo", other: "Free" },
    ],
    highlights: [
      { titleKey: "compare.highlight.allInOne.title", descKey: "compare.highlight.allInOne.desc", icon: "Package" },
      { titleKey: "compare.highlight.codFirst.title", descKey: "compare.highlight.codFirst.desc", icon: "ShoppingCart" },
      { titleKey: "compare.highlight.social.title", descKey: "compare.highlight.social.desc", icon: "Smartphone" },
    ],
    faqs: [
      {
        question: {
          en: "Why should I use Leadivo instead of Facebook Marketplace?",
          ar: "لماذا يجب أن أستخدم Leadivo بدلاً من فيسبوك ماركتبليس؟",
          fr: "Pourquoi utiliser Leadivo au lieu de Facebook Marketplace ?",
        },
        answer: {
          en: "Facebook Marketplace is great for visibility, but you don't own the customer relationship. Leadivo gives you your own branded store with order management, customer database, shipping zones, COD analytics, and WhatsApp notifications — you build a real business, not just listings.",
          ar: "فيسبوك ماركتبليس ممتاز للظهور، لكنك لا تملك علاقة العميل. Leadivo يمنحك متجراً خاصاً مع إدارة طلبات وقاعدة بيانات عملاء ومناطق شحن وتحليلات COD وإشعارات واتساب — تبني عملاً حقيقياً وليس مجرد إعلانات.",
          fr: "Facebook Marketplace est idéal pour la visibilité, mais vous ne possédez pas la relation client. Leadivo vous donne votre propre boutique avec gestion des commandes, base clients, zones de livraison, analytiques COD et notifications WhatsApp — vous construisez un vrai business.",
        },
      },
      {
        question: {
          en: "Can I use Facebook Marketplace and Leadivo together?",
          ar: "هل يمكنني استخدام فيسبوك ماركتبليس وLeadivo معاً؟",
          fr: "Puis-je utiliser Facebook Marketplace et Leadivo ensemble ?",
        },
        answer: {
          en: "Many sellers use Facebook Marketplace for discovery and direct customers to their Leadivo store for orders. This way you get marketplace traffic plus a professional checkout experience with order tracking and customer management.",
          ar: "كثير من البائعين يستخدمون فيسبوك ماركتبليس للاكتشاف ويوجهون العملاء لمتجر Leadivo للطلبات. بهذه الطريقة تحصل على حركة المرور من الماركتبليس مع تجربة دفع احترافية وتتبع الطلبات وإدارة العملاء.",
          fr: "Beaucoup de vendeurs utilisent Facebook Marketplace pour la découverte et dirigent les clients vers leur boutique Leadivo pour les commandes. Vous obtenez le trafic du marketplace plus une expérience de paiement professionnelle avec suivi et gestion clients.",
        },
      },
    ],
  },
]

export function getComparePlatform(slug: string): ComparePlatform | undefined {
  return COMPARE_PLATFORMS.find((p) => p.slug === slug)
}

export function getAllCompareSlugs(): string[] {
  return COMPARE_PLATFORMS.map((p) => p.slug)
}
