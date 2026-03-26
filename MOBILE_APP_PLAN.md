# Leadivo Mobile App — Build Plan

## Overview

Build a cross-platform mobile app (Android + iOS) using **React Native + Expo** for the Leadivo storefront. The app will have its own mobile-native design, connecting to the existing Next.js API backend.

**Scope:** Storefront only (browse, cart, checkout, orders). No dashboard/admin features.

---

## Phase 0: Prerequisites & Setup

### Accounts to Create
- [ ] **Google Play Developer** — $25 one-time → [play.google.com/console](https://play.google.com/console)
- [ ] **Apple Developer Program** — $99/year → [developer.apple.com/programs](https://developer.apple.com/programs)
- [ ] **Expo Account** (free) → [expo.dev/signup](https://expo.dev/signup)

### Tools to Install
- [ ] Node.js 18+ (already have)
- [ ] Install Expo CLI: `npm install -g eas-cli`
- [ ] Install Expo Go app on your phone (for dev testing)
  - Android: Google Play Store → search "Expo Go"
  - iOS: App Store → search "Expo Go"
- [ ] (Optional) Android Studio — for Android emulator
- [ ] (Optional) Xcode — for iOS simulator (Mac only)

### Reserve App Names (Do This First)
- [ ] Google Play Console → Create App → name: "Leadivo" → save as draft
- [ ] Apple Developer → App Store Connect → New App → name: "Leadivo" → Bundle ID: `com.leadivo.app`

---

## Phase 1: Project Initialization

### Step 1.1 — Create Expo Project
```bash
# From the root of your workspace (next to the web project)
npx create-expo-app@latest leadivo-mobile --template tabs
cd leadivo-mobile
```

### Step 1.2 — Install Core Dependencies
```bash
# Navigation (already included with tabs template)
npx expo install expo-router expo-linking expo-constants

# UI & Styling
npx expo install nativewind tailwindcss react-native-reanimated
npx expo install react-native-gesture-handler react-native-safe-area-context

# State & Forms
npm install zustand zod react-hook-form @hookform/resolvers

# API & Networking
npm install @tanstack/react-query axios

# Storage
npx expo install expo-secure-store @react-native-async-storage/async-storage

# Images
npx expo install expo-image

# Icons
npm install lucide-react-native react-native-svg

# Notifications
npx expo install expo-notifications expo-device

# Haptics & UX
npx expo install expo-haptics expo-splash-screen expo-status-bar
```

### Step 1.3 — Configure EAS Build
```bash
eas init
eas build:configure
```
This creates `eas.json` with build profiles (development, preview, production).

### Step 1.4 — Project Structure
```
leadivo-mobile/
├── app/                          # Expo Router (file-based routing)
│   ├── _layout.tsx               # Root layout (providers, fonts)
│   ├── index.tsx                 # Entry redirect
│   ├── (tabs)/                   # Bottom tab navigator
│   │   ├── _layout.tsx           # Tab bar config
│   │   ├── index.tsx             # Home (store feed)
│   │   ├── search.tsx            # Search products
│   │   ├── cart.tsx              # Cart
│   │   ├── orders.tsx            # My orders
│   │   └── account.tsx           # Profile / settings
│   ├── store/
│   │   └── [slug]/               # Store pages
│   │       ├── index.tsx         # Store home
│   │       ├── product/
│   │       │   └── [id].tsx      # Product detail
│   │       ├── collection/
│   │       │   └── [id].tsx      # Collection page
│   │       └── checkout.tsx      # Checkout flow
│   ├── order/
│   │   └── [id].tsx              # Order confirmation / tracking
│   └── auth/                     # (Optional) login/signup
│       ├── login.tsx
│       └── signup.tsx
├── components/                   # Reusable UI components
│   ├── ui/                       # Base components (Button, Input, Card, etc.)
│   ├── product/                  # Product-related components
│   │   ├── product-card.tsx
│   │   ├── product-grid.tsx
│   │   ├── image-gallery.tsx
│   │   ├── variant-selector.tsx
│   │   └── review-list.tsx
│   ├── cart/                     # Cart components
│   │   ├── cart-item.tsx
│   │   ├── cart-summary.tsx
│   │   └── coupon-input.tsx
│   ├── checkout/                 # Checkout components
│   │   ├── checkout-form.tsx
│   │   ├── address-fields.tsx
│   │   └── order-summary.tsx
│   ├── store/                    # Store components
│   │   ├── store-header.tsx
│   │   ├── collection-tabs.tsx
│   │   └── announcement-bar.tsx
│   └── common/                   # Shared components
│       ├── loading.tsx
│       ├── error-view.tsx
│       ├── empty-state.tsx
│       └── star-rating.tsx
├── lib/                          # Business logic & utilities
│   ├── api/                      # API client
│   │   ├── client.ts             # Axios instance + base config
│   │   ├── products.ts           # Product API calls
│   │   ├── orders.ts             # Order API calls
│   │   ├── checkout.ts           # Checkout API calls
│   │   ├── shipping.ts           # Shipping lookup
│   │   ├── discounts.ts          # Discount validation
│   │   └── markets.ts            # Market/currency API
│   ├── store/                    # Zustand stores
│   │   ├── cart-store.ts         # Cart state (reuse logic from web)
│   │   ├── market-store.ts       # Selected market/currency
│   │   └── auth-store.ts         # (Optional) user auth state
│   ├── shared/                   # Shared with web project
│   │   ├── validations/          # Zod schemas (copy from web)
│   │   │   ├── checkout.ts
│   │   │   └── product.ts
│   │   ├── constants.ts          # Currencies, countries, cities
│   │   └── utils.ts              # formatPrice, slugify, etc.
│   ├── hooks/                    # Custom hooks
│   │   ├── use-products.ts       # React Query hooks for products
│   │   ├── use-cart.ts           # Cart hook
│   │   ├── use-market.ts         # Market/currency hook
│   │   └── use-store.ts          # Store data hook
│   └── i18n/                     # Translations
│       ├── index.ts              # i18n setup
│       ├── en.json
│       ├── ar.json
│       └── fr.json
├── assets/                       # Static assets
│   ├── images/
│   │   ├── icon.png              # App icon (1024x1024)
│   │   ├── splash.png            # Splash screen
│   │   └── adaptive-icon.png     # Android adaptive icon
│   └── fonts/                    # Custom fonts
├── app.json                      # Expo config
├── eas.json                      # EAS Build config
├── tailwind.config.js            # NativeWind config
└── tsconfig.json
```

---

## Phase 2: Shared Code Setup

### Step 2.1 — Copy Shared Code from Web Project
These files can be reused directly or with minor modifications:

```bash
# From leadivo-mobile/
mkdir -p lib/shared/validations

# Copy these from the web project (adjust as needed):
# - lib/validations/checkout.ts → lib/shared/validations/checkout.ts
# - lib/validations/product.ts  → lib/shared/validations/product.ts
# - lib/constants.ts            → lib/shared/constants.ts
# - lib/utils.ts                → lib/shared/utils.ts (remove web-specific parts)
```

### Step 2.2 — Create API Client
The mobile app will call your **existing Next.js API routes**. No new backend needed.

```
Base URL: https://your-domain.com/api
```

Endpoints the mobile app will use:
- `GET /api/products/list` — product listing
- `GET /api/products?id=xxx` — product detail
- `POST /api/checkout` — place order
- `GET /api/orders/[id]` — order details
- `GET /api/discounts/validate` — validate coupon
- `GET /api/shipping/lookup` — shipping rates
- `GET /api/markets/route` — detect market
- `GET /api/reviews/list` — product reviews

---

## Phase 3: Core Screens (Build Order)

### Step 3.1 — App Shell & Navigation
- [ ] Root layout with providers (React Query, Zustand, i18n)
- [ ] Bottom tab bar: Home, Search, Cart (with badge), Orders, Account
- [ ] Custom tab bar design with icons
- [ ] Splash screen setup
- [ ] Status bar configuration
- [ ] RTL support for Arabic

### Step 3.2 — Home Screen (Store Feed)
- [ ] Store header (logo, name, announcement bar)
- [ ] Collection tabs (horizontal scroll)
- [ ] Product grid (2 columns)
- [ ] Product card: image, name, price, compare-at price, star rating
- [ ] Pull-to-refresh
- [ ] Infinite scroll / pagination
- [ ] Skeleton loading states

### Step 3.3 — Product Detail Screen
- [ ] Image gallery with swipe (horizontal scroll + dots indicator)
- [ ] Product name, price, compare-at price
- [ ] Variant selector (size, color — button style)
- [ ] Stock availability badge
- [ ] Add to cart button (sticky bottom)
- [ ] Product description (expandable)
- [ ] FAQ accordion
- [ ] Reviews section (rating summary + review cards)
- [ ] Haptic feedback on add to cart

### Step 3.4 — Search Screen
- [ ] Search input with debounce
- [ ] Search results grid
- [ ] Collection filter chips
- [ ] Recent searches (stored locally)
- [ ] Empty state

### Step 3.5 — Cart Screen
- [ ] Cart item list (image, name, variant, quantity stepper, price)
- [ ] Swipe-to-remove items
- [ ] Coupon code input + validation
- [ ] Order summary (subtotal, shipping, discount, total)
- [ ] Checkout button (sticky bottom)
- [ ] Empty cart state
- [ ] Currency display from selected market

### Step 3.6 — Checkout Screen
- [ ] Customer form: name, phone, email, address, city, country
- [ ] Country/city picker (bottom sheet)
- [ ] Phone input with country code
- [ ] Form validation (Zod — shared schemas)
- [ ] Order note field
- [ ] Payment method: COD
- [ ] hCaptcha (if enabled by store)
- [ ] SMS OTP verification (if enabled by store)
- [ ] Shipping rate display
- [ ] Order summary recap
- [ ] Place order button
- [ ] Loading state during submission

### Step 3.7 — Order Confirmation Screen
- [ ] Success animation (checkmark)
- [ ] Order number (copyable)
- [ ] Order details summary
- [ ] "Continue Shopping" button

### Step 3.8 — Orders Screen (Order Tracking)
- [ ] Order list (order number, date, status, total)
- [ ] Status badge (pending, confirmed, shipped, delivered)
- [ ] Order detail view
- [ ] Status timeline
- [ ] Stored locally (AsyncStorage) since no auth required

### Step 3.9 — Account / Settings Screen
- [ ] Language selector (en, ar, fr + storefront languages)
- [ ] Market/currency selector
- [ ] Dark/light mode toggle
- [ ] App version info
- [ ] Rate app link
- [ ] Contact support link

---

## Phase 4: Market & Currency

- [ ] Auto-detect market via IP on first launch
- [ ] Market/currency picker (bottom sheet)
- [ ] Persist selected market in AsyncStorage
- [ ] Format prices with correct currency symbol
- [ ] Reuse `formatPrice` from shared utils
- [ ] Cart repricing when market changes

---

## Phase 5: Internationalization (i18n)

- [ ] Setup expo-localization + i18n library (i18next or custom)
- [ ] Support same 20 languages as web storefront
- [ ] RTL layout for Arabic
- [ ] Persist language preference
- [ ] Copy translation keys from web project (storefront keys only)

---

## Phase 6: Push Notifications

- [ ] Setup expo-notifications
- [ ] Request notification permission on first launch
- [ ] Register push token with your backend (new API endpoint needed)
- [ ] Notification types:
  - Order status updates (confirmed, shipped, delivered)
  - Abandoned cart reminders
  - (Future) promotions / discounts

### New API Endpoint Needed
```
POST /api/push-tokens — register device push token
POST /api/notifications/send — send push notification (called by order status change trigger)
```

---

## Phase 7: Styling & Design

### Design System
- [ ] Create base UI components matching mobile-native patterns:
  - Button (filled, outline, ghost)
  - Input (with floating label)
  - Card (with shadow)
  - Bottom Sheet (for pickers, filters)
  - Badge
  - Skeleton loader
  - Toast / Snackbar
- [ ] Apply store's design_settings (colors, fonts) dynamically
- [ ] Dark mode support
- [ ] Consistent spacing scale (4, 8, 12, 16, 24, 32)

### Mobile-Native Patterns (Different from Web)
- Bottom tab navigation (not sidebar)
- Bottom sheets instead of modals/dropdowns
- Swipe gestures (back, delete)
- Pull-to-refresh
- Haptic feedback on actions
- Native share sheet for products
- Sticky add-to-cart bar on product page
- Card-based layout instead of table rows

---

## Phase 8: Performance Optimization

- [ ] Use `expo-image` for optimized image loading + caching
- [ ] Implement `FlashList` instead of FlatList for long product lists
- [ ] React Query caching for API responses
- [ ] Skeleton screens instead of spinners
- [ ] Lazy load screens with `React.lazy`
- [ ] Minimize re-renders with `React.memo` and Zustand selectors
- [ ] Image CDN URLs with width/quality params

---

## Phase 9: Testing

- [ ] Test on Expo Go during development (quick iteration)
- [ ] Test development build on physical devices:
  ```bash
  eas build --profile development --platform android
  eas build --profile development --platform ios
  ```
- [ ] Test on multiple screen sizes:
  - Small Android (360px width)
  - Standard Android (390px)
  - iPhone SE (375px)
  - iPhone 15 (393px)
  - iPhone 15 Pro Max (430px)
- [ ] Test RTL layout (Arabic)
- [ ] Test dark mode
- [ ] Test slow network conditions
- [ ] Test offline behavior (cart should persist)

---

## Phase 10: App Store Assets

### App Icon
- [ ] Design app icon (1024x1024 PNG, no transparency for iOS)
- [ ] Android adaptive icon (foreground + background layers)

### Screenshots (Required for Both Stores)
- [ ] iPhone 6.7" (1290x2796) — at least 3 screenshots
- [ ] iPhone 6.5" (1284x2778) — at least 3 screenshots
- [ ] Android phone — at least 2 screenshots
- [ ] Recommended screens to capture:
  1. Home / product grid
  2. Product detail page
  3. Cart / checkout
  4. Order confirmation

### Store Listing Content
- [ ] App name: "Leadivo"
- [ ] Short description (80 chars max for Google Play)
- [ ] Full description (4000 chars max)
- [ ] Keywords (iOS — 100 chars)
- [ ] Category: Shopping
- [ ] Privacy policy URL (you already have this page)
- [ ] Support URL / email

### Splash Screen
- [ ] Design splash screen (logo centered, brand color background)

---

## Phase 11: Build & Submit

### Build for Android
```bash
# Preview build (APK for testing)
eas build --profile preview --platform android

# Production build (AAB for Google Play)
eas build --profile production --platform android
```

### Build for iOS
```bash
# Preview build (for TestFlight)
eas build --profile preview --platform ios

# Production build (for App Store)
eas build --profile production --platform ios
```

### Submit to Stores
```bash
# Submit to Google Play
eas submit --platform android

# Submit to Apple App Store
eas submit --platform ios
```

### Review Times
- **Google Play:** Usually 1-3 days for first submission, then hours for updates
- **Apple App Store:** Usually 1-2 days, sometimes longer for first submission

---

## Phase 12: Post-Launch

- [ ] Setup EAS Update for OTA bug fixes:
  ```bash
  eas update --branch production --message "fix: description"
  ```
- [ ] Monitor crash reports (Expo provides basic crash reporting)
- [ ] Setup analytics (optional — can use your existing tracking)
- [ ] Respond to user reviews on both stores
- [ ] Plan update cadence (match web feature releases)

---

## New Backend Work Needed

These are additions to your existing Next.js API:

| Endpoint | Purpose | Priority |
|---|---|---|
| `POST /api/push-tokens` | Register device push token | Phase 6 |
| `POST /api/notifications/send` | Trigger push notification | Phase 6 |
| Add `store_slug` param to existing endpoints | Mobile app needs to specify which store | Phase 2 |

Everything else uses your **existing API endpoints** — no backend rewrite needed.

---

## Timeline Estimate

| Phase | Description | Status |
|---|---|---|
| Phase 0 | Accounts & setup | Not started |
| Phase 1 | Project init & dependencies | Not started |
| Phase 2 | Shared code setup | Not started |
| Phase 3 | Core screens (main work) | Not started |
| Phase 4 | Market & currency | Not started |
| Phase 5 | i18n | Not started |
| Phase 6 | Push notifications | Not started |
| Phase 7 | Styling & design | Not started |
| Phase 8 | Performance | Not started |
| Phase 9 | Testing | Not started |
| Phase 10 | Store assets | Not started |
| Phase 11 | Build & submit | Not started |
| Phase 12 | Post-launch | Not started |

---

## Quick Reference Commands

```bash
# Start dev server
npx expo start

# Start with tunnel (test on phone without same WiFi)
npx expo start --tunnel

# Build for testing
eas build --profile development --platform all

# Build for production
eas build --profile production --platform all

# Submit to stores
eas submit --platform android
eas submit --platform ios

# Push OTA update
eas update --branch production --message "description"
```
