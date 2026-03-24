export type Localized = { en: string; ar: string; fr: string }

export interface DocCategory {
  slug: string
  title: Localized
  description: Localized
  icon: string
}

export interface DocStep {
  title: Localized
  description: Localized
  image?: string
}

export interface DocFaq {
  question: Localized
  answer: Localized
}

export interface DocArticle {
  slug: string
  category: string
  title: Localized
  description: Localized
  steps: DocStep[]
  faqs?: DocFaq[]
}

export const CATEGORIES: DocCategory[] = [
  {
    slug: "getting-started",
    title: { en: "Getting Started", ar: "البدء", fr: "Premiers pas" },
    description: {
      en: "Create your account and set up your first store.",
      ar: "أنشئ حسابك وأعد إعداد متجرك الأول.",
      fr: "Créez votre compte et configurez votre première boutique.",
    },
    icon: "Rocket",
  },
  {
    slug: "store",
    title: { en: "Store Setup", ar: "إعداد المتجر", fr: "Configuration de la boutique" },
    description: {
      en: "Configure your store settings, currency, and domain.",
      ar: "اضبط إعدادات متجرك والعملة والنطاق.",
      fr: "Configurez les paramètres, la devise et le domaine de votre boutique.",
    },
    icon: "Store",
  },
  {
    slug: "design",
    title: { en: "Design & Theme", ar: "التصميم والمظهر", fr: "Design et thème" },
    description: {
      en: "Customize your store's look with colors, fonts, and layout.",
      ar: "خصّص مظهر متجرك بالألوان والخطوط والتخطيط.",
      fr: "Personnalisez l'apparence de votre boutique avec des couleurs, polices et mises en page.",
    },
    icon: "Paintbrush",
  },
  {
    slug: "products",
    title: { en: "Products", ar: "المنتجات", fr: "Produits" },
    description: {
      en: "Add, edit, and manage your product catalog.",
      ar: "أضف وعدّل وأدِر كتالوج منتجاتك.",
      fr: "Ajoutez, modifiez et gérez votre catalogue de produits.",
    },
    icon: "Package",
  },
  {
    slug: "collections",
    title: { en: "Collections", ar: "المجموعات", fr: "Collections" },
    description: {
      en: "Organize products into collections for easy browsing.",
      ar: "نظّم المنتجات في مجموعات لتسهيل التصفح.",
      fr: "Organisez vos produits en collections pour faciliter la navigation.",
    },
    icon: "FolderOpen",
  },
  {
    slug: "orders",
    title: { en: "Orders", ar: "الطلبات", fr: "Commandes" },
    description: {
      en: "View, manage, and fulfill customer orders.",
      ar: "اعرض وأدِر ونفّذ طلبات العملاء.",
      fr: "Consultez, gérez et traitez les commandes clients.",
    },
    icon: "ShoppingCart",
  },
  {
    slug: "shipping",
    title: { en: "Shipping", ar: "الشحن", fr: "Livraison" },
    description: {
      en: "Configure delivery fees by country and city.",
      ar: "اضبط رسوم التوصيل حسب البلد والمدينة.",
      fr: "Configurez les frais de livraison par pays et par ville.",
    },
    icon: "Truck",
  },
  {
    slug: "markets",
    title: { en: "Markets", ar: "الأسواق", fr: "Marchés" },
    description: {
      en: "Sell in different regions with local currencies and pricing.",
      ar: "بع في مناطق مختلفة بعملات وأسعار محلية.",
      fr: "Vendez dans différentes régions avec des devises et prix locaux.",
    },
    icon: "MapPin",
  },
  {
    slug: "discounts",
    title: { en: "Discounts", ar: "التخفيضات", fr: "Réductions" },
    description: {
      en: "Create discount codes to boost sales.",
      ar: "أنشئ أكواد خصم لتعزيز المبيعات.",
      fr: "Créez des codes de réduction pour booster vos ventes.",
    },
    icon: "Ticket",
  },
  {
    slug: "integrations",
    title: { en: "Integrations", ar: "التكاملات", fr: "Intégrations" },
    description: {
      en: "Connect WhatsApp, Meta Pixel, Google Sheets, and more.",
      ar: "اربط واتساب وميتا بيكسل وجوجل شيتس والمزيد.",
      fr: "Connectez WhatsApp, Meta Pixel, Google Sheets et plus encore.",
    },
    icon: "Puzzle",
  },
  {
    slug: "settings",
    title: { en: "Settings", ar: "الإعدادات", fr: "Paramètres" },
    description: {
      en: "Manage your account and preferences.",
      ar: "أدِر حسابك وتفضيلاتك.",
      fr: "Gérez votre compte et vos préférences.",
    },
    icon: "Settings",
  },
]

// ---------------------------------------------------------------------------
// Articles
// ---------------------------------------------------------------------------

