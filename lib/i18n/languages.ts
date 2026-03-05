export const STOREFRONT_LANGUAGES: { code: string; name: string }[] = [
  { code: "en", name: "English" },
  { code: "fr", name: "Français" },
  { code: "ar", name: "العربية" },
  { code: "es", name: "Español" },
  { code: "pt", name: "Português" },
  { code: "de", name: "Deutsch" },
  { code: "it", name: "Italiano" },
  { code: "nl", name: "Nederlands" },
  { code: "tr", name: "Türkçe" },
  { code: "ru", name: "Русский" },
  { code: "zh", name: "中文" },
  { code: "ja", name: "日本語" },
  { code: "ko", name: "한국어" },
  { code: "hi", name: "हिन्दी" },
  { code: "id", name: "Bahasa Indonesia" },
  { code: "ms", name: "Bahasa Melayu" },
  { code: "pl", name: "Polski" },
  { code: "sv", name: "Svenska" },
  { code: "th", name: "ไทย" },
  { code: "vi", name: "Tiếng Việt" },
]

export const RTL_LANGUAGES = new Set(["ar"])

export const LANGUAGE_NAMES: Record<string, string> = Object.fromEntries(
  STOREFRONT_LANGUAGES.map((l) => [l.code, l.name])
)