export const ARTICLES: DocArticle[] = [
  // ── Getting Started ──────────────────────────────────────────────────
  {
    slug: "create-account",
    category: "getting-started",
    title: {
      en: "How to create your account",
      ar: "كيفية إنشاء حسابك",
      fr: "Comment créer votre compte",
    },
    description: {
      en: "Sign up for Leadivo using email or Google.",
      ar: "سجّل في Leadivo باستخدام البريد الإلكتروني أو جوجل.",
      fr: "Inscrivez-vous sur Leadivo avec votre email ou Google.",
    },
    steps: [
      {
        title: { en: "Go to the signup page", ar: "انتقل إلى صفحة التسجيل", fr: "Allez sur la page d'inscription" },
        description: {
          en: "Visit leadivo.app and click the \"Get Started\" button in the top-right corner. This will take you to the registration form where you can create your free account in under a minute.",
          ar: "قم بزيارة leadivo.app وانقر على زر \"ابدأ الآن\" في الزاوية العلوية. سينقلك هذا إلى نموذج التسجيل حيث يمكنك إنشاء حسابك المجاني في أقل من دقيقة.",
          fr: "Visitez leadivo.app et cliquez sur le bouton « Commencer » en haut à droite. Cela vous amènera au formulaire d'inscription où vous pourrez créer votre compte gratuit en moins d'une minute.",
        },
        image: "/docs/getting-started/create-account-1.svg",
      },
      {
        title: { en: "Fill in your details", ar: "أدخل بياناتك", fr: "Remplissez vos informations" },
        description: {
          en: "Enter your full name, email address, and create a password (at least 6 characters). Alternatively, click \"Continue with Google\" to register instantly using your Google account — no password needed. Your name and email will be used for order notifications and account recovery.",
          ar: "أدخل اسمك الكامل وبريدك الإلكتروني وأنشئ كلمة مرور (6 أحرف على الأقل). بدلاً من ذلك، انقر على \"المتابعة عبر جوجل\" للتسجيل فوريًا باستخدام حسابك في جوجل — بدون حاجة لكلمة مرور. سيُستخدم اسمك وبريدك الإلكتروني لإشعارات الطلبات واستعادة الحساب.",
          fr: "Entrez votre nom complet, adresse email et créez un mot de passe (au moins 6 caractères). Vous pouvez aussi cliquer sur « Continuer avec Google » pour vous inscrire instantanément avec votre compte Google — sans mot de passe. Votre nom et email seront utilisés pour les notifications de commandes et la récupération du compte.",
        },
        image: "/docs/getting-started/create-account-2.svg",
      },
      {
        title: { en: "Access your dashboard", ar: "ادخل إلى لوحة التحكم", fr: "Accédez à votre tableau de bord" },
        description: {
          en: "After signing up, you'll be automatically redirected to your dashboard. This is your control center where you'll manage everything — products, orders, design, and settings. Your first step should be setting up your store details (name, currency, and description).",
          ar: "بعد التسجيل، سيتم توجيهك تلقائيًا إلى لوحة التحكم. هذا هو مركز التحكم الخاص بك حيث ستدير كل شيء — المنتجات والطلبات والتصميم والإعدادات. خطوتك الأولى يجب أن تكون إعداد تفاصيل متجرك (الاسم والعملة والوصف).",
          fr: "Après l'inscription, vous serez automatiquement redirigé vers votre tableau de bord. C'est votre centre de contrôle où vous gérerez tout — produits, commandes, design et paramètres. Votre première étape devrait être de configurer les détails de votre boutique (nom, devise et description).",
        },
        image: "/docs/getting-started/create-account-3.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Can I try Leadivo before subscribing?", ar: "هل يمكنني تجربة Leadivo قبل الاشتراك؟", fr: "Puis-je essayer Leadivo avant de m'abonner ?" },
        answer: { en: "Yes! Leadivo offers a 14-day free trial with full access to all features. You can create your store, add products, set up integrations, and start selling right away. After the trial, subscribe to the Pro plan to continue.", ar: "نعم! يوفر Leadivo فترة تجريبية مجانية لمدة 14 يومًا مع وصول كامل لجميع الميزات. يمكنك إنشاء متجرك وإضافة المنتجات وإعداد التكاملات والبدء في البيع فورًا. بعد الفترة التجريبية، اشترك في خطة Pro للاستمرار.", fr: "Oui ! Leadivo offre un essai gratuit de 14 jours avec accès complet à toutes les fonctionnalités. Vous pouvez créer votre boutique, ajouter des produits, configurer les intégrations et commencer à vendre immédiatement. Après l'essai, abonnez-vous au plan Pro pour continuer." },
      },
      {
        question: { en: "Can I sign up with my Google account?", ar: "هل يمكنني التسجيل بحساب جوجل؟", fr: "Puis-je m'inscrire avec mon compte Google ?" },
        answer: { en: "Yes, you can sign up instantly using your Google account by clicking the \"Continue with Google\" button on the registration page. No password is needed — your Google credentials are used securely.", ar: "نعم، يمكنك التسجيل فورًا باستخدام حسابك في جوجل بالنقر على زر \"المتابعة عبر جوجل\" في صفحة التسجيل. لا حاجة لكلمة مرور — يتم استخدام بيانات جوجل الخاصة بك بشكل آمن.", fr: "Oui, vous pouvez vous inscrire instantanément avec votre compte Google en cliquant sur le bouton « Continuer avec Google » sur la page d'inscription. Aucun mot de passe n'est nécessaire." },
      },
      {
        question: { en: "Can I change my email address later?", ar: "هل يمكنني تغيير بريدي الإلكتروني لاحقًا؟", fr: "Puis-je changer mon adresse email plus tard ?" },
        answer: { en: "Yes, you can update your email address at any time from the Settings page in your dashboard.", ar: "نعم، يمكنك تحديث بريدك الإلكتروني في أي وقت من صفحة الإعدادات في لوحة التحكم.", fr: "Oui, vous pouvez mettre à jour votre adresse email à tout moment depuis la page Paramètres de votre tableau de bord." },
      },
    ],
  },
  {
    slug: "setup-store",
    category: "getting-started",
    title: {
      en: "Setting up your store",
      ar: "إعداد متجرك",
      fr: "Configurer votre boutique",
    },
    description: {
      en: "Configure your store name, currency, and description.",
      ar: "اضبط اسم متجرك والعملة والوصف.",
      fr: "Configurez le nom, la devise et la description de votre boutique.",
    },
    steps: [
      {
        title: { en: "Navigate to Store settings", ar: "انتقل إلى إعدادات المتجر", fr: "Allez dans les paramètres de la boutique" },
        description: {
          en: "From the dashboard sidebar on the left, click \"Store\" to open your store settings page. This is where you configure all the basic information about your store that customers will see.",
          ar: "من الشريط الجانبي الأيسر في لوحة التحكم، انقر على \"المتجر\" لفتح صفحة إعدادات المتجر. هنا تقوم بضبط جميع المعلومات الأساسية عن متجرك التي سيراها العملاء.",
          fr: "Depuis la barre latérale gauche du tableau de bord, cliquez sur « Boutique » pour ouvrir la page des paramètres. C'est ici que vous configurez toutes les informations de base de votre boutique visibles par les clients.",
        },
        image: "/docs/getting-started/setup-store-1.svg",
      },
      {
        title: { en: "Fill in store details", ar: "أدخل تفاصيل المتجر", fr: "Remplissez les détails de la boutique" },
        description: {
          en: "Enter your store name (this appears in the header of your storefront). Choose a URL slug — this is the unique link customers will use to visit your store (e.g., leadivo.app/your-slug). Select your primary currency for product pricing. These are the core settings that define your store.",
          ar: "أدخل اسم المتجر (يظهر في رأس واجهة المتجر). اختر رابط URL — هذا هو الرابط الفريد الذي سيستخدمه العملاء لزيارة متجرك (مثلاً leadivo.app/رابطك). حدد العملة الرئيسية لتسعير المنتجات. هذه هي الإعدادات الأساسية التي تحدد متجرك.",
          fr: "Entrez le nom de votre boutique (il apparaît dans l'en-tête de votre vitrine). Choisissez un slug URL — c'est le lien unique que les clients utiliseront pour visiter votre boutique (ex : leadivo.app/votre-slug). Sélectionnez votre devise principale pour les prix. Ce sont les paramètres de base qui définissent votre boutique.",
        },
        image: "/docs/getting-started/setup-store-2.svg",
      },
      {
        title: { en: "Save your settings", ar: "احفظ إعداداتك", fr: "Enregistrez vos paramètres" },
        description: {
          en: "Click \"Create Store\" to save your settings. Your store is now configured and ready — the next step is adding your first products. You can always come back to this page to update your store details later using the \"Update Store\" button.",
          ar: "انقر على \"إنشاء المتجر\" لحفظ إعداداتك. متجرك الآن مُعد وجاهز — الخطوة التالية هي إضافة منتجاتك الأولى. يمكنك دائمًا العودة إلى هذه الصفحة لتحديث تفاصيل المتجر لاحقًا باستخدام زر \"تحديث المتجر\".",
          fr: "Cliquez sur « Créer la boutique » pour enregistrer vos paramètres. Votre boutique est maintenant configurée et prête — l'étape suivante est d'ajouter vos premiers produits. Vous pourrez toujours revenir sur cette page pour mettre à jour les détails avec le bouton « Mettre à jour ».",
        },
        image: "/docs/getting-started/setup-store-3.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Can I change my store name after creating it?", ar: "هل يمكنني تغيير اسم المتجر بعد إنشائه؟", fr: "Puis-je changer le nom de ma boutique après l'avoir créée ?" },
        answer: { en: "Yes, you can update your store name, slug, currency, language, and description at any time from the Store settings page. Changes are applied immediately after saving.", ar: "نعم، يمكنك تحديث اسم المتجر والرابط والعملة واللغة والوصف في أي وقت من صفحة إعدادات المتجر. تُطبق التغييرات فورًا بعد الحفظ.", fr: "Oui, vous pouvez modifier le nom, le slug, la devise, la langue et la description de votre boutique à tout moment. Les modifications sont appliquées immédiatement après l'enregistrement." },
      },
      {
        question: { en: "What currencies are supported?", ar: "ما العملات المدعومة؟", fr: "Quelles devises sont prises en charge ?" },
        answer: { en: "Leadivo supports a wide range of currencies including USD, EUR, GBP, DZD, MAD, TND, SAR, AED, EGP, and many more. You can also set up multiple markets to sell in different currencies simultaneously.", ar: "يدعم Leadivo مجموعة واسعة من العملات بما في ذلك USD وEUR وGBP وDZD وMAD وTND وSAR وAED وEGP وغيرها الكثير. يمكنك أيضًا إعداد أسواق متعددة للبيع بعملات مختلفة في نفس الوقت.", fr: "Leadivo prend en charge un large éventail de devises dont USD, EUR, GBP, DZD, MAD, TND, SAR, AED, EGP et bien d'autres. Vous pouvez aussi configurer plusieurs marchés pour vendre en différentes devises simultanément." },
      },
      {
        question: { en: "What languages can my storefront display?", ar: "ما اللغات التي يمكن لواجهة المتجر عرضها؟", fr: "Quelles langues ma vitrine peut-elle afficher ?" },
        answer: { en: "Your storefront supports 20 languages including English, Arabic (with RTL support), French, Spanish, Portuguese, German, Italian, Dutch, Turkish, Russian, Chinese, Japanese, Korean, Hindi, Indonesian, Malay, Polish, Swedish, Thai, and Vietnamese.", ar: "تدعم واجهة متجرك 20 لغة بما في ذلك الإنجليزية والعربية (مع دعم RTL) والفرنسية والإسبانية والبرتغالية والألمانية والإيطالية والهولندية والتركية والروسية والصينية واليابانية والكورية والهندية والإندونيسية والماليزية والبولندية والسويدية والتايلاندية والفيتنامية.", fr: "Votre vitrine prend en charge 20 langues dont l'anglais, l'arabe (avec support RTL), le français, l'espagnol, le portugais, l'allemand, l'italien, le néerlandais, le turc, le russe, le chinois, le japonais, le coréen, le hindi, l'indonésien, le malais, le polonais, le suédois, le thaïlandais et le vietnamien." },
      },
    ],
  },
  {
    slug: "publish-store",
    category: "getting-started",
    title: {
      en: "Publishing your store",
      ar: "نشر متجرك",
      fr: "Publier votre boutique",
    },
    description: {
      en: "Make your store live and accessible to customers.",
      ar: "اجعل متجرك مباشرًا ومتاحًا للعملاء.",
      fr: "Rendez votre boutique accessible aux clients.",
    },
    steps: [
      {
        title: { en: "Go to Store settings", ar: "انتقل إلى إعدادات المتجر", fr: "Allez dans les paramètres de la boutique" },
        description: {
          en: "Open the Store page from the dashboard sidebar. Make sure you have already added at least one product and configured your store details before publishing.",
          ar: "افتح صفحة المتجر من الشريط الجانبي. تأكد من أنك أضفت منتجًا واحدًا على الأقل وضبطت تفاصيل المتجر قبل النشر.",
          fr: "Ouvrez la page Boutique depuis la barre latérale. Assurez-vous d'avoir ajouté au moins un produit et configuré les détails de votre boutique avant de publier.",
        },
      },
      {
        title: { en: "Set your store to Published", ar: "اجعل متجرك منشوراً", fr: "Mettez votre boutique en Publié" },
        description: {
          en: "At the top of the Store page, next to the page title, you'll see a status dropdown. Click it and change it from \"Draft\" to \"Published\". Your store will immediately become visible to anyone with the link. You can share your store URL with customers via social media, WhatsApp, or any other channel. You can switch back to \"Draft\" at any time to hide your store.",
          ar: "في أعلى صفحة المتجر، بجوار عنوان الصفحة، سترى قائمة منسدلة للحالة. انقر عليها وغيّرها من \"مسودة\" إلى \"منشور\". سيصبح متجرك مرئيًا فورًا لأي شخص لديه الرابط. يمكنك مشاركة رابط متجرك مع العملاء عبر وسائل التواصل الاجتماعي أو واتساب أو أي قناة أخرى. يمكنك التبديل إلى \"مسودة\" في أي وقت لإخفاء متجرك.",
          fr: "En haut de la page Boutique, à côté du titre, vous verrez un menu déroulant de statut. Cliquez dessus et changez-le de « Brouillon » à « Publié ». Votre boutique deviendra immédiatement visible pour toute personne ayant le lien. Vous pouvez partager l'URL de votre boutique via les réseaux sociaux, WhatsApp ou tout autre canal. Vous pouvez repasser en « Brouillon » à tout moment pour masquer votre boutique.",
        },
        image: "/docs/getting-started/publish-store-1.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Can customers see my store before I publish it?", ar: "هل يمكن للعملاء رؤية متجري قبل نشره؟", fr: "Les clients peuvent-ils voir ma boutique avant que je la publie ?" },
        answer: { en: "No. While your store is unpublished, visiting its URL will show a \"Store not found\" page. Only after you toggle the Published switch will your store be accessible to customers.", ar: "لا. أثناء إلغاء نشر متجرك، زيارة رابطه ستعرض صفحة \"المتجر غير موجود\". فقط بعد تفعيل زر النشر سيكون متجرك متاحًا للعملاء.", fr: "Non. Tant que votre boutique n'est pas publiée, son URL affichera une page « Boutique non trouvée ». Ce n'est qu'après avoir activé le bouton Publier que votre boutique sera accessible aux clients." },
      },
      {
        question: { en: "Can I unpublish my store temporarily?", ar: "هل يمكنني إلغاء نشر متجري مؤقتًا؟", fr: "Puis-je dépublier ma boutique temporairement ?" },
        answer: { en: "Yes, you can toggle the Published switch off at any time. This will hide your store from customers without deleting any of your data, products, or orders. Turn it back on whenever you're ready.", ar: "نعم، يمكنك إيقاف زر النشر في أي وقت. سيؤدي ذلك إلى إخفاء متجرك عن العملاء دون حذف أي من بياناتك أو منتجاتك أو طلباتك. أعد تفعيله عندما تكون جاهزًا.", fr: "Oui, vous pouvez désactiver le bouton Publier à tout moment. Cela masquera votre boutique sans supprimer vos données, produits ou commandes. Réactivez-le quand vous êtes prêt." },
      },
    ],
  },

  // ── Store ────────────────────────────────────────────────────────────
  {
    slug: "store-settings",
    category: "store",
    title: {
      en: "Managing store settings",
      ar: "إدارة إعدادات المتجر",
      fr: "Gérer les paramètres de la boutique",
    },
    description: {
      en: "Update your store name, URL slug, and currency.",
      ar: "حدّث اسم متجرك ورابط URL والعملة.",
      fr: "Mettez à jour le nom, le slug URL et la devise de votre boutique.",
    },
    steps: [
      {
        title: { en: "Open Store page", ar: "افتح صفحة المتجر", fr: "Ouvrez la page Boutique" },
        description: {
          en: "Click \"Store\" in the sidebar to access all store settings. This page is your central hub for managing how your store appears to customers — including its name, branding, and contact details.",
          ar: "انقر على \"المتجر\" في الشريط الجانبي للوصول إلى جميع إعدادات المتجر. هذه الصفحة هي مركزك الرئيسي لإدارة كيفية ظهور متجرك للعملاء — بما في ذلك الاسم والعلامة التجارية ومعلومات الاتصال.",
          fr: "Cliquez sur « Boutique » dans la barre latérale pour accéder à tous les paramètres. Cette page est votre centre de gestion pour contrôler l'apparence de votre boutique — nom, image de marque et coordonnées.",
        },
        image: "/docs/store/store-settings-1.svg",
      },
      {
        title: { en: "Edit your information", ar: "عدّل معلوماتك", fr: "Modifiez vos informations" },
        description: {
          en: "Here you can update: Store name (displayed in the header and browser tab), URL slug (the unique link to your store), and currency (used for all product prices). The custom domain section below lets you connect your own domain. For visual customization like logos, colors, and fonts, head to the Design page. Click \"Update Store\" after making changes.",
          ar: "هنا يمكنك تحديث: اسم المتجر (يظهر في الرأس وعلامة التبويب)، رابط URL (الرابط الفريد لمتجرك)، والعملة (تُستخدم لجميع أسعار المنتجات). قسم النطاق المخصص أدناه يتيح لك ربط نطاقك الخاص. للتخصيص المرئي مثل الشعارات والألوان والخطوط، انتقل إلى صفحة التصميم. انقر على \"تحديث المتجر\" بعد إجراء التغييرات.",
          fr: "Ici vous pouvez mettre à jour : le nom de la boutique (affiché dans l'en-tête et l'onglet), le slug URL (le lien unique vers votre boutique) et la devise (utilisée pour tous les prix). La section domaine personnalisé ci-dessous vous permet de connecter votre propre domaine. Pour la personnalisation visuelle comme les logos, couleurs et polices, rendez-vous sur la page Design. Cliquez sur « Mettre à jour » après vos modifications.",
        },
        image: "/docs/store/store-settings-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Will changing my store slug break existing links?", ar: "هل سيؤدي تغيير رابط المتجر إلى كسر الروابط الحالية؟", fr: "Changer mon slug de boutique va-t-il casser les liens existants ?" },
        answer: { en: "Yes, changing your URL slug will update your store's link. Any previously shared links using the old slug will stop working. Make sure to update your links on social media and marketing materials after changing the slug.", ar: "نعم، تغيير رابط URL سيحدّث رابط متجرك. أي روابط تمت مشاركتها سابقًا باستخدام الرابط القديم ستتوقف عن العمل. تأكد من تحديث روابطك على وسائل التواصل الاجتماعي ومواد التسويق بعد تغيير الرابط.", fr: "Oui, changer votre slug URL mettra à jour le lien de votre boutique. Les anciens liens partagés ne fonctionneront plus. Pensez à mettre à jour vos liens sur les réseaux sociaux et supports marketing." },
      },
      {
        question: { en: "Can I upload a store logo?", ar: "هل يمكنني رفع شعار للمتجر؟", fr: "Puis-je télécharger un logo de boutique ?" },
        answer: { en: "Yes, you can upload a store logo and banner from the Design page. Go to Design in the sidebar and look for the Branding section where you can upload your logo and customize your store's visual identity.", ar: "نعم، يمكنك رفع شعار وبانر للمتجر من صفحة التصميم. انتقل إلى التصميم في الشريط الجانبي وابحث عن قسم العلامة التجارية حيث يمكنك رفع شعارك وتخصيص الهوية البصرية لمتجرك.", fr: "Oui, vous pouvez télécharger un logo et une bannière depuis la page Design. Allez dans Design dans la barre latérale et cherchez la section Marque où vous pouvez télécharger votre logo et personnaliser l'identité visuelle de votre boutique." },
      },
    ],
  },
  {
    slug: "custom-domain",
    category: "store",
    title: {
      en: "Connecting a custom domain",
      ar: "ربط نطاق مخصص",
      fr: "Connecter un domaine personnalisé",
    },
    description: {
      en: "Use your own domain name for your store.",
      ar: "استخدم اسم نطاقك الخاص لمتجرك.",
      fr: "Utilisez votre propre nom de domaine pour votre boutique.",
    },
    steps: [
      {
        title: { en: "Go to Store page", ar: "انتقل إلى صفحة المتجر", fr: "Allez sur la page Boutique" },
        description: {
          en: "Navigate to Store from the sidebar and scroll down below the store settings form to find the \"Custom Domain\" section. A custom domain lets customers visit your store using your own brand name (e.g., shop.yourbrand.com) instead of the default leadivo.app link.",
          ar: "انتقل إلى المتجر من الشريط الجانبي وانزل للأسفل أسفل نموذج إعدادات المتجر للعثور على قسم \"النطاق المخصص\". النطاق المخصص يتيح للعملاء زيارة متجرك باستخدام اسم علامتك التجارية (مثلاً shop.yourbrand.com) بدلاً من رابط leadivo.app الافتراضي.",
          fr: "Allez dans Boutique depuis la barre latérale et descendez sous le formulaire des paramètres pour trouver la section « Domaine personnalisé ». Un domaine personnalisé permet à vos clients de visiter votre boutique avec votre propre nom de marque (ex : shop.votrebrand.com) au lieu du lien leadivo.app par défaut.",
        },
        image: "/docs/store/custom-domain-1.svg",
      },
      {
        title: { en: "Enter your domain", ar: "أدخل نطاقك", fr: "Entrez votre domaine" },
        description: {
          en: "Type your domain name in the field (e.g., shop.yourbrand.com) and click \"Save Domain\". You'll need to add a CNAME record in your domain registrar's DNS settings pointing to leadivo.app. DNS changes can take up to 24 hours to propagate, so your domain may not work immediately.",
          ar: "اكتب اسم نطاقك في الحقل (مثلاً shop.yourbrand.com) وانقر \"حفظ النطاق\". ستحتاج إلى إضافة سجل CNAME في إعدادات DNS لمسجّل النطاق الخاص بك يشير إلى leadivo.app. قد تستغرق تغييرات DNS حتى 24 ساعة للانتشار، لذا قد لا يعمل نطاقك فورًا.",
          fr: "Tapez votre nom de domaine dans le champ (ex : shop.votrebrand.com) et cliquez sur « Enregistrer le domaine ». Vous devrez ajouter un enregistrement CNAME dans les paramètres DNS de votre registraire de domaine pointant vers leadivo.app. Les changements DNS peuvent prendre jusqu'à 24 heures pour se propager, donc votre domaine peut ne pas fonctionner immédiatement.",
        },
        image: "/docs/store/custom-domain-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What type of DNS record do I need?", ar: "ما نوع سجل DNS الذي أحتاجه؟", fr: "Quel type d'enregistrement DNS dois-je utiliser ?" },
        answer: { en: "You need to add a CNAME record pointing your custom domain (e.g., shop.yourbrand.com) to leadivo.app. This is done in your domain registrar's DNS settings (GoDaddy, Namecheap, Cloudflare, etc.).", ar: "تحتاج إلى إضافة سجل CNAME يوجه نطاقك المخصص (مثلاً shop.yourbrand.com) إلى leadivo.app. يتم ذلك في إعدادات DNS لمسجّل النطاق الخاص بك (GoDaddy، Namecheap، Cloudflare، إلخ).", fr: "Vous devez ajouter un enregistrement CNAME pointant votre domaine personnalisé (ex : shop.votrebrand.com) vers leadivo.app. Cela se fait dans les paramètres DNS de votre registraire (GoDaddy, Namecheap, Cloudflare, etc.)." },
      },
      {
        question: { en: "How long does DNS propagation take?", ar: "كم يستغرق انتشار DNS؟", fr: "Combien de temps prend la propagation DNS ?" },
        answer: { en: "DNS changes can take anywhere from a few minutes to 24 hours to propagate worldwide. Most changes are visible within 1-2 hours. During this time, your custom domain may not work immediately.", ar: "يمكن أن تستغرق تغييرات DNS من بضع دقائق إلى 24 ساعة للانتشار عالميًا. معظم التغييرات تكون مرئية خلال 1-2 ساعة. خلال هذا الوقت، قد لا يعمل نطاقك المخصص فورًا.", fr: "Les changements DNS peuvent prendre de quelques minutes à 24 heures pour se propager. La plupart des changements sont visibles en 1-2 heures. Pendant ce temps, votre domaine personnalisé peut ne pas fonctionner immédiatement." },
      },
      {
        question: { en: "When can I connect a custom domain?", ar: "متى يمكنني ربط نطاق مخصص؟", fr: "Quand puis-je connecter un domaine personnalisé ?" },
        answer: { en: "You can connect a custom domain as part of your Pro subscription. During your 14-day free trial, you have full access to this feature so you can set everything up before going live.", ar: "يمكنك ربط نطاق مخصص كجزء من اشتراك Pro. خلال الفترة التجريبية المجانية لمدة 14 يومًا، لديك وصول كامل لهذه الميزة حتى تتمكن من إعداد كل شيء قبل الإطلاق.", fr: "Vous pouvez connecter un domaine personnalisé dans le cadre de votre abonnement Pro. Pendant votre essai gratuit de 14 jours, vous avez accès complet à cette fonctionnalité pour tout configurer avant le lancement." },
      },
    ],
  },

  // ── Design ───────────────────────────────────────────────────────────
  {
    slug: "customize-theme",
    category: "design",
    title: {
      en: "Customizing your store theme",
      ar: "تخصيص مظهر متجرك",
      fr: "Personnaliser le thème de votre boutique",
    },
    description: {
      en: "Change the overall look and feel of your storefront.",
      ar: "غيّر المظهر العام لواجهة متجرك.",
      fr: "Changez l'apparence générale de votre vitrine.",
    },
    steps: [
      {
        title: { en: "Open the Design page", ar: "افتح صفحة التصميم", fr: "Ouvrez la page Design" },
        description: {
          en: "Click \"Design\" in the sidebar to open the theme editor. This is where you control how your storefront looks to customers — colors, fonts, and overall visual style.",
          ar: "انقر على \"التصميم\" في الشريط الجانبي لفتح محرر المظهر. هنا تتحكم في مظهر واجهة متجرك للعملاء — الألوان والخطوط والنمط البصري العام.",
          fr: "Cliquez sur « Design » dans la barre latérale pour ouvrir l'éditeur de thème. C'est ici que vous contrôlez l'apparence de votre vitrine — couleurs, polices et style visuel général.",
        },
        image: "/docs/design/customize-theme-1.svg",
      },
      {
        title: { en: "Choose your colors", ar: "اختر ألوانك", fr: "Choisissez vos couleurs" },
        description: {
          en: "Pick a primary accent color that matches your brand. This color will be applied across your entire storefront — buttons, links, badges, and highlighted elements. Choose a color that contrasts well with white backgrounds for the best readability. You can click the color picker or enter a hex code directly.",
          ar: "اختر لونًا أساسيًا يتناسب مع علامتك التجارية. سيُطبق هذا اللون على كامل واجهة متجرك — الأزرار والروابط والشارات والعناصر المميزة. اختر لونًا يتباين جيدًا مع الخلفيات البيضاء لأفضل قراءة. يمكنك النقر على منتقي الألوان أو إدخال كود hex مباشرةً.",
          fr: "Choisissez une couleur d'accent qui correspond à votre marque. Elle sera appliquée sur toute votre vitrine — boutons, liens, badges et éléments mis en avant. Choisissez une couleur qui contraste bien avec les fonds blancs pour une meilleure lisibilité. Vous pouvez utiliser le sélecteur de couleurs ou entrer un code hex directement.",
        },
        image: "/docs/design/customize-theme-2.svg",
      },
      {
        title: { en: "Preview and save", ar: "معاينة وحفظ", fr: "Prévisualisez et enregistrez" },
        description: {
          en: "Your changes are previewed in real-time as you make them, so you can see exactly how your store will look before saving. Once you're happy with the design, click \"Save\" to apply the changes to your live store. Customers will see the updated design immediately.",
          ar: "تُعاين تغييراتك في الوقت الفعلي أثناء إجرائها، حتى ترى بالضبط كيف سيبدو متجرك قبل الحفظ. بمجرد رضاك عن التصميم، انقر \"حفظ\" لتطبيق التغييرات على متجرك المباشر. سيرى العملاء التصميم المحدث فورًا.",
          fr: "Vos modifications sont prévisualisées en temps réel, vous pouvez donc voir exactement à quoi ressemblera votre boutique avant d'enregistrer. Une fois satisfait du design, cliquez sur « Enregistrer » pour appliquer les changements. Les clients verront le nouveau design immédiatement.",
        },
        image: "/docs/design/customize-theme-3.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What design options can I customize?", ar: "ما خيارات التصميم التي يمكنني تخصيصها؟", fr: "Quelles options de design puis-je personnaliser ?" },
        answer: { en: "You can customize colors (18 presets or custom), fonts (80+ Google Fonts), border radius, button styles (filled, outline, pill), button sizes, card shadow intensity, product image ratio (square, portrait, landscape), layout spacing (compact, normal, spacious), and toggle dark mode support.", ar: "يمكنك تخصيص الألوان (18 نمط مسبق أو مخصص)، الخطوط (80+ خط من Google Fonts)، نصف قطر الحدود، أنماط الأزرار (ممتلئ، محيط، حبة)، أحجام الأزرار، شدة ظل البطاقات، نسبة صور المنتجات (مربع، عمودي، أفقي)، تباعد التخطيط (مضغوط، عادي، فسيح)، ودعم الوضع الداكن.", fr: "Vous pouvez personnaliser les couleurs (18 préréglages ou personnalisé), les polices (80+ Google Fonts), le rayon des bordures, les styles de boutons (rempli, contour, pilule), les tailles de boutons, l'intensité des ombres, le ratio d'images produits (carré, portrait, paysage), l'espacement (compact, normal, spacieux) et le mode sombre." },
      },
      {
        question: { en: "Can I preview changes before saving?", ar: "هل يمكنني معاينة التغييرات قبل الحفظ؟", fr: "Puis-je prévisualiser les changements avant d'enregistrer ?" },
        answer: { en: "Yes, the design editor includes a live preview that updates in real-time as you make changes. You can preview both desktop and mobile views before saving.", ar: "نعم، يتضمن محرر التصميم معاينة حية تتحدث في الوقت الفعلي أثناء إجراء التغييرات. يمكنك معاينة عرض سطح المكتب والجوال قبل الحفظ.", fr: "Oui, l'éditeur de design inclut un aperçu en direct qui se met à jour en temps réel. Vous pouvez prévisualiser les vues bureau et mobile avant d'enregistrer." },
      },
      {
        question: { en: "Does my store support dark mode?", ar: "هل يدعم متجري الوضع الداكن؟", fr: "Ma boutique supporte-t-elle le mode sombre ?" },
        answer: { en: "Yes, Leadivo storefronts have built-in dark mode support. Customers can toggle between light and dark mode when browsing your store.", ar: "نعم، واجهات متاجر Leadivo تدعم الوضع الداكن مدمجًا. يمكن للعملاء التبديل بين الوضع الفاتح والداكن عند تصفح متجرك.", fr: "Oui, les vitrines Leadivo ont un support intégré du mode sombre. Les clients peuvent basculer entre le mode clair et sombre en naviguant dans votre boutique." },
      },
    ],
  },

  // ── Products ─────────────────────────────────────────────────────────
  {
    slug: "add-product",
    category: "products",
    title: {
      en: "Adding a new product",
      ar: "إضافة منتج جديد",
      fr: "Ajouter un nouveau produit",
    },
    description: {
      en: "Create a product with images, pricing, and details.",
      ar: "أنشئ منتجًا بالصور والأسعار والتفاصيل.",
      fr: "Créez un produit avec images, prix et détails.",
    },
    steps: [
      {
        title: { en: "Go to Products", ar: "انتقل إلى المنتجات", fr: "Allez dans Produits" },
        description: {
          en: "Click \"Products\" in the sidebar to see your product list, then click the \"Add Product\" button in the top-right corner. If this is your first product, the page will be empty — that's normal.",
          ar: "انقر على \"المنتجات\" في الشريط الجانبي لرؤية قائمة منتجاتك، ثم انقر على زر \"إضافة منتج\" في الزاوية العلوية اليمنى. إذا كان هذا أول منتج لك، ستكون الصفحة فارغة — هذا طبيعي.",
          fr: "Cliquez sur « Produits » dans la barre latérale pour voir votre liste de produits, puis cliquez sur « Ajouter un produit » en haut à droite. Si c'est votre premier produit, la page sera vide — c'est normal.",
        },
        image: "/docs/products/add-product-1.svg",
      },
      {
        title: { en: "Fill in product details", ar: "أدخل تفاصيل المنتج", fr: "Remplissez les détails du produit" },
        description: {
          en: "Enter the product name and a description that helps customers understand what they're buying. Add an optional SKU for your own tracking. Set the selling price, and optionally a \"compare-at\" price (the original price before discount — it will be shown crossed out next to the actual price). Toggle stock tracking on and set the quantity if you want to track inventory.",
          ar: "أدخل اسم المنتج ووصفًا يساعد العملاء على فهم ما يشترونه. أضف رمز SKU اختياري لتتبعك الخاص. حدد سعر البيع، واختياريًا \"سعر المقارنة\" (السعر الأصلي قبل الخصم — سيظهر مشطوبًا بجانب السعر الفعلي). فعّل تتبع المخزون وحدد الكمية إذا كنت تريد تتبع المخزون.",
          fr: "Entrez le nom du produit et une description qui aide les clients à comprendre ce qu'ils achètent. Ajoutez un SKU optionnel pour votre propre suivi. Définissez le prix de vente, et optionnellement un « prix barré » (le prix original avant réduction — il sera affiché barré à côté du prix réel). Activez le suivi de stock et définissez la quantité si vous souhaitez suivre l'inventaire.",
        },
        image: "/docs/products/add-product-2.svg",
      },
      {
        title: { en: "Upload images", ar: "ارفع الصور", fr: "Téléchargez les images" },
        description: {
          en: "Drag and drop images onto the upload area, or click it to browse your files. You can upload multiple images — the first one will be used as the main product image that customers see when browsing your store. Use high-quality, well-lit photos for the best results. Recommended size is at least 800x800 pixels.",
          ar: "اسحب وأفلت الصور في منطقة الرفع، أو انقر عليها لتصفح ملفاتك. يمكنك رفع صور متعددة — ستُستخدم الأولى كصورة رئيسية للمنتج التي يراها العملاء عند تصفح متجرك. استخدم صورًا عالية الجودة وجيدة الإضاءة لأفضل النتائج. الحجم الموصى به 800×800 بيكسل على الأقل.",
          fr: "Glissez-déposez les images sur la zone de téléchargement, ou cliquez dessus pour parcourir vos fichiers. Vous pouvez télécharger plusieurs images — la première sera utilisée comme image principale visible lors de la navigation. Utilisez des photos de haute qualité et bien éclairées. La taille recommandée est d'au moins 800x800 pixels.",
        },
        image: "/docs/products/add-product-3.svg",
      },
      {
        title: { en: "Save the product", ar: "احفظ المنتج", fr: "Enregistrez le produit" },
        description: {
          en: "Click \"Create Product\" to save your new product. It will appear on your storefront once your store is published. You can edit the product anytime by clicking on it from the Products list. Products are set to active by default — toggle the status off if you want to hide a product temporarily.",
          ar: "انقر على \"إنشاء المنتج\" لحفظ منتجك الجديد. سيظهر في واجهة متجرك بمجرد نشر المتجر. يمكنك تعديل المنتج في أي وقت بالنقر عليه من قائمة المنتجات. المنتجات تكون مفعّلة افتراضيًا — أوقف الحالة إذا أردت إخفاء منتج مؤقتًا.",
          fr: "Cliquez sur « Créer le produit » pour enregistrer. Il apparaîtra sur votre vitrine une fois la boutique publiée. Vous pouvez modifier le produit à tout moment en cliquant dessus depuis la liste. Les produits sont actifs par défaut — désactivez le statut si vous voulez masquer un produit temporairement.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What is the maximum stock I can set?", ar: "ما هو الحد الأقصى للمخزون الذي يمكنني تحديده؟", fr: "Quel est le stock maximum que je peux définir ?" },
        answer: { en: "The maximum stock quantity per product or variant is 1,000 units. If you need to track larger quantities, you can manage inventory externally and update stock levels in Leadivo as needed.", ar: "الحد الأقصى لكمية المخزون لكل منتج أو متغير هو 1,000 وحدة. إذا كنت بحاجة لتتبع كميات أكبر، يمكنك إدارة المخزون خارجيًا وتحديث مستويات المخزون في Leadivo حسب الحاجة.", fr: "La quantité maximale de stock par produit ou variante est de 1 000 unités. Si vous avez besoin de suivre de plus grandes quantités, vous pouvez gérer l'inventaire en externe et mettre à jour les niveaux de stock dans Leadivo." },
      },
      {
        question: { en: "What is the compare-at price?", ar: "ما هو سعر المقارنة؟", fr: "Qu'est-ce que le prix barré ?" },
        answer: { en: "The compare-at price is the original price before a discount. When set, it appears crossed out next to the selling price on your storefront, showing customers they're getting a deal. Leave it empty if the product isn't on sale.", ar: "سعر المقارنة هو السعر الأصلي قبل الخصم. عند تحديده، يظهر مشطوبًا بجانب سعر البيع في واجهة المتجر، مما يُظهر للعملاء أنهم يحصلون على صفقة. اتركه فارغًا إذا لم يكن المنتج في تخفيض.", fr: "Le prix barré est le prix original avant réduction. Lorsqu'il est défini, il apparaît barré à côté du prix de vente, montrant aux clients qu'ils font une bonne affaire. Laissez-le vide si le produit n'est pas en promotion." },
      },
      {
        question: { en: "Can I delete products in bulk?", ar: "هل يمكنني حذف المنتجات بالجملة؟", fr: "Puis-je supprimer des produits en masse ?" },
        answer: { en: "Yes, you can select multiple products using the checkboxes on the Products page and use the bulk actions menu to delete or change their status (active/draft) all at once.", ar: "نعم، يمكنك تحديد عدة منتجات باستخدام مربعات الاختيار في صفحة المنتجات واستخدام قائمة الإجراءات الجماعية لحذفها أو تغيير حالتها (نشط/مسودة) دفعة واحدة.", fr: "Oui, vous pouvez sélectionner plusieurs produits avec les cases à cocher et utiliser le menu d'actions groupées pour les supprimer ou changer leur statut (actif/brouillon) en une seule fois." },
      },
      {
        question: { en: "What image size should I use for products?", ar: "ما حجم الصورة الذي يجب استخدامه للمنتجات؟", fr: "Quelle taille d'image dois-je utiliser pour les produits ?" },
        answer: { en: "We recommend at least 800x800 pixels for product images. Use high-quality, well-lit photos. The first image uploaded will be used as the main product image shown in grids and search results.", ar: "نوصي بحد أدنى 800×800 بيكسل لصور المنتجات. استخدم صورًا عالية الجودة وجيدة الإضاءة. ستُستخدم أول صورة يتم رفعها كصورة رئيسية للمنتج تظهر في الشبكات ونتائج البحث.", fr: "Nous recommandons au moins 800x800 pixels pour les images de produits. Utilisez des photos de haute qualité et bien éclairées. La première image téléchargée sera l'image principale visible dans les grilles et résultats de recherche." },
      },
    ],
  },
  {
    slug: "product-variants",
    category: "products",
    title: {
      en: "Managing product variants",
      ar: "إدارة متغيرات المنتج",
      fr: "Gérer les variantes de produit",
    },
    description: {
      en: "Add size, color, or other options to your products.",
      ar: "أضف المقاس واللون أو خيارات أخرى لمنتجاتك.",
      fr: "Ajoutez des tailles, couleurs ou autres options à vos produits.",
    },
    steps: [
      {
        title: { en: "Edit your product", ar: "عدّل منتجك", fr: "Modifiez votre produit" },
        description: {
          en: "Go to Products in the sidebar and click on the product you want to add variants to. You can add variants to both new and existing products. Variants are useful when a product comes in different sizes, colors, or materials.",
          ar: "انتقل إلى المنتجات في الشريط الجانبي وانقر على المنتج الذي تريد إضافة متغيرات إليه. يمكنك إضافة متغيرات للمنتجات الجديدة والحالية. المتغيرات مفيدة عندما يأتي المنتج بمقاسات أو ألوان أو خامات مختلفة.",
          fr: "Allez dans Produits dans la barre latérale et cliquez sur le produit auquel vous voulez ajouter des variantes. Vous pouvez ajouter des variantes aux produits nouveaux et existants. Les variantes sont utiles quand un produit existe en différentes tailles, couleurs ou matériaux.",
        },
      },
      {
        title: { en: "Add options", ar: "أضف الخيارات", fr: "Ajoutez des options" },
        description: {
          en: "Scroll down to the Options section and click \"Add Option\". Give your option a name (e.g., \"Size\", \"Color\", \"Material\") and enter the available values separated by pressing Enter (e.g., S, M, L, XL). You can add multiple option types — for example, both Size and Color. The system will automatically generate all possible combinations.",
          ar: "انزل لأسفل إلى قسم الخيارات وانقر على \"إضافة خيار\". أعطِ الخيار اسمًا (مثلاً \"المقاس\"، \"اللون\"، \"الخامة\") وأدخل القيم المتاحة بالضغط على Enter بين كل قيمة (مثلاً S, M, L, XL). يمكنك إضافة أنواع خيارات متعددة — مثلاً المقاس واللون معًا. سيقوم النظام تلقائيًا بإنشاء جميع التركيبات الممكنة.",
          fr: "Descendez jusqu'à la section Options et cliquez sur « Ajouter une option ». Donnez un nom à votre option (ex : « Taille », « Couleur », « Matière ») et entrez les valeurs disponibles en appuyant sur Entrée (ex : S, M, L, XL). Vous pouvez ajouter plusieurs types d'options — par exemple, Taille et Couleur. Le système générera automatiquement toutes les combinaisons possibles.",
        },
        image: "/docs/products/product-variants-1.svg",
      },
      {
        title: { en: "Set variant prices and stock", ar: "حدد أسعار ومخزون المتغيرات", fr: "Définissez les prix et stocks des variantes" },
        description: {
          en: "Each variant combination gets its own row in the variants table below the options. You can set a different price and stock quantity for each variant. For example, an XL shirt might cost more than an S. If you leave a variant's price empty, it will use the product's base price. Remember to click \"Save\" when you're done editing variants.",
          ar: "كل مزيج متغيرات يحصل على صف خاص في جدول المتغيرات أسفل الخيارات. يمكنك تحديد سعر وكمية مخزون مختلفة لكل متغير. مثلاً، قميص XL قد يكلف أكثر من قميص S. إذا تركت سعر متغير فارغًا، سيستخدم السعر الأساسي للمنتج. تذكر النقر على \"حفظ\" عند الانتهاء من تعديل المتغيرات.",
          fr: "Chaque combinaison de variantes a sa propre ligne dans le tableau des variantes sous les options. Vous pouvez définir un prix et une quantité de stock différents pour chaque variante. Par exemple, un t-shirt XL pourrait coûter plus qu'un S. Si vous laissez le prix d'une variante vide, il utilisera le prix de base du produit. N'oubliez pas de cliquer sur « Enregistrer » après avoir modifié les variantes.",
        },
        image: "/docs/products/product-variants-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "How many variant options can I add?", ar: "كم عدد خيارات المتغيرات التي يمكنني إضافتها؟", fr: "Combien d'options de variantes puis-je ajouter ?" },
        answer: { en: "You can add multiple option types (e.g., Size, Color, Material) with as many values as you need. The system automatically generates all possible combinations. Each combination becomes its own variant with individual price, stock, and SKU.", ar: "يمكنك إضافة أنواع خيارات متعددة (مثلاً المقاس، اللون، الخامة) بأي عدد من القيم. يقوم النظام تلقائيًا بإنشاء جميع التركيبات الممكنة. كل تركيبة تصبح متغيرًا خاصًا بسعر ومخزون ورمز SKU فردي.", fr: "Vous pouvez ajouter plusieurs types d'options (ex : Taille, Couleur, Matière) avec autant de valeurs que nécessaire. Le système génère automatiquement toutes les combinaisons possibles. Chaque combinaison devient une variante avec son propre prix, stock et SKU." },
      },
      {
        question: { en: "What happens if I leave a variant price empty?", ar: "ماذا يحدث إذا تركت سعر المتغير فارغًا؟", fr: "Que se passe-t-il si je laisse le prix d'une variante vide ?" },
        answer: { en: "If you leave a variant's price empty, it will automatically use the product's base price. This is convenient when most variants share the same price and only a few need different pricing.", ar: "إذا تركت سعر المتغير فارغًا، سيستخدم تلقائيًا السعر الأساسي للمنتج. هذا مناسب عندما تشترك معظم المتغيرات في نفس السعر ويحتاج القليل منها فقط لتسعير مختلف.", fr: "Si vous laissez le prix d'une variante vide, il utilisera automatiquement le prix de base du produit. C'est pratique quand la plupart des variantes partagent le même prix et que seules quelques-unes nécessitent un prix différent." },
      },
      {
        question: { en: "Can I disable a specific variant without deleting it?", ar: "هل يمكنني تعطيل متغير محدد دون حذفه؟", fr: "Puis-je désactiver une variante sans la supprimer ?" },
        answer: { en: "Yes, each variant has an availability toggle. Turning it off hides that specific variant from customers while keeping the other variants visible. This is useful for temporarily out-of-stock sizes or colors.", ar: "نعم، كل متغير لديه زر توفر. إيقافه يخفي ذلك المتغير المحدد عن العملاء مع الحفاظ على ظهور المتغيرات الأخرى. هذا مفيد للمقاسات أو الألوان غير المتوفرة مؤقتًا.", fr: "Oui, chaque variante a un bouton de disponibilité. Le désactiver masque cette variante spécifique tout en gardant les autres visibles. C'est utile pour les tailles ou couleurs temporairement en rupture de stock." },
      },
    ],
  },
  {
    slug: "product-faqs",
    category: "products",
    title: {
      en: "Adding FAQs to products",
      ar: "إضافة الأسئلة الشائعة للمنتجات",
      fr: "Ajouter des FAQ aux produits",
    },
    description: {
      en: "Add frequently asked questions to your products to help customers and boost SEO.",
      ar: "أضف أسئلة شائعة لمنتجاتك لمساعدة العملاء وتحسين محركات البحث.",
      fr: "Ajoutez des questions fréquentes à vos produits pour aider vos clients et améliorer le SEO.",
    },
    steps: [
      {
        title: { en: "Open the product editor", ar: "افتح محرر المنتج", fr: "Ouvrez l'éditeur de produit" },
        description: {
          en: "Go to Products in the sidebar and click on any product to edit it, or create a new product. Scroll down to the \"Product FAQs\" section — you'll see it between the stock settings and product options.",
          ar: "انتقل إلى المنتجات في الشريط الجانبي وانقر على أي منتج لتعديله، أو أنشئ منتجاً جديداً. انزل لأسفل إلى قسم \"الأسئلة الشائعة للمنتج\" — ستجده بين إعدادات المخزون وخيارات المنتج.",
          fr: "Allez dans Produits dans la barre latérale et cliquez sur un produit pour le modifier, ou créez un nouveau produit. Descendez jusqu'à la section « FAQ du produit » — elle se trouve entre les paramètres de stock et les options produit.",
        },
      },
      {
        title: { en: "Add questions and answers", ar: "أضف الأسئلة والإجابات", fr: "Ajoutez des questions et réponses" },
        description: {
          en: "Click \"+ Add FAQ\" to add a new question-answer pair. Enter a clear, concise question (up to 200 characters) and a helpful answer (up to 1000 characters). You can add as many FAQs as you need. Common product FAQs include shipping times, return policies, sizing guides, care instructions, and product materials.",
          ar: "انقر على \"+ إضافة سؤال\" لإضافة زوج سؤال وجواب جديد. أدخل سؤالاً واضحاً ومختصراً (حتى 200 حرف) وإجابة مفيدة (حتى 1000 حرف). يمكنك إضافة أي عدد من الأسئلة الشائعة. تشمل الأسئلة الشائعة للمنتجات أوقات الشحن وسياسات الإرجاع وأدلة المقاسات وتعليمات العناية والمواد.",
          fr: "Cliquez sur « + Ajouter une FAQ » pour ajouter une paire question-réponse. Entrez une question claire et concise (jusqu'à 200 caractères) et une réponse utile (jusqu'à 1000 caractères). Vous pouvez ajouter autant de FAQ que nécessaire. Les FAQ produit courantes incluent les délais de livraison, les politiques de retour, les guides de tailles, les instructions d'entretien et les matériaux.",
        },
        image: "/docs/products/product-faqs-1.svg",
      },
      {
        title: { en: "Save and preview", ar: "احفظ وعاين", fr: "Enregistrez et prévisualisez" },
        description: {
          en: "Click \"Save\" to publish your FAQs. They will appear as an expandable accordion section on your product page. Each FAQ is also automatically marked up with FAQ schema (JSON-LD), which helps search engines display your questions and answers directly in search results — giving your product page more visibility.",
          ar: "انقر على \"حفظ\" لنشر الأسئلة الشائعة. ستظهر كقسم أكورديون قابل للتوسيع في صفحة منتجك. يتم أيضاً ترميز كل سؤال تلقائياً بمخطط FAQ (JSON-LD)، مما يساعد محركات البحث على عرض أسئلتك وإجاباتك مباشرة في نتائج البحث — مما يمنح صفحة منتجك مزيداً من الظهور.",
          fr: "Cliquez sur « Enregistrer » pour publier vos FAQ. Elles apparaîtront comme une section accordéon dépliable sur votre page produit. Chaque FAQ est aussi automatiquement balisée avec le schéma FAQ (JSON-LD), ce qui aide les moteurs de recherche à afficher vos questions et réponses directement dans les résultats — offrant plus de visibilité à votre page produit.",
        },
        image: "/docs/products/product-faqs-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Do product FAQs help with SEO?", ar: "هل تساعد الأسئلة الشائعة للمنتج في تحسين محركات البحث؟", fr: "Les FAQ produit aident-elles le SEO ?" },
        answer: { en: "Yes. Each product's FAQs are automatically marked up with FAQ schema (JSON-LD). This structured data helps search engines understand and display your Q&A content as rich snippets in search results, which improves visibility and click-through rates.", ar: "نعم. يتم ترميز الأسئلة الشائعة لكل منتج تلقائياً بمخطط FAQ (JSON-LD). تساعد هذه البيانات المنظمة محركات البحث على فهم وعرض محتوى الأسئلة والأجوبة كمقتطفات منسقة في نتائج البحث، مما يحسن الظهور ومعدل النقر.", fr: "Oui. Les FAQ de chaque produit sont automatiquement balisées avec le schéma FAQ (JSON-LD). Ces données structurées aident les moteurs de recherche à comprendre et afficher votre contenu Q&R comme des extraits enrichis dans les résultats de recherche, améliorant la visibilité et le taux de clics." },
      },
      {
        question: { en: "How many FAQs can I add per product?", ar: "كم عدد الأسئلة الشائعة التي يمكنني إضافتها لكل منتج؟", fr: "Combien de FAQ puis-je ajouter par produit ?" },
        answer: { en: "You can add as many FAQs as you need per product. Each question can be up to 200 characters and each answer up to 1000 characters. Focus on the most common customer questions to keep the section useful and easy to browse.", ar: "يمكنك إضافة أي عدد من الأسئلة الشائعة لكل منتج. يمكن أن يصل كل سؤال إلى 200 حرف وكل إجابة إلى 1000 حرف. ركز على أكثر أسئلة العملاء شيوعاً للحفاظ على القسم مفيداً وسهل التصفح.", fr: "Vous pouvez ajouter autant de FAQ que nécessaire par produit. Chaque question peut faire jusqu'à 200 caractères et chaque réponse jusqu'à 1000 caractères. Concentrez-vous sur les questions les plus fréquentes pour garder la section utile et facile à parcourir." },
      },
    ],
  },
  {
    slug: "csv-import",
    category: "products",
    title: {
      en: "Importing products from CSV",
      ar: "استيراد المنتجات من CSV",
      fr: "Importer des produits depuis un CSV",
    },
    description: {
      en: "Bulk-import products into your store using a CSV file — Shopify-compatible format supported.",
      ar: "استيراد المنتجات بشكل جماعي إلى متجرك باستخدام ملف CSV — يدعم تنسيق Shopify.",
      fr: "Importez vos produits en masse dans votre boutique avec un fichier CSV — format Shopify compatible.",
    },
    steps: [
      {
        title: { en: "Download the template", ar: "حمّل القالب", fr: "Téléchargez le modèle" },
        description: {
          en: "Go to Products in the sidebar and click \"Import CSV\". In the dialog, click \"Download CSV template\" to get a sample file with the correct column format. You can also use an exported CSV from Shopify — Leadivo supports the same format.",
          ar: "انتقل إلى المنتجات في الشريط الجانبي وانقر على \"استيراد CSV\". في النافذة، انقر على \"تحميل قالب CSV\" للحصول على ملف نموذجي بالتنسيق الصحيح. يمكنك أيضاً استخدام ملف CSV مُصدَّر من Shopify — يدعم Leadivo نفس التنسيق.",
          fr: "Allez dans Produits dans la barre latérale et cliquez sur « Importer CSV ». Dans la boîte de dialogue, cliquez sur « Télécharger le modèle CSV » pour obtenir un fichier exemple avec le bon format. Vous pouvez aussi utiliser un CSV exporté depuis Shopify — Leadivo supporte le même format.",
        },
        image: "/docs/products/csv-import-1.svg",
      },
      {
        title: { en: "Fill in your products", ar: "أضف منتجاتك", fr: "Remplissez vos produits" },
        description: {
          en: "Open the CSV in any spreadsheet app (Excel, Google Sheets). Each row is one product or variant. Required columns: Title and Price. Optional columns include Description, SKU, Stock, Status, Image URL, Collection, and variant options (Option1 Name, Option1 Value, etc.). For products with variants, use the same Title for each variant row and fill in different option values.",
          ar: "افتح ملف CSV في أي تطبيق جداول بيانات (إكسل، جوجل شيتس). كل صف هو منتج أو متغير واحد. الأعمدة المطلوبة: العنوان والسعر. الأعمدة الاختيارية تشمل الوصف، SKU، المخزون، الحالة، رابط الصورة، المجموعة، وخيارات المتغيرات. للمنتجات ذات المتغيرات، استخدم نفس العنوان لكل صف متغير مع قيم خيارات مختلفة.",
          fr: "Ouvrez le CSV dans n'importe quel tableur (Excel, Google Sheets). Chaque ligne est un produit ou une variante. Colonnes requises : Title et Price. Les colonnes optionnelles incluent Description, SKU, Stock, Status, Image URL, Collection et les options de variantes. Pour les produits avec variantes, utilisez le même Title pour chaque ligne de variante avec des valeurs d'options différentes.",
        },
      },
      {
        title: { en: "Upload and import", ar: "ارفع واستورد", fr: "Téléchargez et importez" },
        description: {
          en: "Click \"Import CSV\" on the Products page and select your CSV file. You'll see a preview of your data with the number of products detected. Review the preview, then click \"Import\" to start. The system will create all products, upload images from URLs, match collections by name, and generate variants automatically. You'll see a summary when it's done.",
          ar: "انقر على \"استيراد CSV\" في صفحة المنتجات واختر ملف CSV. سترى معاينة لبياناتك مع عدد المنتجات المكتشفة. راجع المعاينة ثم انقر على \"استيراد\" للبدء. سيقوم النظام بإنشاء جميع المنتجات ورفع الصور من الروابط ومطابقة المجموعات بالاسم وإنشاء المتغيرات تلقائياً. سترى ملخصاً عند الانتهاء.",
          fr: "Cliquez sur « Importer CSV » sur la page Produits et sélectionnez votre fichier CSV. Vous verrez un aperçu de vos données avec le nombre de produits détectés. Vérifiez l'aperçu, puis cliquez sur « Importer » pour commencer. Le système créera tous les produits, téléchargera les images depuis les URLs, associera les collections par nom et générera les variantes automatiquement. Vous verrez un résumé une fois terminé.",
        },
        image: "/docs/products/csv-import-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Can I import products from Shopify?", ar: "هل يمكنني استيراد المنتجات من Shopify؟", fr: "Puis-je importer des produits depuis Shopify ?" },
        answer: { en: "Yes. Leadivo supports the Shopify CSV format. Export your products from Shopify as a CSV file, then upload it directly to Leadivo. Product names, descriptions, prices, SKUs, stock, images, and variants will all be imported.", ar: "نعم. يدعم Leadivo تنسيق CSV الخاص بـ Shopify. صدّر منتجاتك من Shopify كملف CSV ثم ارفعه مباشرة إلى Leadivo. سيتم استيراد أسماء المنتجات والأوصاف والأسعار وSKU والمخزون والصور والمتغيرات.", fr: "Oui. Leadivo supporte le format CSV de Shopify. Exportez vos produits depuis Shopify en CSV, puis téléchargez-le directement dans Leadivo. Les noms, descriptions, prix, SKU, stocks, images et variantes seront tous importés." },
      },
      {
        question: { en: "Is there a limit to how many products I can import?", ar: "هل هناك حد لعدد المنتجات التي يمكنني استيرادها؟", fr: "Y a-t-il une limite au nombre de produits que je peux importer ?" },
        answer: { en: "The import respects your plan's product limit. Pro plan users can import unlimited products. The system checks your remaining product slots before starting the import and lets you know if you need to upgrade.", ar: "يحترم الاستيراد حد المنتجات في خطتك. مستخدمو خطة Pro يمكنهم استيراد منتجات غير محدودة. يتحقق النظام من فتحات المنتجات المتبقية قبل بدء الاستيراد ويعلمك إذا كنت بحاجة للترقية.", fr: "L'importation respecte la limite de produits de votre plan. Les utilisateurs Pro peuvent importer des produits illimités. Le système vérifie vos places de produits restantes avant de commencer et vous informe si vous devez passer au plan supérieur." },
      },
    ],
  },

  // ── Collections ──────────────────────────────────────────────────────
  {
    slug: "create-collection",
    category: "collections",
    title: {
      en: "Creating a collection",
      ar: "إنشاء مجموعة",
      fr: "Créer une collection",
    },
    description: {
      en: "Group your products into browsable collections.",
      ar: "جمّع منتجاتك في مجموعات قابلة للتصفح.",
      fr: "Regroupez vos produits en collections navigables.",
    },
    steps: [
      {
        title: { en: "Go to Collections", ar: "انتقل إلى المجموعات", fr: "Allez dans Collections" },
        description: {
          en: "Click \"Collections\" in the sidebar to see your existing collections, then click \"Create Collection\" to add a new one. Collections help customers browse your store by category — for example, \"New Arrivals\", \"Best Sellers\", or \"Summer Collection\".",
          ar: "انقر على \"المجموعات\" في الشريط الجانبي لرؤية مجموعاتك الحالية، ثم انقر على \"إنشاء مجموعة\" لإضافة واحدة جديدة. تساعد المجموعات العملاء في تصفح متجرك حسب الفئة — مثلاً \"وصل حديثًا\" أو \"الأكثر مبيعًا\" أو \"مجموعة الصيف\".",
          fr: "Cliquez sur « Collections » dans la barre latérale pour voir vos collections existantes, puis sur « Créer une collection » pour en ajouter une nouvelle. Les collections aident les clients à parcourir votre boutique par catégorie — par exemple « Nouveautés », « Meilleures ventes » ou « Collection été ».",
        },
        image: "/docs/collections/create-collection-1.svg",
      },
      {
        title: { en: "Name your collection", ar: "سمّ مجموعتك", fr: "Nommez votre collection" },
        description: {
          en: "Enter a clear name for your collection (e.g., \"New Arrivals\", \"Summer 2025\"). The URL slug is auto-generated from the name — it's what appears in the link when customers visit this collection (e.g., /collections/summer-2025). Then select which products belong to this collection using the product checkboxes below the name field.",
          ar: "أدخل اسمًا واضحًا لمجموعتك (مثلاً \"وصل حديثًا\" أو \"صيف 2025\"). يُنشأ رابط URL تلقائيًا من الاسم — وهو ما يظهر في الرابط عندما يزور العملاء هذه المجموعة (مثلاً /collections/summer-2025). ثم اختر المنتجات التي تنتمي لهذه المجموعة باستخدام مربعات الاختيار أسفل حقل الاسم.",
          fr: "Entrez un nom clair pour votre collection (ex : « Nouveautés », « Été 2025 »). Le slug URL est généré automatiquement à partir du nom — c'est ce qui apparaît dans le lien quand les clients visitent cette collection (ex : /collections/ete-2025). Sélectionnez ensuite les produits qui appartiennent à cette collection avec les cases à cocher sous le champ de nom.",
        },
        image: "/docs/collections/create-collection-2.svg",
      },
      {
        title: { en: "Assign products", ar: "خصّص المنتجات", fr: "Assignez les produits" },
        description: {
          en: "To add products to this collection, go to the Products page and edit any product. In the product form, you'll find a \"Collection\" dropdown — select this collection to include the product. A product can only belong to one collection at a time. Collections with products will automatically appear on your storefront's navigation.",
          ar: "لإضافة منتجات إلى هذه المجموعة، انتقل إلى صفحة المنتجات وعدّل أي منتج. في نموذج المنتج، ستجد قائمة \"المجموعة\" — اختر هذه المجموعة لتضمين المنتج فيها. يمكن أن ينتمي المنتج إلى مجموعة واحدة فقط في كل مرة. ستظهر المجموعات التي تحتوي على منتجات تلقائيًا في تصفح واجهة متجرك.",
          fr: "Pour ajouter des produits à cette collection, allez dans la page Produits et modifiez n'importe quel produit. Dans le formulaire du produit, vous trouverez un menu « Collection » — sélectionnez cette collection pour inclure le produit. Un produit ne peut appartenir qu'à une seule collection à la fois. Les collections avec des produits apparaîtront automatiquement dans la navigation de votre vitrine.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "Can a product belong to multiple collections?", ar: "هل يمكن أن ينتمي المنتج لعدة مجموعات؟", fr: "Un produit peut-il appartenir à plusieurs collections ?" },
        answer: { en: "No, a product can only belong to one collection at a time. If you need to reorganize, simply edit the product and change its collection assignment.", ar: "لا، يمكن أن ينتمي المنتج لمجموعة واحدة فقط في كل مرة. إذا كنت بحاجة لإعادة التنظيم، ببساطة عدّل المنتج وغيّر مجموعته.", fr: "Non, un produit ne peut appartenir qu'à une seule collection à la fois. Pour réorganiser, modifiez simplement le produit et changez sa collection." },
      },
      {
        question: { en: "How do collections appear on my storefront?", ar: "كيف تظهر المجموعات في واجهة المتجر؟", fr: "Comment les collections apparaissent-elles sur ma vitrine ?" },
        answer: { en: "Collections appear as filterable tabs on your storefront homepage. Customers can click a collection tab to see only products in that category. Collections with no products are hidden automatically.", ar: "تظهر المجموعات كعلامات تبويب قابلة للتصفية في الصفحة الرئيسية لواجهة المتجر. يمكن للعملاء النقر على علامة مجموعة لرؤية المنتجات في تلك الفئة فقط. تُخفى المجموعات بدون منتجات تلقائيًا.", fr: "Les collections apparaissent comme des onglets filtrables sur la page d'accueil de votre vitrine. Les clients peuvent cliquer sur un onglet pour voir uniquement les produits de cette catégorie. Les collections sans produits sont masquées automatiquement." },
      },
    ],
  },

  // ── Orders ───────────────────────────────────────────────────────────
  {
    slug: "view-orders",
    category: "orders",
    title: {
      en: "Viewing and managing orders",
      ar: "عرض وإدارة الطلبات",
      fr: "Consulter et gérer les commandes",
    },
    description: {
      en: "Track and manage incoming customer orders.",
      ar: "تتبع وأدِر طلبات العملاء الواردة.",
      fr: "Suivez et gérez les commandes clients entrantes.",
    },
    steps: [
      {
        title: { en: "Open Orders page", ar: "افتح صفحة الطلبات", fr: "Ouvrez la page Commandes" },
        description: {
          en: "Click \"Orders\" in the sidebar to see all customer orders. They're sorted by most recent first. Each order shows the customer name, total amount, status, and date. You can also see a quick count of new (pending) orders that need your attention.",
          ar: "انقر على \"الطلبات\" في الشريط الجانبي لرؤية جميع طلبات العملاء. مرتبة من الأحدث أولاً. يعرض كل طلب اسم العميل والمبلغ الإجمالي والحالة والتاريخ. يمكنك أيضًا رؤية عدد سريع للطلبات الجديدة (المعلقة) التي تحتاج انتباهك.",
          fr: "Cliquez sur « Commandes » dans la barre latérale pour voir toutes les commandes clients. Elles sont triées par date décroissante. Chaque commande affiche le nom du client, le montant total, le statut et la date. Vous pouvez aussi voir un compteur rapide des nouvelles commandes (en attente) qui nécessitent votre attention.",
        },
        image: "/docs/orders/view-orders-1.svg",
      },
      {
        title: { en: "View order details", ar: "اعرض تفاصيل الطلب", fr: "Consultez les détails de la commande" },
        description: {
          en: "Click any order row to open the full details. You'll see everything about the order: the customer's name, phone number, and shipping address; a list of all items ordered with quantities and prices; the payment method and total amount; and any discount codes applied. This is all the information you need to fulfill the order.",
          ar: "انقر على أي صف طلب لفتح التفاصيل الكاملة. سترى كل شيء عن الطلب: اسم العميل ورقم الهاتف وعنوان الشحن؛ قائمة بجميع العناصر المطلوبة بالكميات والأسعار؛ طريقة الدفع والمبلغ الإجمالي؛ وأي أكواد خصم مطبقة. هذه كل المعلومات التي تحتاجها لتنفيذ الطلب.",
          fr: "Cliquez sur n'importe quelle ligne de commande pour ouvrir les détails complets. Vous verrez tout sur la commande : le nom du client, son numéro de téléphone et son adresse de livraison ; la liste de tous les articles commandés avec quantités et prix ; le mode de paiement et le montant total ; et les codes de réduction appliqués. Ce sont toutes les informations dont vous avez besoin pour traiter la commande.",
        },
        image: "/docs/orders/view-orders-2.svg",
      },
      {
        title: { en: "Update order status", ar: "حدّث حالة الطلب", fr: "Mettez à jour le statut de la commande" },
        description: {
          en: "Use the status dropdown on the order detail page to track your fulfillment progress. The available statuses are: Pending (new order, not yet processed), Confirmed (you've accepted and are preparing the order), Shipped (the order is on its way to the customer), Delivered (the customer has received their order), Returned (the customer sent the order back), and Canceled (the order was canceled). The system guides you through the correct workflow by showing only valid status transitions at each step. You can also select multiple orders using the checkboxes and use bulk actions to update their status at once. Updating statuses helps you stay organized, feeds the COD analytics dashboard, and keeps customers informed if WhatsApp notifications are enabled.",
          ar: "استخدم قائمة الحالة في صفحة تفاصيل الطلب لتتبع تقدم التنفيذ. الحالات المتاحة هي: معلق (طلب جديد، لم يُعالج بعد)، مؤكد (قبلت الطلب وتجهزه)، مشحون (الطلب في الطريق إلى العميل)، مُسلّم (استلم العميل طلبه)، مُرجع (أرجع العميل الطلب)، وملغي (تم إلغاء الطلب). يرشدك النظام عبر سير العمل الصحيح بعرض الانتقالات الصالحة فقط في كل خطوة. يمكنك أيضاً تحديد عدة طلبات باستخدام مربعات الاختيار واستخدام الإجراءات الجماعية لتحديث حالتها دفعة واحدة. تحديث الحالات يساعدك على البقاء منظماً ويغذي لوحة تحليلات COD ويُبقي العملاء على اطلاع إذا كانت إشعارات واتساب مفعلة.",
          fr: "Utilisez le menu déroulant de statut sur la page de détails pour suivre la progression du traitement. Les statuts disponibles sont : En attente (nouvelle commande, pas encore traitée), Confirmée (vous avez accepté et préparez la commande), Expédiée (la commande est en route vers le client), Livrée (le client a reçu sa commande), Retournée (le client a renvoyé la commande) et Annulée (la commande a été annulée). Le système vous guide à travers le bon workflow en affichant uniquement les transitions valides à chaque étape. Vous pouvez aussi sélectionner plusieurs commandes avec les cases à cocher et utiliser les actions groupées pour mettre à jour leur statut d'un coup. La mise à jour des statuts vous aide à rester organisé, alimente le tableau de bord analytique COD et tient les clients informés si les notifications WhatsApp sont activées.",
        },
        image: "/docs/orders/view-orders-3.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What order statuses are available?", ar: "ما حالات الطلب المتاحة؟", fr: "Quels statuts de commande sont disponibles ?" },
        answer: { en: "The available statuses are: Pending (new order), Confirmed (accepted and being prepared), Shipped (on its way), Delivered (received by customer), Returned (sent back), and Canceled (order canceled). Delivered and Canceled are terminal statuses — no further changes are allowed.", ar: "الحالات المتاحة هي: معلق (طلب جديد)، مؤكد (مقبول قيد التجهيز)، مشحون (في الطريق)، مُسلّم (استلمه العميل)، مُرجع (أُعيد)، وملغي (تم الإلغاء). المُسلّم والملغي حالات نهائية — لا يُسمح بمزيد من التغييرات.", fr: "Les statuts disponibles sont : En attente (nouvelle commande), Confirmée (acceptée et en préparation), Expédiée (en route), Livrée (reçue par le client), Retournée (renvoyée) et Annulée. Livrée et Annulée sont des statuts terminaux — aucun changement n'est autorisé après." },
      },
      {
        question: { en: "Can I update multiple orders at once?", ar: "هل يمكنني تحديث عدة طلبات دفعة واحدة؟", fr: "Puis-je mettre à jour plusieurs commandes à la fois ?" },
        answer: { en: "Yes, select multiple orders using the checkboxes, then use the bulk actions menu to update their status simultaneously. This is useful when you ship a batch of orders or need to confirm several at once.", ar: "نعم، حدد عدة طلبات باستخدام مربعات الاختيار، ثم استخدم قائمة الإجراءات الجماعية لتحديث حالتها في وقت واحد. هذا مفيد عند شحن دفعة طلبات أو الحاجة لتأكيد عدة طلبات مرة واحدة.", fr: "Oui, sélectionnez plusieurs commandes avec les cases à cocher, puis utilisez le menu d'actions groupées pour mettre à jour leur statut simultanément. C'est utile pour expédier un lot de commandes ou en confirmer plusieurs à la fois." },
      },
      {
        question: { en: "What payment methods are supported?", ar: "ما طرق الدفع المدعومة؟", fr: "Quels modes de paiement sont pris en charge ?" },
        answer: { en: "Currently, Leadivo supports Cash on Delivery (COD) as the payment method. This is the most common payment method for e-commerce in many regions. The platform is optimized for COD workflows with dedicated analytics.", ar: "حاليًا، يدعم Leadivo الدفع عند الاستلام (COD) كطريقة دفع. هذه هي طريقة الدفع الأكثر شيوعًا للتجارة الإلكترونية في العديد من المناطق. المنصة مُحسّنة لسير عمل COD مع تحليلات مخصصة.", fr: "Actuellement, Leadivo prend en charge le paiement à la livraison (COD). C'est le mode de paiement le plus courant pour le e-commerce dans de nombreuses régions. La plateforme est optimisée pour les flux COD avec des analyses dédiées." },
      },
    ],
  },
  {
    slug: "cod-analytics",
    category: "orders",
    title: {
      en: "COD analytics dashboard",
      ar: "لوحة تحليلات COD",
      fr: "Tableau de bord analytique COD",
    },
    description: {
      en: "Track confirmation rate, delivery rate, return rate, and revenue by status.",
      ar: "تتبع معدل التأكيد ومعدل التسليم ومعدل الإرجاع والإيرادات حسب الحالة.",
      fr: "Suivez le taux de confirmation, le taux de livraison, le taux de retour et les revenus par statut.",
    },
    steps: [
      {
        title: { en: "View COD KPIs", ar: "عرض مؤشرات COD", fr: "Voir les KPIs COD" },
        description: {
          en: "Your dashboard shows three COD-specific metrics: Confirmation Rate (percentage of orders confirmed out of total), Delivery Rate (percentage of shipped orders that were delivered), and Return Rate (percentage of shipped orders that were returned). Each metric includes a mini chart showing the trend over your selected date range and a comparison with the previous period.",
          ar: "تعرض لوحة التحكم ثلاثة مؤشرات خاصة بـ COD: معدل التأكيد (نسبة الطلبات المؤكدة من الإجمالي)، ومعدل التسليم (نسبة الطلبات المشحونة التي تم تسليمها)، ومعدل الإرجاع (نسبة الطلبات المشحونة التي تم إرجاعها). كل مؤشر يتضمن رسماً بيانياً مصغراً يُظهر الاتجاه خلال النطاق الزمني المحدد ومقارنة مع الفترة السابقة.",
          fr: "Votre tableau de bord affiche trois métriques spécifiques au COD : le taux de confirmation (pourcentage de commandes confirmées sur le total), le taux de livraison (pourcentage de commandes expédiées qui ont été livrées) et le taux de retour (pourcentage de commandes expédiées qui ont été retournées). Chaque métrique inclut un mini graphique montrant la tendance sur la période sélectionnée et une comparaison avec la période précédente.",
        },
        image: "/docs/orders/cod-analytics-1.svg",
      },
      {
        title: { en: "Explore the donut charts", ar: "استكشف المخططات الدائرية", fr: "Explorez les graphiques circulaires" },
        description: {
          en: "Below the KPIs, you'll find three donut charts. The Delivery Success chart shows the breakdown of delivered, returned, and canceled orders. The Order Status Distribution chart shows how your orders are split across all statuses (pending, confirmed, shipped, delivered, returned, canceled). These visual breakdowns help you spot patterns at a glance.",
          ar: "أسفل المؤشرات، ستجد ثلاثة مخططات دائرية. مخطط نجاح التسليم يعرض توزيع الطلبات المُسلّمة والمُرجعة والملغية. مخطط توزيع حالات الطلبات يعرض كيف تتوزع طلباتك عبر جميع الحالات (معلقة، مؤكدة، مشحونة، مُسلّمة، مُرجعة، ملغية). تساعدك هذه الرسوم البيانية على اكتشاف الأنماط بنظرة سريعة.",
          fr: "Sous les KPIs, vous trouverez trois graphiques circulaires. Le graphique de Succès de livraison montre la répartition des commandes livrées, retournées et annulées. Le graphique de Distribution des statuts montre comment vos commandes se répartissent entre tous les statuts (en attente, confirmée, expédiée, livrée, retournée, annulée). Ces visualisations vous aident à repérer les tendances en un coup d'œil.",
        },
      },
      {
        title: { en: "Analyze revenue by status", ar: "حلل الإيرادات حسب الحالة", fr: "Analyser les revenus par statut" },
        description: {
          en: "The Revenue by Status donut chart breaks down your revenue into four categories: Collected (delivered orders — money you've received), In Transit (shipped orders), Pending (pending and confirmed orders), and Lost (canceled and returned orders). The center shows your total sales, and the legend displays the exact amount for each category. This tells you how much money you've actually collected versus what's still at risk.",
          ar: "يقسم المخطط الدائري للإيرادات حسب الحالة إيراداتك إلى أربع فئات: محصّلة (الطلبات المُسلّمة — أموال استلمتها)، في الطريق (الطلبات المشحونة)، معلقة (الطلبات المعلقة والمؤكدة)، ومفقودة (الطلبات الملغية والمُرجعة). يعرض المركز إجمالي مبيعاتك، ويعرض المفتاح المبلغ الدقيق لكل فئة. هذا يخبرك بالمبلغ الذي جمعته فعلاً مقابل ما هو لا يزال معرّضاً للخطر.",
          fr: "Le graphique circulaire Revenus par statut décompose vos revenus en quatre catégories : Collectés (commandes livrées — argent reçu), En transit (commandes expédiées), En attente (commandes en attente et confirmées) et Perdus (commandes annulées et retournées). Le centre affiche vos ventes totales, et la légende montre le montant exact pour chaque catégorie. Cela vous indique combien d'argent vous avez réellement collecté par rapport à ce qui est encore à risque.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What is the confirmation rate?", ar: "ما هو معدل التأكيد؟", fr: "Qu'est-ce que le taux de confirmation ?" },
        answer: { en: "The confirmation rate is the percentage of total orders that have been confirmed (moved from pending to confirmed status). A higher confirmation rate means you're successfully processing more of your incoming orders.", ar: "معدل التأكيد هو نسبة الطلبات الإجمالية التي تم تأكيدها (نقلها من حالة معلق إلى مؤكد). معدل تأكيد أعلى يعني أنك تعالج بنجاح المزيد من طلباتك الواردة.", fr: "Le taux de confirmation est le pourcentage de commandes totales qui ont été confirmées (passées de en attente à confirmée). Un taux plus élevé signifie que vous traitez avec succès davantage de commandes entrantes." },
      },
      {
        question: { en: "How is revenue by status calculated?", ar: "كيف يتم حساب الإيرادات حسب الحالة؟", fr: "Comment les revenus par statut sont-ils calculés ?" },
        answer: { en: "Revenue is grouped into four categories: Collected (delivered orders — money you've received), In Transit (shipped but not yet delivered), Pending (pending and confirmed orders — not yet shipped), and Lost (canceled and returned orders — revenue you won't collect).", ar: "تُجمع الإيرادات في أربع فئات: محصّلة (طلبات مُسلّمة — أموال استلمتها)، في الطريق (مشحونة لكن لم تُسلّم بعد)، معلقة (طلبات معلقة ومؤكدة — لم تُشحن بعد)، ومفقودة (طلبات ملغية ومُرجعة — إيرادات لن تحصلها).", fr: "Les revenus sont regroupés en quatre catégories : Collectés (commandes livrées — argent reçu), En transit (expédiées mais pas encore livrées), En attente (en attente et confirmées — pas encore expédiées) et Perdus (annulées et retournées — revenus non collectés)." },
      },
    ],
  },
  {
    slug: "abandoned-checkout-recovery",
    category: "orders",
    title: {
      en: "Abandoned checkout recovery",
      ar: "استرداد السلات المتروكة",
      fr: "Récupération de paniers abandonnés",
    },
    description: {
      en: "Automatically recover abandoned carts via WhatsApp notifications.",
      ar: "استرداد السلات المتروكة تلقائياً عبر إشعارات واتساب.",
      fr: "Récupérez automatiquement les paniers abandonnés via les notifications WhatsApp.",
    },
    steps: [
      {
        title: { en: "How it works", ar: "كيف يعمل", fr: "Comment ça marche" },
        description: {
          en: "When a customer enters their phone number on the checkout page but leaves without placing an order, Leadivo captures their cart as an abandoned checkout. After 30 minutes, if no order was placed, the system automatically sends a recovery notification through your enabled integrations (WhatsApp, Google Sheets, etc.) with a link for the customer to complete their purchase.",
          ar: "عندما يدخل عميل رقم هاتفه في صفحة الدفع لكن يغادر بدون تقديم طلب، يلتقط Leadivo سلته كسلة متروكة. بعد 30 دقيقة، إذا لم يُقدّم أي طلب، يرسل النظام تلقائياً إشعار استرداد عبر التكاملات المفعلة (واتساب، Google Sheets، إلخ) مع رابط للعميل لإتمام الشراء.",
          fr: "Lorsqu'un client entre son numéro de téléphone sur la page de paiement mais part sans passer commande, Leadivo capture son panier comme un panier abandonné. Après 30 minutes, si aucune commande n'a été passée, le système envoie automatiquement une notification de récupération via vos intégrations activées (WhatsApp, Google Sheets, etc.) avec un lien pour que le client finalise son achat.",
        },
      },
      {
        title: { en: "Checkout lifecycle", ar: "دورة حياة السلة", fr: "Cycle de vie du panier" },
        description: {
          en: "Each abandoned checkout goes through these statuses: Pending (waiting 30 minutes before sending recovery), Sent (recovery notification dispatched), Recovered (customer came back and placed an order), and Expired (48 hours passed with no recovery — the system stops trying). Only one recovery message is sent per checkout to avoid spamming customers.",
          ar: "تمر كل سلة متروكة بهذه الحالات: معلقة (انتظار 30 دقيقة قبل إرسال الاسترداد)، مُرسلة (تم إرسال إشعار الاسترداد)، مستردة (عاد العميل وقدم طلباً)، ومنتهية الصلاحية (مرت 48 ساعة بدون استرداد — يتوقف النظام عن المحاولة). يتم إرسال رسالة استرداد واحدة فقط لكل سلة لتجنب إزعاج العملاء.",
          fr: "Chaque panier abandonné passe par ces statuts : En attente (attente de 30 minutes avant l'envoi de la récupération), Envoyé (notification de récupération envoyée), Récupéré (le client est revenu et a passé commande) et Expiré (48 heures passées sans récupération — le système arrête d'essayer). Un seul message de récupération est envoyé par panier pour éviter de spammer les clients.",
        },
      },
      {
        title: { en: "View abandoned checkouts", ar: "عرض السلات المتروكة", fr: "Voir les paniers abandonnés" },
        description: {
          en: "Navigate to the Abandoned Checkouts page from the dashboard sidebar to see all captured checkouts. You can filter by status (pending, sent, recovered, expired) and date range. Each row shows the customer's name, phone number, cart items, total value, status, and when it was created. Use this data to understand your cart abandonment patterns and optimize your checkout flow.",
          ar: "انتقل إلى صفحة السلات المتروكة من الشريط الجانبي للوحة التحكم لرؤية جميع السلات الملتقطة. يمكنك التصفية حسب الحالة (معلقة، مُرسلة، مستردة، منتهية الصلاحية) ونطاق التاريخ. يعرض كل صف اسم العميل ورقم الهاتف وعناصر السلة والقيمة الإجمالية والحالة وتاريخ الإنشاء. استخدم هذه البيانات لفهم أنماط ترك السلات وتحسين تدفق الدفع.",
          fr: "Accédez à la page Paniers abandonnés depuis la barre latérale du tableau de bord pour voir tous les paniers capturés. Vous pouvez filtrer par statut (en attente, envoyé, récupéré, expiré) et par plage de dates. Chaque ligne affiche le nom du client, son numéro de téléphone, les articles du panier, la valeur totale, le statut et la date de création. Utilisez ces données pour comprendre vos modèles d'abandon de panier et optimiser votre flux de paiement.",
        },
        image: "/docs/orders/abandoned-checkout-1.svg",
      },
    ],
    faqs: [
      {
        question: { en: "When is a checkout considered abandoned?", ar: "متى تُعتبر السلة متروكة؟", fr: "Quand un panier est-il considéré comme abandonné ?" },
        answer: { en: "A checkout is considered abandoned when a customer enters their phone number on the checkout page but does not complete the order within 30 minutes. The system then captures the cart and triggers recovery actions.", ar: "تُعتبر السلة متروكة عندما يدخل العميل رقم هاتفه في صفحة الدفع لكن لا يكمل الطلب خلال 30 دقيقة. يقوم النظام بعدها بالتقاط السلة وتفعيل إجراءات الاسترداد.", fr: "Un panier est considéré comme abandonné lorsqu'un client entre son numéro de téléphone mais ne finalise pas la commande dans les 30 minutes. Le système capture alors le panier et déclenche les actions de récupération." },
      },
      {
        question: { en: "How many recovery messages are sent per checkout?", ar: "كم عدد رسائل الاسترداد المرسلة لكل سلة؟", fr: "Combien de messages de récupération sont envoyés par panier ?" },
        answer: { en: "Only one recovery message is sent per abandoned checkout to avoid spamming customers. After 48 hours with no recovery, the checkout expires and the system stops trying.", ar: "يتم إرسال رسالة استرداد واحدة فقط لكل سلة متروكة لتجنب إزعاج العملاء. بعد 48 ساعة بدون استرداد، تنتهي صلاحية السلة ويتوقف النظام عن المحاولة.", fr: "Un seul message de récupération est envoyé par panier abandonné pour éviter de spammer les clients. Après 48 heures sans récupération, le panier expire et le système arrête d'essayer." },
      },
      {
        question: { en: "Which integrations support abandoned checkout recovery?", ar: "ما التكاملات التي تدعم استرداد السلات المتروكة؟", fr: "Quelles intégrations supportent la récupération de paniers abandonnés ?" },
        answer: { en: "WhatsApp and Google Sheets both support abandoned checkout recovery. WhatsApp sends a recovery message directly to the customer with a link to complete their purchase. Google Sheets logs the abandoned checkout for your records.", ar: "واتساب وGoogle Sheets يدعمان استرداد السلات المتروكة. واتساب يرسل رسالة استرداد مباشرة للعميل مع رابط لإتمام الشراء. Google Sheets يسجل السلة المتروكة لسجلاتك.", fr: "WhatsApp et Google Sheets supportent tous deux la récupération. WhatsApp envoie un message de récupération directement au client avec un lien pour finaliser l'achat. Google Sheets enregistre le panier abandonné dans vos dossiers." },
      },
    ],
  },
  {
    slug: "export-orders",
    category: "orders",
    title: {
      en: "Export orders to CSV",
      ar: "تصدير الطلبات إلى CSV",
      fr: "Exporter les commandes en CSV",
    },
    description: {
      en: "Download your orders as a CSV file for reporting or offline use.",
      ar: "حمّل طلباتك كملف CSV للتقارير أو الاستخدام دون اتصال.",
      fr: "Téléchargez vos commandes en fichier CSV pour vos rapports ou une utilisation hors ligne.",
    },
    steps: [
      {
        title: { en: "Open the Orders page", ar: "افتح صفحة الطلبات", fr: "Ouvrez la page Commandes" },
        description: {
          en: "Click \"Orders\" in the sidebar. The Export CSV button appears in the toolbar next to the filters. This feature is available on the Pro plan and during the free trial.",
          ar: "انقر على \"الطلبات\" في الشريط الجانبي. يظهر زر تصدير CSV في شريط الأدوات بجانب الفلاتر. هذه الميزة متاحة في خطة Pro وخلال الفترة التجريبية.",
          fr: "Cliquez sur « Commandes » dans la barre latérale. Le bouton Exporter CSV apparaît dans la barre d'outils à côté des filtres. Cette fonctionnalité est disponible avec le plan Pro et pendant l'essai gratuit.",
        },
      },
      {
        title: { en: "Apply filters (optional)", ar: "طبّق الفلاتر (اختياري)", fr: "Appliquez des filtres (optionnel)" },
        description: {
          en: "Use the status, market, date range, or search filters to narrow down which orders to export. The CSV will only include orders matching your current filters. Leave all filters clear to export all orders.",
          ar: "استخدم فلاتر الحالة والسوق ونطاق التاريخ أو البحث لتحديد الطلبات المراد تصديرها. سيتضمن ملف CSV فقط الطلبات المطابقة لفلاترك الحالية. اترك جميع الفلاتر فارغة لتصدير كل الطلبات.",
          fr: "Utilisez les filtres de statut, marché, plage de dates ou recherche pour cibler les commandes à exporter. Le CSV n'inclura que les commandes correspondant à vos filtres actuels. Laissez tous les filtres vides pour exporter toutes les commandes.",
        },
      },
      {
        title: { en: "Click Export CSV", ar: "انقر تصدير CSV", fr: "Cliquez sur Exporter CSV" },
        description: {
          en: "Click the \"Export CSV\" button. The file downloads automatically with the name orders-YYYY-MM-DD.csv. The CSV includes: order number, date, status, customer name, phone, email, city, country, address, items, subtotal, delivery fee, discount, total, currency, payment method, and note. Sensitive data like IP addresses is excluded for privacy. The export supports up to 10,000 orders and is limited to 5 exports per hour.",
          ar: "انقر على زر \"تصدير CSV\". يتم تنزيل الملف تلقائياً باسم orders-YYYY-MM-DD.csv. يتضمن الملف: رقم الطلب، التاريخ، الحالة، اسم العميل، الهاتف، البريد الإلكتروني، المدينة، البلد، العنوان، المنتجات، المجموع الفرعي، رسوم التوصيل، الخصم، الإجمالي، العملة، طريقة الدفع، والملاحظة. البيانات الحساسة مثل عناوين IP مستبعدة للخصوصية. يدعم التصدير حتى 10,000 طلب ومحدود بـ 5 تصديرات في الساعة.",
          fr: "Cliquez sur le bouton « Exporter CSV ». Le fichier se télécharge automatiquement sous le nom orders-YYYY-MM-DD.csv. Le CSV inclut : numéro de commande, date, statut, nom du client, téléphone, email, ville, pays, adresse, articles, sous-total, frais de livraison, réduction, total, devise, mode de paiement et note. Les données sensibles comme les adresses IP sont exclues pour la confidentialité. L'export supporte jusqu'à 10 000 commandes et est limité à 5 exports par heure.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What fields are included in the CSV export?", ar: "ما الحقول المتضمنة في تصدير CSV؟", fr: "Quels champs sont inclus dans l'export CSV ?" },
        answer: { en: "The CSV includes 17 columns: Order #, Date, Status, Customer Name, Phone, Email, City, Country, Address, Items, Subtotal, Delivery Fee, Discount, Total, Currency, Payment Method, and Note. IP addresses and detected country are excluded for privacy.", ar: "يتضمن CSV 17 عموداً: رقم الطلب، التاريخ، الحالة، اسم العميل، الهاتف، البريد الإلكتروني، المدينة، البلد، العنوان، المنتجات، المجموع الفرعي، رسوم التوصيل، الخصم، الإجمالي، العملة، طريقة الدفع، والملاحظة. عناوين IP والبلد المكتشف مستبعدة للخصوصية.", fr: "Le CSV inclut 17 colonnes : N° de commande, Date, Statut, Nom du client, Téléphone, Email, Ville, Pays, Adresse, Articles, Sous-total, Frais de livraison, Réduction, Total, Devise, Mode de paiement et Note. Les adresses IP et le pays détecté sont exclus pour la confidentialité." },
      },
      {
        question: { en: "Is there a limit on how many orders I can export?", ar: "هل هناك حد لعدد الطلبات التي يمكنني تصديرها؟", fr: "Y a-t-il une limite au nombre de commandes exportables ?" },
        answer: { en: "Each export includes up to 10,000 orders. You can run up to 5 exports per hour. Use date range filters to split large datasets across multiple exports if needed.", ar: "كل تصدير يتضمن حتى 10,000 طلب. يمكنك إجراء حتى 5 تصديرات في الساعة. استخدم فلاتر نطاق التاريخ لتقسيم البيانات الكبيرة عبر تصديرات متعددة عند الحاجة.", fr: "Chaque export inclut jusqu'à 10 000 commandes. Vous pouvez effectuer jusqu'à 5 exports par heure. Utilisez les filtres de plage de dates pour diviser les grands ensembles de données en plusieurs exports si nécessaire." },
      },
    ],
  },

  // ── Customers ────────────────────────────────────────────────────────
  {
    slug: "customer-database",
    category: "orders",
    title: {
      en: "Customer database",
      ar: "قاعدة بيانات العملاء",
      fr: "Base de données clients",
    },
    description: {
      en: "View and manage your customer profiles, automatically built from orders.",
      ar: "عرض وإدارة ملفات العملاء، المبنية تلقائياً من الطلبات.",
      fr: "Consultez et gérez vos profils clients, créés automatiquement à partir des commandes.",
    },
    steps: [
      {
        title: { en: "Open the Customers page", ar: "افتح صفحة العملاء", fr: "Ouvrez la page Clients" },
        description: {
          en: "Click \"Customers\" in the sidebar. You'll see a searchable customer table with name, phone, country, order count, total spent, and tags. Customer profiles are created automatically whenever a new order is placed — no manual entry needed.",
          ar: "انقر على \"العملاء\" في الشريط الجانبي. سترى جدول عملاء قابل للبحث يعرض الاسم والهاتف والبلد وعدد الطلبات وإجمالي الإنفاق والتصنيفات. يتم إنشاء ملفات العملاء تلقائياً عند استلام أي طلب جديد — بدون إدخال يدوي.",
          fr: "Cliquez sur « Clients » dans la barre latérale. Vous verrez un tableau de clients avec recherche affichant le nom, téléphone, pays, nombre de commandes, total dépensé et tags. Les profils clients sont créés automatiquement à chaque nouvelle commande — aucune saisie manuelle nécessaire.",
        },
        image: "/docs/customers/customer-database-1.svg",
      },
      {
        title: { en: "View customer details", ar: "عرض تفاصيل العميل", fr: "Voir les détails du client" },
        description: {
          en: "Click any customer row to open their profile. You'll see their contact info, order history, total spent, order count, and average order value. From here you can also message them directly on WhatsApp.",
          ar: "انقر على أي صف عميل لفتح ملفه الشخصي. سترى معلومات الاتصال وسجل الطلبات وإجمالي الإنفاق وعدد الطلبات ومتوسط قيمة الطلب. يمكنك أيضاً مراسلتهم مباشرة على واتساب.",
          fr: "Cliquez sur n'importe quel client pour ouvrir son profil. Vous verrez ses coordonnées, l'historique des commandes, le total dépensé, le nombre de commandes et la valeur moyenne. Vous pouvez aussi les contacter directement sur WhatsApp.",
        },
        image: "/docs/customers/customer-database-2.svg",
      },
      {
        title: { en: "Add tags and notes", ar: "إضافة تصنيفات وملاحظات", fr: "Ajouter des tags et notes" },
        description: {
          en: "Use tags to categorize customers (e.g. VIP, Wholesale, Loyal) and add notes for internal reference. Tags support autocomplete from previously used tags. Notes auto-save as you type.",
          ar: "استخدم التصنيفات لتصنيف العملاء (مثل VIP، بالجملة، وفيّ) وأضف ملاحظات للمرجع الداخلي. التصنيفات تدعم الإكمال التلقائي من التصنيفات المستخدمة سابقاً. الملاحظات تُحفظ تلقائياً أثناء الكتابة.",
          fr: "Utilisez les tags pour catégoriser les clients (ex. VIP, Grossiste, Fidèle) et ajoutez des notes pour référence interne. Les tags supportent l'auto-complétion. Les notes se sauvegardent automatiquement.",
        },
        image: "/docs/customers/customer-database-3.svg",
      },
      {
        title: { en: "Export customers to CSV", ar: "تصدير العملاء إلى CSV", fr: "Exporter les clients en CSV" },
        description: {
          en: "Click \"Export CSV\" to download your customer list. A confirmation dialog will appear before the download starts. The export includes name, phone, email, city, country, tags, currency, total spent, order count, first and last order dates, and notes. Available on Pro plan and during the free trial.",
          ar: "انقر \"تصدير CSV\" لتنزيل قائمة عملائك. سيظهر مربع تأكيد قبل بدء التنزيل. يتضمن التصدير: الاسم، الهاتف، البريد، المدينة، البلد، التصنيفات، العملة، إجمالي الإنفاق، عدد الطلبات، تواريخ أول وآخر طلب، والملاحظات. متاح في خطة Pro وخلال الفترة التجريبية.",
          fr: "Cliquez sur « Exporter CSV » pour télécharger votre liste de clients. Une boîte de confirmation apparaîtra avant le téléchargement. L'export inclut : nom, téléphone, email, ville, pays, tags, devise, total dépensé, nombre de commandes, dates de première et dernière commande, et notes. Disponible avec le plan Pro et pendant l'essai gratuit.",
        },
        image: "/docs/customers/customer-database-4.svg",
      },
    ],
    faqs: [
      {
        question: { en: "How are customer profiles created?", ar: "كيف يتم إنشاء ملفات العملاء؟", fr: "Comment les profils clients sont-ils créés ?" },
        answer: { en: "Customer profiles are created automatically when an order is placed. The system uses phone number normalization to match customers across different phone formats (local, international, with or without country code), so the same person placing multiple orders gets a single profile.", ar: "يتم إنشاء ملفات العملاء تلقائياً عند تقديم طلب. يستخدم النظام تطبيع أرقام الهاتف لمطابقة العملاء عبر صيغ هاتف مختلفة (محلي، دولي، مع أو بدون رمز البلد)، بحيث يحصل نفس الشخص الذي يقدم طلبات متعددة على ملف واحد.", fr: "Les profils clients sont créés automatiquement lors d'une commande. Le système normalise les numéros de téléphone pour matcher les clients à travers différents formats (local, international, avec ou sans indicatif pays), donc la même personne qui passe plusieurs commandes obtient un seul profil." },
      },
      {
        question: { en: "Can I delete a customer profile?", ar: "هل يمكنني حذف ملف عميل؟", fr: "Puis-je supprimer un profil client ?" },
        answer: { en: "Customer profiles are derived from orders and cannot be deleted directly. You can clear their tags and notes if needed. The profile data stays accurate and up-to-date as it's automatically maintained by the system.", ar: "ملفات العملاء مشتقة من الطلبات ولا يمكن حذفها مباشرة. يمكنك مسح التصنيفات والملاحظات عند الحاجة. تبقى بيانات الملف دقيقة ومحدثة لأن النظام يصونها تلقائياً.", fr: "Les profils clients sont dérivés des commandes et ne peuvent pas être supprimés directement. Vous pouvez effacer leurs tags et notes si nécessaire. Les données du profil restent précises et à jour car le système les maintient automatiquement." },
      },
    ],
  },

  // ── Shipping ─────────────────────────────────────────────────────────
  {
    slug: "setup-zones",
    category: "shipping",
    title: {
      en: "Setting up shipping zones",
      ar: "إعداد مناطق الشحن",
      fr: "Configurer les zones de livraison",
    },
    description: {
      en: "Create shipping zones with default delivery rates for each country.",
      ar: "أنشئ مناطق شحن بأسعار توصيل افتراضية لكل بلد.",
      fr: "Créez des zones de livraison avec des tarifs par défaut pour chaque pays.",
    },
    steps: [
      {
        title: {
          en: "Open the Shipping page",
          ar: "افتح صفحة الشحن",
          fr: "Ouvrez la page Livraison",
        },
        description: {
          en: "Click \"Shipping\" in the dashboard sidebar. This page lists all your shipping zones — one per country. If you haven't created any zones yet, you'll see an empty state with a button to add your first zone.",
          ar: "انقر على \"الشحن\" في الشريط الجانبي للوحة التحكم. تعرض هذه الصفحة جميع مناطق الشحن — واحدة لكل بلد. إذا لم تنشئ أي مناطق بعد، سترى حالة فارغة مع زر لإضافة أول منطقة.",
          fr: "Cliquez sur « Livraison » dans la barre latérale du tableau de bord. Cette page liste toutes vos zones de livraison — une par pays. Si vous n'avez pas encore créé de zone, vous verrez un état vide avec un bouton pour ajouter votre première zone.",
        },
        image: "/docs/shipping/setup-zones-1.svg",
      },
      {
        title: {
          en: "Add a shipping zone",
          ar: "أضف منطقة شحن",
          fr: "Ajoutez une zone de livraison",
        },
        description: {
          en: "Click \"Add Zone\" and select a country from the dropdown. Enter the default delivery rate — this is the fee charged to customers in that country unless overridden at the city level. Click save to create the zone.",
          ar: "انقر على \"إضافة منطقة\" واختر بلداً من القائمة. أدخل سعر التوصيل الافتراضي — هذا هو الرسم المفروض على العملاء في ذلك البلد ما لم يتم تعديله على مستوى المدينة. انقر حفظ لإنشاء المنطقة.",
          fr: "Cliquez sur « Ajouter une zone » et sélectionnez un pays dans la liste. Entrez le tarif de livraison par défaut — c'est le frais facturé aux clients de ce pays sauf s'il est remplacé au niveau de la ville. Cliquez sur enregistrer pour créer la zone.",
        },
        image: "/docs/shipping/setup-zones-2.svg",
      },
      {
        title: {
          en: "Toggle zone active or inactive",
          ar: "تفعيل أو تعطيل المنطقة",
          fr: "Activer ou désactiver la zone",
        },
        description: {
          en: "Each zone has an active toggle. When a zone is inactive, customers from that country won't see any delivery fee and the zone is ignored at checkout. This is useful for temporarily pausing delivery to a country without deleting the zone and its city overrides.",
          ar: "لكل منطقة زر تفعيل. عندما تكون المنطقة غير مفعلة، لن يرى العملاء من ذلك البلد أي رسوم توصيل وسيتم تجاهل المنطقة عند الدفع. هذا مفيد لإيقاف التوصيل مؤقتاً إلى بلد دون حذف المنطقة وتعديلات المدن.",
          fr: "Chaque zone a un bouton d'activation. Lorsqu'une zone est inactive, les clients de ce pays ne verront aucun frais de livraison et la zone est ignorée lors du paiement. C'est utile pour suspendre temporairement la livraison vers un pays sans supprimer la zone et ses ajustements de villes.",
        },
        image: "/docs/shipping/setup-zones-3.svg",
      },
      {
        title: {
          en: "Edit or delete zones",
          ar: "تعديل أو حذف المناطق",
          fr: "Modifier ou supprimer des zones",
        },
        description: {
          en: "You can update the default rate of any zone at any time. To remove a zone entirely, click the delete button — this will also remove all city-level overrides for that zone. If you set a zone's default rate to 0, customers in that country will see \"Free delivery\" at checkout.",
          ar: "يمكنك تحديث السعر الافتراضي لأي منطقة في أي وقت. لحذف منطقة بالكامل، انقر زر الحذف — سيؤدي هذا أيضاً إلى إزالة جميع تعديلات المدن لتلك المنطقة. إذا ضبطت السعر الافتراضي للمنطقة على 0، سيرى العملاء في ذلك البلد \"توصيل مجاني\" عند الدفع.",
          fr: "Vous pouvez modifier le tarif par défaut d'une zone à tout moment. Pour supprimer une zone entièrement, cliquez sur le bouton supprimer — cela supprimera aussi tous les ajustements de villes pour cette zone. Si vous mettez le tarif par défaut à 0, les clients de ce pays verront « Livraison gratuite » au moment du paiement.",
        },
      },
    ],
    faqs: [
      {
        question: { en: "What happens if I don't set up a shipping zone for a country?", ar: "ماذا يحدث إذا لم أعد منطقة شحن لبلد ما؟", fr: "Que se passe-t-il si je ne configure pas de zone de livraison pour un pays ?" },
        answer: { en: "If no shipping zone exists for a customer's country, no delivery fee will be calculated at checkout. Customers from that country can still place orders, but shipping cost won't be added to their total.", ar: "إذا لم توجد منطقة شحن لبلد العميل، لن يتم حساب رسوم التوصيل عند الدفع. يمكن لعملاء ذلك البلد تقديم طلبات، لكن لن تُضاف تكلفة الشحن إلى إجماليهم.", fr: "Si aucune zone n'existe pour le pays du client, aucun frais de livraison ne sera calculé. Les clients de ce pays peuvent toujours commander, mais les frais de livraison ne seront pas ajoutés à leur total." },
      },
      {
        question: { en: "Can I offer free shipping?", ar: "هل يمكنني تقديم شحن مجاني؟", fr: "Puis-je offrir la livraison gratuite ?" },
        answer: { en: "Yes, in two ways: set the zone's default rate to 0 for free shipping on all orders from that country, or set a free shipping threshold — orders above that amount get free delivery automatically.", ar: "نعم، بطريقتين: اضبط السعر الافتراضي للمنطقة على 0 للشحن المجاني لجميع الطلبات من ذلك البلد، أو حدد حد شحن مجاني — الطلبات فوق ذلك المبلغ تحصل على توصيل مجاني تلقائيًا.", fr: "Oui, de deux façons : mettez le tarif par défaut à 0 pour une livraison gratuite sur toutes les commandes de ce pays, ou définissez un seuil de livraison gratuite — les commandes au-dessus de ce montant bénéficient automatiquement de la gratuité." },
      },
    ],
  },
  {
    slug: "city-rates",
    category: "shipping",
    title: {
      en: "City-level delivery rates",
      ar: "أسعار التوصيل حسب المدينة",
      fr: "Tarifs de livraison par ville",
    },
    description: {
      en: "Override delivery fees for specific cities or exclude cities from delivery.",
      ar: "عدّل رسوم التوصيل لمدن محددة أو استثنِ مدناً من التوصيل.",
      fr: "Remplacez les frais de livraison pour des villes spécifiques ou excluez des villes de la livraison.",
    },
    steps: [
      {
        title: {
          en: "Expand a shipping zone",
          ar: "وسّع منطقة الشحن",
          fr: "Développez une zone de livraison",
        },
        description: {
          en: "Click on any shipping zone to expand it and see its city-level overrides. By default, all cities in a zone use the zone's default rate. You can add individual city overrides to charge different rates or block delivery to specific cities.",
          ar: "انقر على أي منطقة شحن لتوسيعها ورؤية تعديلات المدن. بشكل افتراضي، جميع المدن في المنطقة تستخدم السعر الافتراضي للمنطقة. يمكنك إضافة تعديلات لمدن معينة لتحصيل أسعار مختلفة أو حظر التوصيل لمدن محددة.",
          fr: "Cliquez sur une zone de livraison pour la développer et voir ses ajustements de villes. Par défaut, toutes les villes d'une zone utilisent le tarif par défaut. Vous pouvez ajouter des ajustements individuels pour facturer des tarifs différents ou bloquer la livraison vers des villes spécifiques.",
        },
        image: "/docs/shipping/city-rates-1.svg",
      },
      {
        title: {
          en: "Add a city override",
          ar: "أضف تعديل مدينة",
          fr: "Ajoutez un ajustement de ville",
        },
        description: {
          en: "Click \"Add City\" and type the city name. Enter a custom delivery rate for that city. This rate will be used instead of the zone's default rate when a customer enters this city at checkout. City names are matched case-insensitively, so \"new york\" and \"New York\" will both match.",
          ar: "انقر \"إضافة مدينة\" واكتب اسم المدينة. أدخل سعر توصيل مخصص لتلك المدينة. سيتم استخدام هذا السعر بدلاً من السعر الافتراضي للمنطقة عندما يدخل العميل هذه المدينة عند الدفع. تتم مطابقة أسماء المدن بغض النظر عن حالة الأحرف.",
          fr: "Cliquez « Ajouter une ville » et tapez le nom de la ville. Entrez un tarif de livraison personnalisé. Ce tarif sera utilisé à la place du tarif par défaut lorsqu'un client entre cette ville au moment du paiement. Les noms de villes sont insensibles à la casse.",
        },
      },
      {
        title: {
          en: "Exclude a city from delivery",
          ar: "استثنِ مدينة من التوصيل",
          fr: "Exclure une ville de la livraison",
        },
        description: {
          en: "When adding a city, check the \"Exclude\" option instead of entering a rate. This lets you control your delivery coverage precisely — excluded cities will display a clear message at checkout, so customers always know your service area upfront.",
          ar: "عند إضافة مدينة، حدد خيار \"استثناء\" بدلاً من إدخال سعر. يتيح لك ذلك التحكم الدقيق في نطاق التوصيل — ستعرض المدن المستثناة رسالة واضحة عند الدفع، ليعرف العملاء دائماً منطقة خدمتك مسبقاً.",
          fr: "Lors de l'ajout d'une ville, cochez l'option « Exclure » au lieu d'entrer un tarif. Cela vous permet de contrôler précisément votre zone de livraison — les villes exclues afficheront un message clair au moment du paiement, pour que vos clients connaissent toujours votre zone de service.",
        },
      },
      {
        title: {
          en: "Bulk add cities",
          ar: "إضافة مدن بالجملة",
          fr: "Ajouter des villes en masse",
        },
        description: {
          en: "To add many cities at once, use the bulk add feature. Enter one city name per line and set a rate or exclusion that applies to all of them. This saves time when setting up delivery for a country with many cities.",
          ar: "لإضافة عدة مدن دفعة واحدة، استخدم ميزة الإضافة بالجملة. أدخل اسم مدينة واحد في كل سطر وحدد سعراً أو استثناءً ينطبق على الجميع. هذا يوفر الوقت عند إعداد التوصيل لبلد يحتوي على مدن كثيرة.",
          fr: "Pour ajouter plusieurs villes à la fois, utilisez la fonction d'ajout en masse. Entrez un nom de ville par ligne et définissez un tarif ou une exclusion qui s'applique à toutes. Cela fait gagner du temps lors de la configuration de la livraison pour un pays avec de nombreuses villes.",
        },
      },
      {
        title: {
          en: "Import cities from CSV",
          ar: "استيراد المدن من CSV",
          fr: "Importer des villes depuis un CSV",
        },
        description: {
          en: "For countries with many cities and different rates per city, use the CSV import feature. Click \"Import CSV\" inside a zone, then upload a CSV file with three columns: City, Rate, and Excluded. Each city can have its own rate, or be marked as excluded (use \"yes\" in the Excluded column). You can download a template file to get the correct format. After uploading, you'll see a preview of all cities before confirming the import. Existing cities are updated automatically, new ones are added.",
          ar: "للدول التي تحتوي على مدن كثيرة وأسعار مختلفة لكل مدينة، استخدم ميزة استيراد CSV. انقر \"استيراد CSV\" داخل المنطقة، ثم ارفع ملف CSV بثلاثة أعمدة: المدينة، السعر، والاستثناء. يمكن لكل مدينة أن تحصل على سعرها الخاص، أو تُحدد كمستثناة (استخدم \"نعم\" في عمود الاستثناء). يمكنك تحميل ملف قالب للحصول على التنسيق الصحيح. بعد الرفع، سترى معاينة لجميع المدن قبل تأكيد الاستيراد. المدن الموجودة تُحدّث تلقائياً والجديدة تُضاف.",
          fr: "Pour les pays avec de nombreuses villes et des tarifs différents par ville, utilisez la fonction d'import CSV. Cliquez « Importer CSV » dans une zone, puis téléchargez un fichier CSV avec trois colonnes : Ville, Tarif et Exclue. Chaque ville peut avoir son propre tarif ou être marquée comme exclue (utilisez « oui » dans la colonne Exclue). Vous pouvez télécharger un modèle pour obtenir le bon format. Après le téléchargement, vous verrez un aperçu de toutes les villes avant de confirmer l'import. Les villes existantes sont mises à jour automatiquement, les nouvelles sont ajoutées.",
        },
      },
      {
        title: {
          en: "How customers see delivery fees",
          ar: "كيف يرى العملاء رسوم التوصيل",
          fr: "Comment les clients voient les frais de livraison",
        },
        description: {
          en: "At checkout, after the customer enters their country and city, the delivery fee is automatically calculated and shown in the order summary. If the store uses multi-market pricing, the delivery fee is converted to the market's currency at the same exchange rate as product prices. The fee is included in the order total and verified server-side when the order is placed.",
          ar: "عند الدفع، بعد أن يدخل العميل بلده ومدينته، يتم حساب رسوم التوصيل تلقائياً وعرضها في ملخص الطلب. إذا كان المتجر يستخدم تسعير متعدد الأسواق، يتم تحويل رسوم التوصيل إلى عملة السوق بنفس سعر صرف أسعار المنتجات. يتم تضمين الرسوم في إجمالي الطلب والتحقق منها على الخادم عند تقديم الطلب.",
          fr: "Au moment du paiement, après que le client entre son pays et sa ville, les frais de livraison sont automatiquement calculés et affichés dans le récapitulatif. Si la boutique utilise la tarification multi-marché, les frais sont convertis dans la devise du marché au même taux de change que les prix des produits. Les frais sont inclus dans le total et vérifiés côté serveur lors de la commande.",
        },
        image: "/docs/shipping/city-rates-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Are city names case-sensitive?", ar: "هل أسماء المدن حساسة لحالة الأحرف؟", fr: "Les noms de villes sont-ils sensibles à la casse ?" },
        answer: { en: "No, city names are matched case-insensitively. \"New York\", \"new york\", and \"NEW YORK\" will all match the same city override.", ar: "لا، تتم مطابقة أسماء المدن بغض النظر عن حالة الأحرف. \"New York\" و\"new york\" و\"NEW YORK\" ستتطابق جميعها مع نفس تعديل المدينة.", fr: "Non, les noms de villes sont insensibles à la casse. « New York », « new york » et « NEW YORK » correspondront tous au même ajustement de ville." },
      },
      {
        question: { en: "What does excluding a city mean for customers?", ar: "ماذا يعني استثناء مدينة للعملاء؟", fr: "Que signifie l'exclusion d'une ville pour les clients ?" },
        answer: { en: "The exclusion feature gives you full control over your delivery zones. Customers in excluded cities will see a clear notification at checkout, helping you focus your delivery operations on the areas you serve best.", ar: "تمنحك ميزة الاستثناء تحكماً كاملاً في مناطق التوصيل. سيرى العملاء في المدن المستثناة إشعاراً واضحاً عند الدفع، مما يساعدك على تركيز عمليات التوصيل على المناطق التي تخدمها بشكل أفضل.", fr: "La fonctionnalité d'exclusion vous donne un contrôle total sur vos zones de livraison. Les clients des villes exclues verront une notification claire au moment du paiement, vous aidant à concentrer vos opérations de livraison sur les zones que vous desservez le mieux." },
      },
      {
        question: { en: "What format should the CSV file use for importing cities?", ar: "ما تنسيق ملف CSV لاستيراد المدن؟", fr: "Quel format le fichier CSV doit-il utiliser pour importer des villes ?" },
        answer: { en: "The CSV needs three columns: City (the city name), Rate (the delivery fee as a number), and Excluded (\"yes\" or \"no\"). For excluded cities, leave the Rate column empty and set Excluded to \"yes\". You can download a template from the import dialog to get started quickly.", ar: "يحتاج ملف CSV إلى ثلاثة أعمدة: المدينة (اسم المدينة)، السعر (رسوم التوصيل كرقم)، والاستثناء (\"نعم\" أو \"لا\"). للمدن المستثناة، اترك عمود السعر فارغاً واضبط الاستثناء على \"نعم\". يمكنك تحميل قالب من نافذة الاستيراد للبدء بسرعة.", fr: "Le CSV nécessite trois colonnes : Ville (le nom de la ville), Tarif (les frais de livraison en nombre) et Exclue (« oui » ou « non »). Pour les villes exclues, laissez la colonne Tarif vide et mettez Exclue à « oui ». Vous pouvez télécharger un modèle depuis la boîte de dialogue d'import pour démarrer rapidement." },
      },
    ],
  },

  // ── Markets ──────────────────────────────────────────────────────────
  {
    slug: "create-market",
    category: "markets",
    title: {
      en: "Creating a new market",
      ar: "إنشاء سوق جديد",
      fr: "Créer un nouveau marché",
    },
    description: {
      en: "Set up a market for a specific region with its own currency.",
      ar: "أنشئ سوقًا لمنطقة محددة بعملتها الخاصة.",
      fr: "Configurez un marché pour une région spécifique avec sa propre devise.",
    },
    steps: [
      {
        title: { en: "Go to Markets", ar: "انتقل إلى الأسواق", fr: "Allez dans Marchés" },
        description: {
          en: "Click \"Markets\" in the sidebar to see your existing markets, then click \"Create Market\". Markets allow you to sell to customers in different countries with their own currency and pricing. For example, you could have a \"North Africa\" market in DZD and a \"Europe\" market in EUR.",
          ar: "انقر على \"الأسواق\" في الشريط الجانبي لرؤية أسواقك الحالية، ثم انقر على \"إنشاء سوق\". الأسواق تتيح لك البيع لعملاء في بلدان مختلفة بعملتهم وتسعيرهم الخاص. مثلاً، يمكن أن يكون لديك سوق \"شمال أفريقيا\" بالدينار الجزائري وسوق \"أوروبا\" باليورو.",
          fr: "Cliquez sur « Marchés » dans la barre latérale pour voir vos marchés existants, puis sur « Créer un marché ». Les marchés vous permettent de vendre à des clients dans différents pays avec leur propre devise et tarification. Par exemple, vous pourriez avoir un marché « Afrique du Nord » en DZD et un marché « Europe » en EUR.",
        },
        image: "/docs/markets/create-market-1.svg",
      },
      {
        title: { en: "Configure market details", ar: "اضبط تفاصيل السوق", fr: "Configurez les détails du marché" },
        description: {
          en: "Enter a descriptive name (e.g., \"Europe\", \"Gulf Countries\"), then select which countries belong to this market. Choose the currency customers will see prices in. Finally, pick a pricing mode: \"Auto\" automatically converts your base prices using a percentage adjustment you set (e.g., +10%), while \"Fixed\" lets you manually set a specific price for each product in this market's currency. Auto is simpler to manage, but Fixed gives you full control.",
          ar: "أدخل اسمًا وصفيًا (مثلاً \"أوروبا\"، \"دول الخليج\")، ثم اختر البلدان التي تنتمي لهذا السوق. اختر العملة التي سيرى بها العملاء الأسعار. أخيرًا، اختر وضع التسعير: \"تلقائي\" يحوّل أسعارك الأساسية تلقائيًا باستخدام نسبة مئوية تحددها (مثلاً +10%)، بينما \"ثابت\" يتيح لك تحديد سعر محدد يدويًا لكل منتج بعملة هذا السوق. التلقائي أسهل في الإدارة، لكن الثابت يمنحك تحكمًا كاملاً.",
          fr: "Entrez un nom descriptif (ex : « Europe », « Pays du Golfe »), puis sélectionnez les pays qui appartiennent à ce marché. Choisissez la devise dans laquelle les clients verront les prix. Enfin, choisissez un mode de tarification : « Auto » convertit automatiquement vos prix de base avec un pourcentage d'ajustement (ex : +10%), tandis que « Fixe » vous permet de définir manuellement un prix spécifique pour chaque produit dans la devise de ce marché. Auto est plus simple à gérer, mais Fixe vous donne un contrôle total.",
        },
        image: "/docs/markets/create-market-2.svg",
      },
      {
        title: { en: "Save and activate", ar: "احفظ وفعّل", fr: "Enregistrez et activez" },
        description: {
          en: "Click \"Create Market\" to save your new market. Then toggle the market to active so customers from those countries can see localized prices. If you chose \"Fixed\" pricing mode, you'll need to set individual product prices — click the ⋯ menu on the market and select \"Set prices\". Customers are automatically matched to a market based on the country they select during checkout.",
          ar: "انقر على \"إنشاء السوق\" لحفظ سوقك الجديد. ثم فعّل السوق ليتمكن العملاء من تلك البلدان من رؤية الأسعار المحلية. إذا اخترت وضع التسعير \"ثابت\"، ستحتاج لتحديد أسعار المنتجات الفردية — انقر على قائمة ⋯ في السوق واختر \"تحديد الأسعار\". يتم مطابقة العملاء تلقائيًا مع السوق بناءً على البلد الذي يختارونه أثناء الدفع.",
          fr: "Cliquez sur « Créer le marché » pour enregistrer. Puis activez le marché pour que les clients de ces pays voient les prix localisés. Si vous avez choisi le mode « Fixe », vous devrez définir les prix individuels — cliquez sur le menu ⋯ du marché et sélectionnez « Définir les prix ». Les clients sont automatiquement associés à un marché selon le pays qu'ils sélectionnent lors du paiement.",
        },
        image: "/docs/markets/create-market-3.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What is the difference between Auto and Fixed pricing?", ar: "ما الفرق بين التسعير التلقائي والثابت؟", fr: "Quelle est la différence entre la tarification Auto et Fixe ?" },
        answer: { en: "Auto pricing automatically converts your base prices using an exchange rate plus an optional percentage adjustment (e.g., +10%). Fixed pricing lets you set a specific price for each product in the market's currency. Auto is easier to manage for large catalogs, while Fixed gives you full control over individual product pricing.", ar: "التسعير التلقائي يحوّل أسعارك الأساسية تلقائيًا باستخدام سعر صرف مع نسبة تعديل اختيارية (مثلاً +10%). التسعير الثابت يتيح لك تحديد سعر محدد لكل منتج بعملة السوق. التلقائي أسهل في الإدارة لكتالوجات كبيرة، بينما الثابت يمنحك تحكمًا كاملاً في تسعير كل منتج.", fr: "Auto convertit automatiquement vos prix de base avec un taux de change et un pourcentage d'ajustement optionnel (ex : +10%). Fixe vous permet de définir un prix spécifique par produit dans la devise du marché. Auto est plus facile pour les grands catalogues, tandis que Fixe vous donne un contrôle total sur chaque prix." },
      },
      {
        question: { en: "How are customers matched to a market?", ar: "كيف يتم مطابقة العملاء مع السوق؟", fr: "Comment les clients sont-ils associés à un marché ?" },
        answer: { en: "Customers are automatically matched to a market based on the country they select during checkout. If their country isn't assigned to any market, the default market is used. Customers can also manually switch markets using the market picker on the storefront.", ar: "يتم مطابقة العملاء تلقائيًا مع السوق بناءً على البلد الذي يختارونه أثناء الدفع. إذا لم يكن بلدهم مخصصًا لأي سوق، يُستخدم السوق الافتراضي. يمكن للعملاء أيضًا التبديل يدويًا بين الأسواق باستخدام منتقي السوق في واجهة المتجر.", fr: "Les clients sont automatiquement associés à un marché en fonction du pays qu'ils sélectionnent lors du paiement. Si leur pays n'est assigné à aucun marché, le marché par défaut est utilisé. Les clients peuvent aussi changer de marché manuellement via le sélecteur sur la vitrine." },
      },
      {
        question: { en: "What rounding rules are available?", ar: "ما قواعد التقريب المتاحة؟", fr: "Quelles règles d'arrondi sont disponibles ?" },
        answer: { en: "Leadivo offers five rounding options for converted prices: None (no rounding), 0.99 (e.g., $9.99), 0.95 (e.g., $9.95), 0.00 (round to whole number, e.g., $10.00), and Nearest 5 (e.g., $10 or $15). This ensures your prices look clean after currency conversion.", ar: "يوفر Leadivo خمس خيارات تقريب للأسعار المحوّلة: بدون (لا تقريب)، 0.99 (مثلاً 9.99$)، 0.95 (مثلاً 9.95$)، 0.00 (تقريب لرقم صحيح مثلاً 10.00$)، وأقرب 5 (مثلاً 10$ أو 15$). هذا يضمن أن أسعارك تبدو نظيفة بعد تحويل العملة.", fr: "Leadivo propose cinq options d'arrondi : Aucun, 0,99 (ex : 9,99€), 0,95 (ex : 9,95€), 0,00 (arrondi à l'entier, ex : 10,00€) et Au 5 le plus proche (ex : 10€ ou 15€). Cela garantit des prix propres après la conversion de devise." },
      },
    ],
  },
  {
    slug: "market-pricing",
    category: "markets",
    title: {
      en: "Setting market-specific prices",
      ar: "تحديد أسعار خاصة بالسوق",
      fr: "Définir des prix spécifiques au marché",
    },
    description: {
      en: "Configure custom prices for products in a fixed-pricing market.",
      ar: "اضبط أسعارًا مخصصة للمنتجات في سوق بتسعير ثابت.",
      fr: "Configurez des prix personnalisés pour les produits dans un marché à tarification fixe.",
    },
    steps: [
      {
        title: { en: "Open the pricing editor", ar: "افتح محرر الأسعار", fr: "Ouvrez l'éditeur de prix" },
        description: {
          en: "From the Markets list, find the market you want to set prices for (must be a \"Fixed\" pricing mode market). Click the ⋯ menu on the right side of the market row and select \"Set prices\". This opens the pricing editor where you can see all your products and their current prices.",
          ar: "من قائمة الأسواق، ابحث عن السوق الذي تريد تحديد أسعاره (يجب أن يكون بوضع تسعير \"ثابت\"). انقر على قائمة ⋯ على الجانب الأيمن من صف السوق واختر \"تحديد الأسعار\". هذا يفتح محرر الأسعار حيث يمكنك رؤية جميع منتجاتك وأسعارها الحالية.",
          fr: "Depuis la liste des marchés, trouvez le marché pour lequel vous voulez définir les prix (doit être en mode « Fixe »). Cliquez sur le menu ⋯ à droite de la ligne du marché et sélectionnez « Définir les prix ». Cela ouvre l'éditeur de prix où vous pouvez voir tous vos produits et leurs prix actuels.",
        },
        image: "/docs/markets/market-pricing-1.svg",
      },
      {
        title: { en: "Set prices per product", ar: "حدد الأسعار لكل منتج", fr: "Définissez les prix par produit" },
        description: {
          en: "Enter the market-specific price for each product in the local currency. You can also set a \"compare-at\" price (the original/strikethrough price) for showing discounts. To save time, click \"Copy all from base\" to populate all fields with your default store prices as a starting point, then adjust as needed. Products without a market price set won't appear in this market. Click \"Save\" when done.",
          ar: "أدخل السعر الخاص بالسوق لكل منتج بالعملة المحلية. يمكنك أيضًا تحديد \"سعر المقارنة\" (السعر الأصلي/المشطوب) لإظهار الخصومات. لتوفير الوقت، انقر \"نسخ الكل من الأساس\" لملء جميع الحقول بأسعار متجرك الافتراضية كنقطة بداية، ثم عدّل حسب الحاجة. المنتجات بدون سعر سوق محدد لن تظهر في هذا السوق. انقر \"حفظ\" عند الانتهاء.",
          fr: "Entrez le prix spécifique au marché pour chaque produit dans la devise locale. Vous pouvez aussi définir un « prix barré » (le prix original/barré) pour afficher les réductions. Pour gagner du temps, cliquez sur « Copier tout depuis la base » pour remplir tous les champs avec vos prix par défaut comme point de départ, puis ajustez selon vos besoins. Les produits sans prix défini n'apparaîtront pas dans ce marché. Cliquez sur « Enregistrer » quand c'est fait.",
        },
        image: "/docs/markets/market-pricing-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What happens to products without a market price?", ar: "ماذا يحدث للمنتجات بدون سعر سوق؟", fr: "Que se passe-t-il pour les produits sans prix de marché ?" },
        answer: { en: "In a fixed-pricing market, products without a market-specific price set will not appear on the storefront for customers in that market. Make sure to set prices for all products you want visible.", ar: "في سوق بتسعير ثابت، المنتجات بدون سعر سوق محدد لن تظهر في واجهة المتجر لعملاء ذلك السوق. تأكد من تحديد أسعار لجميع المنتجات التي تريد أن تكون مرئية.", fr: "Dans un marché à tarification fixe, les produits sans prix défini n'apparaîtront pas sur la vitrine pour les clients de ce marché. Assurez-vous de définir les prix pour tous les produits que vous voulez rendre visibles." },
      },
      {
        question: { en: "Can I copy prices from my base currency as a starting point?", ar: "هل يمكنني نسخ الأسعار من عملتي الأساسية كنقطة بداية؟", fr: "Puis-je copier les prix de ma devise de base comme point de départ ?" },
        answer: { en: "Yes, click \"Copy all from base\" in the pricing editor to populate all fields with your default store prices. You can then adjust individual prices as needed before saving.", ar: "نعم، انقر \"نسخ الكل من الأساس\" في محرر الأسعار لملء جميع الحقول بأسعار متجرك الافتراضية. يمكنك بعد ذلك تعديل الأسعار الفردية حسب الحاجة قبل الحفظ.", fr: "Oui, cliquez sur « Copier tout depuis la base » dans l'éditeur de prix pour remplir tous les champs avec vos prix par défaut. Vous pouvez ensuite ajuster les prix individuels avant d'enregistrer." },
      },
    ],
  },
  {
    slug: "product-availability",
    category: "markets",
    title: {
      en: "Hiding products per market",
      ar: "إخفاء المنتجات حسب السوق",
      fr: "Masquer des produits par marché",
    },
    description: {
      en: "Control which products are visible in each market.",
      ar: "تحكم في المنتجات المرئية في كل سوق.",
      fr: "Contrôlez quels produits sont visibles dans chaque marché.",
    },
    steps: [
      {
        title: { en: "Open product availability", ar: "افتح توفر المنتجات", fr: "Ouvrez la disponibilité des produits" },
        description: {
          en: "From the Markets list, click the ⋯ menu on the market you want to manage and select \"Product availability\". This lets you control exactly which products are shown to customers in this specific market — useful if some products aren't available for shipping to certain regions or aren't relevant for that audience.",
          ar: "من قائمة الأسواق، انقر على قائمة ⋯ في السوق الذي تريد إدارته واختر \"توفر المنتجات\". هذا يتيح لك التحكم بالضبط في المنتجات المعروضة للعملاء في هذا السوق تحديدًا — مفيد إذا كانت بعض المنتجات غير متاحة للشحن لمناطق معينة أو غير مناسبة لذلك الجمهور.",
          fr: "Depuis la liste des marchés, cliquez sur le menu ⋯ du marché que vous voulez gérer et sélectionnez « Disponibilité des produits ». Cela vous permet de contrôler exactement quels produits sont visibles pour les clients de ce marché spécifique — utile si certains produits ne sont pas disponibles pour l'expédition vers certaines régions ou ne sont pas pertinents pour ce public.",
        },
        image: "/docs/markets/product-availability-1.svg",
      },
      {
        title: { en: "Toggle product visibility", ar: "بدّل ظهور المنتجات", fr: "Basculez la visibilité des produits" },
        description: {
          en: "You'll see a list of all your products with toggle switches next to each one. Turn a toggle off to hide that product from this market — it won't appear on the storefront for customers browsing from countries in this market. By default, all products are visible in all markets. Changes take effect immediately after saving. This is independent of the product's active/inactive status.",
          ar: "سترى قائمة بجميع منتجاتك مع أزرار تبديل بجانب كل واحد. أوقف الزر لإخفاء ذلك المنتج من هذا السوق — لن يظهر في واجهة المتجر للعملاء الذين يتصفحون من بلدان هذا السوق. افتراضيًا، جميع المنتجات مرئية في جميع الأسواق. التغييرات تسري فورًا بعد الحفظ. هذا مستقل عن حالة تفعيل/إلغاء تفعيل المنتج.",
          fr: "Vous verrez une liste de tous vos produits avec des interrupteurs à côté de chacun. Désactivez un interrupteur pour masquer ce produit de ce marché — il n'apparaîtra pas sur la vitrine pour les clients naviguant depuis les pays de ce marché. Par défaut, tous les produits sont visibles dans tous les marchés. Les changements prennent effet immédiatement après la sauvegarde. Ceci est indépendant du statut actif/inactif du produit.",
        },
        image: "/docs/markets/product-availability-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Is product availability per market different from the product's active status?", ar: "هل توفر المنتج حسب السوق مختلف عن حالة تفعيل المنتج؟", fr: "La disponibilité par marché est-elle différente du statut actif du produit ?" },
        answer: { en: "Yes, they are independent. A product's active/inactive status controls global visibility. Market availability controls whether a visible (active) product appears in a specific market. A product must be active AND available in the market to be shown.", ar: "نعم، هما مستقلان. حالة تفعيل/إلغاء تفعيل المنتج تتحكم في الظهور العام. توفر السوق يتحكم في ما إذا كان المنتج المرئي (النشط) يظهر في سوق محدد. يجب أن يكون المنتج نشطًا ومتاحًا في السوق ليُعرض.", fr: "Oui, ils sont indépendants. Le statut actif/inactif contrôle la visibilité globale. La disponibilité de marché contrôle si un produit visible (actif) apparaît dans un marché spécifique. Un produit doit être actif ET disponible dans le marché pour être affiché." },
      },
    ],
  },

  // ── Discounts ────────────────────────────────────────────────────────
  {
    slug: "create-discount",
    category: "discounts",
    title: {
      en: "Creating a discount code",
      ar: "إنشاء كود خصم",
      fr: "Créer un code de réduction",
    },
    description: {
      en: "Set up promotional discount codes for your customers.",
      ar: "أنشئ أكواد خصم ترويجية لعملائك.",
      fr: "Configurez des codes de réduction promotionnels pour vos clients.",
    },
    steps: [
      {
        title: { en: "Go to Discounts", ar: "انتقل إلى التخفيضات", fr: "Allez dans Réductions" },
        description: {
          en: "Click \"Discounts\" in the sidebar to see your existing discount codes, then click \"Create Discount\" to make a new one. Discount codes are a great way to attract new customers, reward loyal ones, or run promotional campaigns on social media.",
          ar: "انقر على \"التخفيضات\" في الشريط الجانبي لرؤية أكواد الخصم الحالية، ثم انقر على \"إنشاء خصم\" لإنشاء واحد جديد. أكواد الخصم طريقة رائعة لجذب عملاء جدد ومكافأة العملاء المخلصين أو تشغيل حملات ترويجية على وسائل التواصل الاجتماعي.",
          fr: "Cliquez sur « Réductions » dans la barre latérale pour voir vos codes existants, puis sur « Créer une réduction » pour en créer un nouveau. Les codes de réduction sont un excellent moyen d'attirer de nouveaux clients, de récompenser les fidèles ou de lancer des campagnes promotionnelles sur les réseaux sociaux.",
        },
        image: "/docs/discounts/create-discount-1.svg",
      },
      {
        title: { en: "Configure the discount", ar: "اضبط الخصم", fr: "Configurez la réduction" },
        description: {
          en: "Enter a memorable code that customers will type at checkout (e.g., SUMMER20, WELCOME10). Choose the discount type: \"Percentage\" takes a percentage off the total (e.g., 20% off), while \"Fixed amount\" subtracts a specific value (e.g., $5 off). Set the discount value, and optionally configure: a minimum order amount (the discount only applies if the cart total reaches this amount), and a usage limit (how many times the code can be used before it expires). Click \"Create\" to save the discount.",
          ar: "أدخل كودًا سهل التذكر يكتبه العملاء عند الدفع (مثلاً SUMMER20, WELCOME10). اختر نوع الخصم: \"نسبة مئوية\" تخصم نسبة من الإجمالي (مثلاً 20% خصم)، بينما \"مبلغ ثابت\" يخصم قيمة محددة (مثلاً 5$ خصم). حدد قيمة الخصم، واختياريًا اضبط: حد أدنى للطلب (الخصم يُطبق فقط إذا وصل إجمالي السلة لهذا المبلغ)، وحد للاستخدام (كم مرة يمكن استخدام الكود قبل انتهاء صلاحيته). انقر \"إنشاء\" لحفظ الخصم.",
          fr: "Entrez un code mémorable que les clients saisiront lors du paiement (ex : SUMMER20, WELCOME10). Choisissez le type : « Pourcentage » retire un pourcentage du total (ex : 20% de réduction), tandis que « Montant fixe » soustrait une valeur spécifique (ex : 5€ de réduction). Définissez la valeur de la réduction, et configurez optionnellement : un montant minimum de commande (la réduction ne s'applique que si le total du panier atteint ce montant), et une limite d'utilisation (combien de fois le code peut être utilisé avant expiration). Cliquez sur « Créer » pour enregistrer la réduction.",
        },
        image: "/docs/discounts/create-discount-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Can I limit a discount to specific markets?", ar: "هل يمكنني تقييد الخصم بأسواق محددة؟", fr: "Puis-je limiter une réduction à des marchés spécifiques ?" },
        answer: { en: "Yes, when creating a discount you can select which markets it applies to. If no markets are selected, the discount applies to all markets. This lets you run region-specific promotions.", ar: "نعم، عند إنشاء خصم يمكنك تحديد الأسواق التي ينطبق عليها. إذا لم تُحدد أسواق، ينطبق الخصم على جميع الأسواق. هذا يتيح لك تشغيل عروض ترويجية خاصة بمنطقة.", fr: "Oui, lors de la création d'une réduction, vous pouvez sélectionner les marchés auxquels elle s'applique. Si aucun marché n'est sélectionné, la réduction s'applique à tous. Cela vous permet de lancer des promotions régionales." },
      },
      {
        question: { en: "Can I set an expiration date for a discount?", ar: "هل يمكنني تحديد تاريخ انتهاء للخصم؟", fr: "Puis-je définir une date d'expiration pour une réduction ?" },
        answer: { en: "Yes, you can set both a start date and an end date for any discount. The discount will only be valid during that time period. You can also set a maximum usage limit for additional control.", ar: "نعم، يمكنك تحديد تاريخ بداية وتاريخ انتهاء لأي خصم. سيكون الخصم صالحًا فقط خلال تلك الفترة الزمنية. يمكنك أيضًا تحديد حد أقصى للاستخدام لمزيد من التحكم.", fr: "Oui, vous pouvez définir une date de début et de fin pour toute réduction. La réduction ne sera valide que pendant cette période. Vous pouvez aussi définir une limite d'utilisation maximale." },
      },
      {
        question: { en: "What happens if a customer tries to use an expired or maxed-out discount?", ar: "ماذا يحدث إذا حاول عميل استخدام خصم منتهي أو مستنفد؟", fr: "Que se passe-t-il si un client essaie d'utiliser une réduction expirée ou épuisée ?" },
        answer: { en: "The system validates discount codes in real-time at checkout and provides clear feedback to customers. It checks expiration dates, usage limits, and minimum order requirements automatically, keeping the checkout experience smooth and transparent.", ar: "يتحقق النظام من أكواد الخصم في الوقت الفعلي عند الدفع ويقدم ملاحظات واضحة للعملاء. يتحقق تلقائياً من تواريخ الانتهاء وحدود الاستخدام ومتطلبات الحد الأدنى للطلب، مما يحافظ على تجربة دفع سلسة وشفافة.", fr: "Le système valide les codes de réduction en temps réel au moment du paiement et fournit des retours clairs aux clients. Il vérifie automatiquement les dates d'expiration, les limites d'utilisation et les montants minimum requis, garantissant une expérience de paiement fluide et transparente." },
      },
    ],
  },

  // ── Integrations ─────────────────────────────────────────────────────
  {
    slug: "whatsapp",
    category: "integrations",
    title: {
      en: "Setting up WhatsApp notifications",
      ar: "إعداد إشعارات واتساب",
      fr: "Configurer les notifications WhatsApp",
    },
    description: {
      en: "Receive order notifications on WhatsApp.",
      ar: "استقبل إشعارات الطلبات على واتساب.",
      fr: "Recevez les notifications de commandes sur WhatsApp.",
    },
    steps: [
      {
        title: { en: "Go to Integrations", ar: "انتقل إلى التكاملات", fr: "Allez dans Intégrations" },
        description: {
          en: "Click \"Integrations\" in the sidebar to see all available apps you can connect to your store. Integrations are organized by category — WhatsApp is under \"Notifications\". Each integration card shows a brief description of what it does.",
          ar: "انقر على \"التكاملات\" في الشريط الجانبي لرؤية جميع التطبيقات المتاحة التي يمكنك ربطها بمتجرك. التكاملات مُنظمة حسب الفئة — واتساب تحت \"الإشعارات\". كل بطاقة تكامل تعرض وصفًا مختصرًا لما تفعله.",
          fr: "Cliquez sur « Intégrations » dans la barre latérale pour voir toutes les applications disponibles que vous pouvez connecter à votre boutique. Les intégrations sont organisées par catégorie — WhatsApp est sous « Notifications ». Chaque carte d'intégration affiche une brève description de ce qu'elle fait.",
        },
        image: "/docs/integrations/whatsapp-1.svg",
      },
      {
        title: { en: "Install WhatsApp", ar: "ثبّت واتساب", fr: "Installez WhatsApp" },
        description: {
          en: "Find the WhatsApp integration card under Notifications and click \"Install\" to add it to your store. Once installed, click \"Setup\" to configure your WhatsApp Business phone number. This integration will send you automatic notifications on WhatsApp every time a customer places a new order.",
          ar: "ابحث عن بطاقة تكامل واتساب تحت الإشعارات وانقر \"تثبيت\" لإضافته إلى متجرك. بعد التثبيت، انقر \"إعداد\" لضبط رقم هاتف واتساب للأعمال الخاص بك. هذا التكامل سيرسل لك إشعارات تلقائية على واتساب في كل مرة يقدم فيها عميل طلبًا جديدًا.",
          fr: "Trouvez la carte d'intégration WhatsApp sous Notifications et cliquez sur « Installer » pour l'ajouter à votre boutique. Une fois installée, cliquez sur « Configurer » pour paramétrer votre numéro WhatsApp Business. Cette intégration vous enverra des notifications automatiques sur WhatsApp à chaque nouvelle commande d'un client.",
        },
        image: "/docs/integrations/whatsapp-2.svg",
      },
      {
        title: { en: "Connect your account", ar: "اربط حسابك", fr: "Connectez votre compte" },
        description: {
          en: "Follow the on-screen setup instructions to connect your WhatsApp Business account. You'll need to enter your phone number and authorize the connection. Once connected, you'll automatically receive detailed order notifications including customer name, items ordered, total amount, and shipping address — directly in your WhatsApp chat. You can disconnect at any time from the same Integrations page.",
          ar: "اتبع تعليمات الإعداد على الشاشة لربط حساب واتساب للأعمال الخاص بك. ستحتاج لإدخال رقم هاتفك والموافقة على الاتصال. بمجرد الربط، ستتلقى تلقائيًا إشعارات طلبات مفصلة تتضمن اسم العميل والعناصر المطلوبة والمبلغ الإجمالي وعنوان الشحن — مباشرةً في محادثة واتساب. يمكنك إلغاء الربط في أي وقت من نفس صفحة التكاملات.",
          fr: "Suivez les instructions de configuration à l'écran pour connecter votre compte WhatsApp Business. Vous devrez entrer votre numéro de téléphone et autoriser la connexion. Une fois connecté, vous recevrez automatiquement des notifications détaillées incluant le nom du client, les articles commandés, le montant total et l'adresse de livraison — directement dans votre chat WhatsApp. Vous pouvez vous déconnecter à tout moment depuis la même page Intégrations.",
        },
        image: "/docs/integrations/whatsapp-3.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What kind of notifications will I receive on WhatsApp?", ar: "ما نوع الإشعارات التي سأتلقاها على واتساب؟", fr: "Quel type de notifications recevrai-je sur WhatsApp ?" },
        answer: { en: "You'll receive detailed order notifications including customer name, items ordered, quantities, total amount, shipping address, phone number, and payment method. Notifications are AI-generated in the customer's language for a personalized touch.", ar: "ستتلقى إشعارات طلبات مفصلة تتضمن اسم العميل والعناصر المطلوبة والكميات والمبلغ الإجمالي وعنوان الشحن ورقم الهاتف وطريقة الدفع. الإشعارات تُنشأ بالذكاء الاصطناعي بلغة العميل للمسة شخصية.", fr: "Vous recevrez des notifications détaillées incluant le nom du client, les articles commandés, les quantités, le montant total, l'adresse de livraison, le numéro de téléphone et le mode de paiement. Les notifications sont générées par IA dans la langue du client." },
      },
      {
        question: { en: "Does WhatsApp also send abandoned checkout recovery messages?", ar: "هل يرسل واتساب أيضًا رسائل استرداد السلات المتروكة؟", fr: "WhatsApp envoie-t-il aussi des messages de récupération de paniers abandonnés ?" },
        answer: { en: "Yes, when a customer abandons their checkout, WhatsApp will automatically send them a recovery message with a link to complete their purchase. This happens 30 minutes after the checkout is abandoned.", ar: "نعم، عندما يترك عميل سلته، سيرسل واتساب تلقائيًا رسالة استرداد مع رابط لإتمام الشراء. يحدث هذا بعد 30 دقيقة من ترك السلة.", fr: "Oui, quand un client abandonne son panier, WhatsApp lui envoie automatiquement un message de récupération avec un lien pour finaliser l'achat. Cela se produit 30 minutes après l'abandon." },
      },
    ],
  },
  {
    slug: "meta-pixel",
    category: "integrations",
    title: {
      en: "Setting up Meta Pixel",
      ar: "إعداد ميتا بيكسل",
      fr: "Configurer le Meta Pixel",
    },
    description: {
      en: "Track conversions with Facebook/Meta Pixel.",
      ar: "تتبع التحويلات باستخدام بيكسل فيسبوك/ميتا.",
      fr: "Suivez les conversions avec le Pixel Facebook/Meta.",
    },
    steps: [
      {
        title: { en: "Install Meta CAPI integration", ar: "ثبّت تكامل Meta CAPI", fr: "Installez l'intégration Meta CAPI" },
        description: {
          en: "Go to Integrations and find the \"Meta Conversions API\" card under the Tracking category. Click \"Install\" to add it, then click \"Configure\" to set it up. This integration tracks customer actions on your store (page views, add to cart, purchases) and sends them to Facebook/Meta for ad optimization and analytics.",
          ar: "انتقل إلى التكاملات وابحث عن بطاقة \"Meta Conversions API\" تحت فئة التتبع. انقر \"تثبيت\" لإضافته، ثم انقر \"إعداد\" لضبطه. هذا التكامل يتتبع إجراءات العملاء في متجرك (مشاهدات الصفحات، الإضافة للسلة، المشتريات) ويرسلها إلى فيسبوك/ميتا لتحسين الإعلانات والتحليلات.",
          fr: "Allez dans Intégrations et trouvez la carte « Meta Conversions API » sous la catégorie Suivi. Cliquez sur « Installer » pour l'ajouter, puis sur « Configurer » pour le paramétrer. Cette intégration suit les actions des clients sur votre boutique (vues de pages, ajouts au panier, achats) et les envoie à Facebook/Meta pour l'optimisation des publicités et les analyses.",
        },
        image: "/docs/integrations/meta-pixel-1.svg",
      },
      {
        title: { en: "Enter your Pixel ID and Access Token", ar: "أدخل معرّف البيكسل ورمز الوصول", fr: "Entrez votre Pixel ID et Access Token" },
        description: {
          en: "You'll need two pieces of information from your Meta Business Manager: your Pixel ID (a number found in Events Manager > Data Sources) and a Conversions API Access Token (generated in Events Manager > Settings). Paste both into the corresponding fields. Optionally, add a Test Event Code if you want to verify events are being sent correctly — you can find this in Events Manager > Test Events. When a test code is present, events are sent in test mode and won't affect your real data.",
          ar: "ستحتاج لمعلومتين من Meta Business Manager: معرّف البيكسل (رقم موجود في مدير الأحداث > مصادر البيانات) ورمز وصول Conversions API (يُنشأ في مدير الأحداث > الإعدادات). الصق كليهما في الحقول المقابلة. اختياريًا، أضف كود حدث اختبار إذا أردت التحقق من إرسال الأحداث بشكل صحيح — يمكنك إيجاده في مدير الأحداث > اختبار الأحداث. عند وجود كود اختبار، تُرسل الأحداث في وضع الاختبار ولن تؤثر على بياناتك الحقيقية.",
          fr: "Vous aurez besoin de deux informations de votre Meta Business Manager : votre Pixel ID (un numéro trouvé dans Gestionnaire d'événements > Sources de données) et un Token d'accès API Conversions (généré dans Gestionnaire d'événements > Paramètres). Collez les deux dans les champs correspondants. Optionnellement, ajoutez un Code d'événement test si vous voulez vérifier que les événements sont bien envoyés — vous le trouverez dans Gestionnaire d'événements > Tester les événements. Quand un code test est présent, les événements sont envoyés en mode test et n'affecteront pas vos données réelles.",
        },
        image: "/docs/integrations/meta-pixel-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What events does Meta Pixel track?", ar: "ما الأحداث التي يتتبعها ميتا بيكسل؟", fr: "Quels événements le Meta Pixel suit-il ?" },
        answer: { en: "Leadivo tracks four key events: ViewContent (when a customer views a product page), AddToCart (when they add an item to cart), InitiateCheckout (when they visit the cart page), and Purchase (when an order is placed — this one is sent server-side via the Conversions API for accuracy).", ar: "يتتبع Leadivo أربعة أحداث رئيسية: ViewContent (عندما يشاهد العميل صفحة منتج)، AddToCart (عند إضافة عنصر للسلة)، InitiateCheckout (عند زيارة صفحة السلة)، وPurchase (عند تقديم طلب — يُرسل هذا من الخادم عبر Conversions API للدقة).", fr: "Leadivo suit quatre événements clés : ViewContent (quand un client voit une page produit), AddToCart (quand il ajoute au panier), InitiateCheckout (quand il visite le panier) et Purchase (quand une commande est passée — envoyé côté serveur via l'API Conversions pour plus de précision)." },
      },
      {
        question: { en: "What is a Test Event Code?", ar: "ما هو كود حدث الاختبار؟", fr: "Qu'est-ce qu'un code d'événement test ?" },
        answer: { en: "A Test Event Code lets you verify that events are being sent correctly to Meta without affecting your real analytics data. You can find it in Meta Events Manager > Test Events. When present, events are sent in test mode. Remove it when you're ready to go live.", ar: "كود حدث الاختبار يتيح لك التحقق من إرسال الأحداث بشكل صحيح لميتا دون التأثير على بيانات التحليلات الحقيقية. يمكنك إيجاده في مدير الأحداث > اختبار الأحداث. عند وجوده، تُرسل الأحداث في وضع الاختبار. أزله عندما تكون جاهزًا للإطلاق.", fr: "Un code d'événement test vous permet de vérifier que les événements sont correctement envoyés à Meta sans affecter vos données réelles. Vous le trouverez dans Gestionnaire d'événements > Tester les événements. Quand il est présent, les événements sont en mode test. Retirez-le quand vous êtes prêt." },
      },
    ],
  },
  {
    slug: "google-sheets",
    category: "integrations",
    title: {
      en: "Connecting Google Sheets",
      ar: "ربط جوجل شيتس",
      fr: "Connecter Google Sheets",
    },
    description: {
      en: "Automatically export orders to a Google Spreadsheet.",
      ar: "صدّر الطلبات تلقائيًا إلى جدول بيانات جوجل.",
      fr: "Exportez automatiquement les commandes vers une feuille Google.",
    },
    steps: [
      {
        title: { en: "Install Google Sheets integration", ar: "ثبّت تكامل جوجل شيتس", fr: "Installez l'intégration Google Sheets" },
        description: {
          en: "Go to Integrations and find the \"Google Sheets\" card under Productivity. Click \"Install\" to add it to your store, then click \"Setup\" to configure the connection. This integration automatically adds a new row to your Google Spreadsheet every time a customer places an order — so you always have an up-to-date record of all your orders.",
          ar: "انتقل إلى التكاملات وابحث عن بطاقة \"جوجل شيتس\" تحت الأتمتة. انقر \"تثبيت\" لإضافته إلى متجرك، ثم انقر \"إعداد\" لضبط الاتصال. هذا التكامل يضيف تلقائيًا صفًا جديدًا إلى جدول بيانات جوجل الخاص بك في كل مرة يقدم فيها عميل طلبًا — حتى يكون لديك دائمًا سجل محدث لجميع طلباتك.",
          fr: "Allez dans Intégrations et trouvez la carte « Google Sheets » sous Automatisation. Cliquez sur « Installer » pour l'ajouter, puis sur « Configurer » pour paramétrer la connexion. Cette intégration ajoute automatiquement une nouvelle ligne à votre feuille Google à chaque commande — vous avez ainsi toujours un enregistrement à jour de toutes vos commandes.",
        },
        image: "/docs/integrations/google-sheets-1.svg",
      },
      {
        title: { en: "Connect your Google account", ar: "اربط حساب جوجل", fr: "Connectez votre compte Google" },
        description: {
          en: "Click \"Connect Google Account\" and sign in with the Google account where you want the spreadsheet to be created. After authorizing access, you can choose which order fields to include in your spreadsheet (e.g., customer name, phone, items, total, address, status). A new spreadsheet will be automatically created in your Google Drive. Each new order will appear as a new row with the fields you selected.",
          ar: "انقر \"ربط حساب جوجل\" وسجّل الدخول بحساب جوجل الذي تريد إنشاء جدول البيانات فيه. بعد الموافقة على الوصول، يمكنك اختيار حقول الطلب التي تريد تضمينها في الجدول (مثلاً اسم العميل، الهاتف، العناصر، الإجمالي، العنوان، الحالة). سيتم إنشاء جدول بيانات جديد تلقائيًا في Google Drive الخاص بك. سيظهر كل طلب جديد كصف جديد بالحقول التي اخترتها.",
          fr: "Cliquez sur « Connecter le compte Google » et connectez-vous avec le compte Google où vous voulez que le tableur soit créé. Après avoir autorisé l'accès, vous pouvez choisir quels champs de commande inclure dans votre tableur (ex : nom du client, téléphone, articles, total, adresse, statut). Un nouveau tableur sera automatiquement créé dans votre Google Drive. Chaque nouvelle commande apparaîtra comme une nouvelle ligne avec les champs que vous avez sélectionnés.",
        },
        image: "/docs/integrations/google-sheets-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What order fields can I export to Google Sheets?", ar: "ما حقول الطلب التي يمكنني تصديرها إلى Google Sheets؟", fr: "Quels champs de commande puis-je exporter vers Google Sheets ?" },
        answer: { en: "You can choose from 20+ fields including: order number, customer name, email, phone, address, city, country, total, currency, items, status, date, payment method, delivery fee, discount amount, subtotal, and more. You select which fields to include during setup.", ar: "يمكنك الاختيار من 20+ حقل بما في ذلك: رقم الطلب، اسم العميل، البريد الإلكتروني، الهاتف، العنوان، المدينة، البلد، الإجمالي، العملة، العناصر، الحالة، التاريخ، طريقة الدفع، رسوم التوصيل، مبلغ الخصم، المجموع الفرعي، والمزيد. تختار الحقول التي تريد تضمينها أثناء الإعداد.", fr: "Vous pouvez choisir parmi plus de 20 champs dont : numéro de commande, nom du client, email, téléphone, adresse, ville, pays, total, devise, articles, statut, date, mode de paiement, frais de livraison, montant de réduction, sous-total et plus. Vous sélectionnez les champs à inclure lors de la configuration." },
      },
      {
        question: { en: "Does Google Sheets also track abandoned checkouts?", ar: "هل يتتبع Google Sheets أيضًا السلات المتروكة؟", fr: "Google Sheets suit-il aussi les paniers abandonnés ?" },
        answer: { en: "Yes, abandoned checkouts are also logged to your Google Spreadsheet when the Google Sheets integration is enabled. This gives you a complete record of both completed orders and abandoned carts.", ar: "نعم، السلات المتروكة تُسجل أيضًا في جدول بيانات جوجل عند تفعيل تكامل Google Sheets. هذا يمنحك سجلاً كاملاً للطلبات المكتملة والسلات المتروكة.", fr: "Oui, les paniers abandonnés sont aussi enregistrés dans votre feuille Google lorsque l'intégration est activée. Cela vous donne un enregistrement complet des commandes finalisées et des paniers abandonnés." },
      },
      {
        question: { en: "Can I manually sync existing orders?", ar: "هل يمكنني مزامنة الطلبات الحالية يدويًا؟", fr: "Puis-je synchroniser manuellement les commandes existantes ?" },
        answer: { en: "Yes, use the \"Sync\" button in the Google Sheets integration settings to manually sync all your existing orders to the spreadsheet at any time.", ar: "نعم، استخدم زر \"مزامنة\" في إعدادات تكامل Google Sheets لمزامنة جميع طلباتك الحالية يدويًا إلى جدول البيانات في أي وقت.", fr: "Oui, utilisez le bouton « Synchroniser » dans les paramètres de l'intégration pour synchroniser manuellement toutes vos commandes existantes vers le tableur à tout moment." },
      },
    ],
  },

  // ── Integrations (continued) ──────────────────────────────────────────
  {
    slug: "tiktok-pixel",
    category: "integrations",
    title: {
      en: "Setting up TikTok Pixel",
      ar: "إعداد تيك توك بيكسل",
      fr: "Configurer le TikTok Pixel",
    },
    description: {
      en: "Track conversions and optimize TikTok ads with the Event API.",
      ar: "تتبع التحويلات وحسّن إعلانات تيك توك باستخدام Event API.",
      fr: "Suivez les conversions et optimisez vos publicités TikTok avec l'Event API.",
    },
    steps: [
      {
        title: { en: "Install TikTok Event API integration", ar: "ثبّت تكامل TikTok Event API", fr: "Installez l'intégration TikTok Event API" },
        description: {
          en: "Go to Integrations and find the \"TikTok Event API\" card under the Tracking category. Click \"Install\" to add it, then click \"Configure\" to set it up. This integration sends customer actions (page views, add to cart, purchases) to TikTok for ad optimization and conversion tracking — similar to how Meta Pixel works for Facebook ads.",
          ar: "انتقل إلى التكاملات وابحث عن بطاقة \"TikTok Event API\" تحت فئة التتبع. انقر \"تثبيت\" لإضافته، ثم انقر \"إعداد\" لضبطه. هذا التكامل يرسل إجراءات العملاء (مشاهدات الصفحات، الإضافة للسلة، المشتريات) إلى تيك توك لتحسين الإعلانات وتتبع التحويلات — بشكل مشابه لعمل ميتا بيكسل لإعلانات فيسبوك.",
          fr: "Allez dans Intégrations et trouvez la carte « TikTok Event API » sous Suivi. Cliquez sur « Installer » puis « Configurer ». Cette intégration envoie les actions des clients (vues de pages, ajouts au panier, achats) à TikTok pour l'optimisation des publicités et le suivi des conversions — similaire au Meta Pixel pour les publicités Facebook.",
        },
      },
      {
        title: { en: "Enter your Pixel Code and Access Token", ar: "أدخل كود البيكسل ورمز الوصول", fr: "Entrez votre Pixel Code et Access Token" },
        description: {
          en: "You'll need your TikTok Pixel Code and an Access Token from TikTok Events Manager. Paste both into the corresponding fields. You can optionally add a Test Event Code to verify events are being sent correctly before going live. Events tracked include ViewContent, AddToCart, InitiateCheckout, and CompletePayment.",
          ar: "ستحتاج لكود بيكسل تيك توك ورمز وصول من TikTok Events Manager. الصق كليهما في الحقول المقابلة. يمكنك اختياريًا إضافة كود حدث اختبار للتحقق من إرسال الأحداث بشكل صحيح قبل الإطلاق. الأحداث المتتبعة تشمل ViewContent وAddToCart وInitiateCheckout وCompletePayment.",
          fr: "Vous aurez besoin de votre Pixel Code TikTok et d'un Access Token de TikTok Events Manager. Collez les deux dans les champs correspondants. Vous pouvez optionnellement ajouter un Code d'événement test pour vérifier l'envoi avant le lancement. Les événements suivis incluent ViewContent, AddToCart, InitiateCheckout et CompletePayment.",
        },
        image: "/docs/integrations/tiktok-pixel-1.svg",
      },
    ],
    faqs: [
      {
        question: { en: "What events does TikTok Pixel track?", ar: "ما الأحداث التي يتتبعها تيك توك بيكسل؟", fr: "Quels événements le TikTok Pixel suit-il ?" },
        answer: { en: "TikTok Event API tracks four events: ViewContent (product page views), AddToCart (items added to cart), InitiateCheckout (cart page visits), and CompletePayment (completed orders). These events help TikTok optimize your ad delivery and measure conversions.", ar: "يتتبع TikTok Event API أربعة أحداث: ViewContent (مشاهدات صفحات المنتجات)، AddToCart (إضافة عناصر للسلة)، InitiateCheckout (زيارات صفحة السلة)، وCompletePayment (طلبات مكتملة). تساعد هذه الأحداث تيك توك في تحسين عرض إعلاناتك وقياس التحويلات.", fr: "TikTok Event API suit quatre événements : ViewContent (vues de pages produits), AddToCart (ajouts au panier), InitiateCheckout (visites du panier) et CompletePayment (commandes terminées). Ces événements aident TikTok à optimiser la diffusion de vos publicités et mesurer les conversions." },
      },
      {
        question: { en: "Where do I find my TikTok Pixel Code?", ar: "أين أجد كود بيكسل تيك توك؟", fr: "Où trouver mon Pixel Code TikTok ?" },
        answer: { en: "Your TikTok Pixel Code can be found in TikTok Events Manager under your TikTok Ads Manager account. Navigate to Assets > Events and you'll see your Pixel Code listed there.", ar: "يمكنك إيجاد كود بيكسل تيك توك في TikTok Events Manager تحت حساب TikTok Ads Manager. انتقل إلى الأصول > الأحداث وسترى كود البيكسل مدرجًا هناك.", fr: "Votre Pixel Code TikTok se trouve dans TikTok Events Manager sous votre compte TikTok Ads Manager. Naviguez vers Actifs > Événements et vous verrez votre Pixel Code listé." },
      },
    ],
  },
  {
    slug: "google-analytics",
    category: "integrations",
    title: {
      en: "Setting up Google Analytics",
      ar: "إعداد Google Analytics",
      fr: "Configurer Google Analytics",
    },
    description: {
      en: "Track visitor behavior and store performance with Google Analytics.",
      ar: "تتبع سلوك الزوار وأداء المتجر باستخدام Google Analytics.",
      fr: "Suivez le comportement des visiteurs et les performances de votre boutique avec Google Analytics.",
    },
    steps: [
      {
        title: { en: "Install Google Analytics integration", ar: "ثبّت تكامل Google Analytics", fr: "Installez l'intégration Google Analytics" },
        description: {
          en: "Go to Integrations and find the \"Google Analytics\" card under the Tracking category. Click \"Install\" to add it to your store. Google Analytics helps you understand how visitors interact with your store — where they come from, which pages they visit, and how they navigate your products.",
          ar: "انتقل إلى التكاملات وابحث عن بطاقة \"Google Analytics\" تحت فئة التتبع. انقر \"تثبيت\" لإضافته إلى متجرك. يساعدك Google Analytics على فهم كيفية تفاعل الزوار مع متجرك — من أين يأتون، أي الصفحات يزورون، وكيف يتنقلون بين منتجاتك.",
          fr: "Allez dans Intégrations et trouvez la carte « Google Analytics » sous Suivi. Cliquez sur « Installer ». Google Analytics vous aide à comprendre comment les visiteurs interagissent avec votre boutique — d'où ils viennent, quelles pages ils visitent et comment ils naviguent entre vos produits.",
        },
      },
      {
        title: { en: "Enter your Google Analytics Measurement ID", ar: "أدخل معرّف القياس في Google Analytics", fr: "Entrez votre ID de mesure Google Analytics" },
        description: {
          en: "Click \"Configure\" and enter your Google Analytics 4 Measurement ID (starts with \"G-\", e.g., G-XXXXXXXXXX). You can find this in your Google Analytics account under Admin > Data Streams > Web. Once saved, Google Analytics will start tracking all visitor activity on your storefront automatically.",
          ar: "انقر \"إعداد\" وأدخل معرّف قياس Google Analytics 4 (يبدأ بـ \"G-\"، مثلاً G-XXXXXXXXXX). يمكنك إيجاده في حسابك في Google Analytics تحت المسؤول > تدفقات البيانات > الويب. بعد الحفظ، سيبدأ Google Analytics بتتبع جميع نشاط الزوار على واجهة متجرك تلقائيًا.",
          fr: "Cliquez sur « Configurer » et entrez votre ID de mesure Google Analytics 4 (commence par « G- », ex : G-XXXXXXXXXX). Vous le trouverez dans votre compte Google Analytics sous Admin > Flux de données > Web. Une fois enregistré, Google Analytics commencera à suivre automatiquement toute l'activité des visiteurs sur votre vitrine.",
        },
        image: "/docs/integrations/google-analytics-1.svg",
      },
    ],
    faqs: [
      {
        question: { en: "Which version of Google Analytics does Leadivo support?", ar: "أي إصدار من Google Analytics يدعمه Leadivo؟", fr: "Quelle version de Google Analytics Leadivo prend-il en charge ?" },
        answer: { en: "Leadivo supports Google Analytics 4 (GA4). You'll need a GA4 Measurement ID that starts with \"G-\". The older Universal Analytics (UA-) is no longer supported by Google.", ar: "يدعم Leadivo Google Analytics 4 (GA4). ستحتاج لمعرّف قياس GA4 يبدأ بـ \"G-\". لم يعد Google يدعم Universal Analytics القديم (UA-).", fr: "Leadivo prend en charge Google Analytics 4 (GA4). Vous aurez besoin d'un ID de mesure GA4 commençant par « G- ». L'ancien Universal Analytics (UA-) n'est plus supporté par Google." },
      },
      {
        question: { en: "What data does Google Analytics collect from my store?", ar: "ما البيانات التي يجمعها Google Analytics من متجري؟", fr: "Quelles données Google Analytics collecte-t-il de ma boutique ?" },
        answer: { en: "Google Analytics tracks page views, session duration, traffic sources, device types, geographic data, and user behavior patterns. This helps you understand your audience and optimize your marketing efforts.", ar: "يتتبع Google Analytics مشاهدات الصفحات ومدة الجلسات ومصادر الزيارات وأنواع الأجهزة والبيانات الجغرافية وأنماط سلوك المستخدمين. يساعدك هذا على فهم جمهورك وتحسين جهودك التسويقية.", fr: "Google Analytics suit les pages vues, la durée des sessions, les sources de trafic, les types d'appareils, les données géographiques et les comportements des utilisateurs. Cela vous aide à comprendre votre audience et optimiser votre marketing." },
      },
    ],
  },

  // ── Settings ─────────────────────────────────────────────────────────
  {
    slug: "account-settings",
    category: "settings",
    title: {
      en: "Managing your account",
      ar: "إدارة حسابك",
      fr: "Gérer votre compte",
    },
    description: {
      en: "Update your profile, email, and password.",
      ar: "حدّث ملفك الشخصي وبريدك الإلكتروني وكلمة مرورك.",
      fr: "Mettez à jour votre profil, email et mot de passe.",
    },
    steps: [
      {
        title: { en: "Open Settings", ar: "افتح الإعدادات", fr: "Ouvrez les Paramètres" },
        description: {
          en: "Click \"Settings\" at the bottom of the sidebar. This page shows your account profile, billing status, and custom domain configuration. Your profile information is separate from your store information — profile details are for your account, while store details are what customers see.",
          ar: "انقر على \"الإعدادات\" في أسفل الشريط الجانبي. تعرض هذه الصفحة ملفك الشخصي وحالة الفوترة وإعداد النطاق المخصص. معلومات ملفك الشخصي منفصلة عن معلومات متجرك — تفاصيل الملف الشخصي لحسابك، بينما تفاصيل المتجر هي ما يراه العملاء.",
          fr: "Cliquez sur « Paramètres » en bas de la barre latérale. Cette page affiche votre profil, le statut de facturation et la configuration du domaine personnalisé. Les informations de votre profil sont séparées de celles de votre boutique — les détails du profil concernent votre compte, tandis que les détails de la boutique sont ce que voient les clients.",
        },
        image: "/docs/settings/account-settings-1.svg",
      },
      {
        title: { en: "Update your details", ar: "حدّث بياناتك", fr: "Mettez à jour vos informations" },
        description: {
          en: "In the Profile section, you can update your display name and email address. Your billing status and current plan are shown in the Billing section. If you have a Pro plan, you can also connect a custom domain at the bottom of this page — enter your domain name and click \"Save Domain\". Remember to click \"Save\" after making any changes to your profile.",
          ar: "في قسم الملف الشخصي، يمكنك تحديث اسم العرض وعنوان البريد الإلكتروني. تُعرض حالة الفوترة وخطتك الحالية في قسم الفوترة. إذا كانت لديك خطة Pro، يمكنك أيضًا ربط نطاق مخصص في أسفل هذه الصفحة — أدخل اسم نطاقك وانقر \"حفظ النطاق\". تذكر النقر على \"حفظ\" بعد إجراء أي تغييرات على ملفك الشخصي.",
          fr: "Dans la section Profil, vous pouvez mettre à jour votre nom d'affichage et votre adresse email. Votre statut de facturation et votre plan actuel sont affichés dans la section Facturation. Si vous avez un plan Pro, vous pouvez aussi connecter un domaine personnalisé en bas de cette page — entrez votre nom de domaine et cliquez sur « Enregistrer le domaine ». N'oubliez pas de cliquer sur « Enregistrer » après toute modification de votre profil.",
        },
        image: "/docs/settings/account-settings-2.svg",
      },
    ],
    faqs: [
      {
        question: { en: "How does Leadivo pricing work?", ar: "كيف يعمل تسعير Leadivo؟", fr: "Comment fonctionne la tarification de Leadivo ?" },
        answer: { en: "Leadivo offers a 14-day free trial with full access to all features. After the trial, you subscribe to the Pro plan to keep your store running with all features including custom domains, integrations, and unlimited products. You can view your billing status and subscription details in the Settings page.", ar: "يوفر Leadivo فترة تجريبية مجانية لمدة 14 يومًا مع وصول كامل لجميع الميزات. بعد الفترة التجريبية، تشترك في خطة Pro للحفاظ على تشغيل متجرك بجميع الميزات بما في ذلك النطاقات المخصصة والتكاملات والمنتجات غير المحدودة. يمكنك عرض حالة الفوترة وتفاصيل الاشتراك في صفحة الإعدادات.", fr: "Leadivo offre un essai gratuit de 14 jours avec accès complet à toutes les fonctionnalités. Après l'essai, vous vous abonnez au plan Pro pour garder votre boutique active avec toutes les fonctionnalités incluant domaines personnalisés, intégrations et produits illimités. Vous pouvez voir votre statut de facturation dans les Paramètres." },
      },
      {
        question: { en: "Can I cancel my Pro subscription?", ar: "هل يمكنني إلغاء اشتراك Pro؟", fr: "Puis-je annuler mon abonnement Pro ?" },
        answer: { en: "Yes, you can cancel your Pro subscription at any time from the Settings page. Your Pro features will remain active until the end of your current billing period.", ar: "نعم، يمكنك إلغاء اشتراك Pro في أي وقت من صفحة الإعدادات. ستبقى ميزات Pro نشطة حتى نهاية فترة الفوترة الحالية.", fr: "Oui, vous pouvez annuler votre abonnement Pro à tout moment depuis les Paramètres. Vos fonctionnalités Pro resteront actives jusqu'à la fin de votre période de facturation actuelle." },
      },
      {
        question: { en: "How do I reset my password?", ar: "كيف أعيد تعيين كلمة المرور؟", fr: "Comment réinitialiser mon mot de passe ?" },
        answer: { en: "If you forgot your password, click the \"Forgot password\" link on the login page. You'll receive a password reset email with a link to create a new password. If you signed up with Google, no password is needed.", ar: "إذا نسيت كلمة مرورك، انقر على رابط \"نسيت كلمة المرور\" في صفحة تسجيل الدخول. ستتلقى بريدًا إلكترونيًا لإعادة تعيين كلمة المرور مع رابط لإنشاء كلمة مرور جديدة. إذا سجلت عبر جوجل، لا حاجة لكلمة مرور.", fr: "Si vous avez oublié votre mot de passe, cliquez sur « Mot de passe oublié » sur la page de connexion. Vous recevrez un email avec un lien pour créer un nouveau mot de passe. Si vous vous êtes inscrit avec Google, aucun mot de passe n'est nécessaire." },
      },
    ],
  },
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getCategory(slug: string): DocCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug)
}

export function getCategoryArticles(categorySlug: string): DocArticle[] {
  return ARTICLES.filter((a) => a.category === categorySlug)
}

export function getArticle(categorySlug: string, articleSlug: string): DocArticle | undefined {
  return ARTICLES.find((a) => a.category === categorySlug && a.slug === articleSlug)
}

export function searchArticles(query: string, lang: "en" | "ar" | "fr"): DocArticle[] {
  const q = query.toLowerCase()
  return ARTICLES.filter(
    (a) =>
      a.title[lang].toLowerCase().includes(q) ||
      a.description[lang].toLowerCase().includes(q),
  )
}
