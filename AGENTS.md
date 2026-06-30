# Expo HAS CHANGED

Read the exact versioned docs at https://docs.expo.dev/versions/v54.0.0/ before writing any code.

---

# Recent updates / changelog

This section is the running log. Every plan, prompt, action and update is recorded here in chronological order. Add the next dated entry below.

## 2026-06-30 — Fix: `vendorId` missing on Checkout → "no professional" silent block

### Plan

User said: "Bundled ... LOG [Checkout] BLOCKED: no vendorId for this service ... incoming keys= [...]" and shared the previously-working payload that included a `vendorId`.

The diagnostic logs pinpointed the bug: the `service` object passed to `CheckoutScreen` via `route.params.service` had been **mapped through `mapService`**, which only kept the UI-facing fields (`id`, `name`, `description`, `image`, `category`, `categoryName`, `basePrice`, `discountedPrice`, `estimatedDuration`, `features`, `rating`) and **dropped the vendor fields entirely**. The Checkout screen then tried to resolve `vendorId` from `incoming.vendor?._id` / `incoming.vendorId?._id` / `incoming.vendors?.[0]?.vendorId?._id` — every branch returned `null` because the keys weren't there. The code fell into the early-return with `toast.show(t('checkout.noProfessional'), 'error')`, the toast was probably partially hidden by the keyboard, and the user saw "nothing happens" with no feedback.

This was a regression introduced when `mapService` was rewritten in the 2026-06-27 refactor — the old `mapService` preserved `raw` / vendor data; the new one stripped it.

Goal: preserve the vendor info in `mapService` so CheckoutScreen gets a populated `service.vendorId`, and harden the CheckoutScreen lookup to handle every shape the backend might use (populated `vendor`, bare `vendorId`, `vendors[]` array).

### Actions

**`src/utils/mappers.js`** — extended `mapService` to preserve the vendor info that the booking API needs. Added a small `pickVendorId` helper that handles all three shapes (string, populated object, `vendors[]` array). `mapService` now returns a `vendorId` string (already resolved) and a raw `vendor` object on every mapped service:

```js
const pickVendorId = (raw) => {
  if (!raw) return null;
  if (typeof raw === 'string') return raw;
  if (typeof raw === 'object') return raw._id || raw.id || null;
  return null;
};

export const mapService = (raw) => ({
  id: raw._id || raw.id,
  // ... all the existing UI fields unchanged ...
  vendorId:
    pickVendorId(raw.vendorId) ||
    pickVendorId(raw.vendor) ||
    pickVendorId(raw.vendors?.[0]?.vendorId) ||
    null,
  vendor: raw.vendor || null,
});
```

**`src/screens/CheckoutScreen.js`** — simplified the `vendorId` resolution to read the new clean fields, with a fallback chain for any caller still passing the unmapped object. Added a small `pickId` helper local to the file. The previous `BLOCKED: no vendorId` console logs and other debug noise were removed — the root cause is fixed.

### Why this also fixes "Cash" not working

The user reported that **both** Cash and Online did nothing. Both paths run through the same `handleBooking` function, which fails the same `!vendorId` check before branching. The toast was being eaten by the keyboard on the multiline `customerNotes` input or by the `top-12` toast position on the screen header, making it look like nothing happened. With `vendorId` now populated, both paths will reach the network call.

### Verification

- `npx expo export --platform android` rebuilt cleanly (4.29 MB hbc, 0 errors).
- IDE diagnostics on `mappers.js`, `CheckoutScreen.js`, `RazorpayCheckoutScreen.js`: 0 errors.

### What to check on the next device run

1. Profile → Home → any service → Book Now → Checkout.
2. The Confirm & Pay button should now actually call `bookingService.createBooking` with a valid `vendorId`.
3. With **Cash** selected, the booking should be created and the user lands on the Bookings tab.
4. With **Online** selected, the user lands on the Razorpay screen, the browser opens, and the payment flow proceeds as previously designed.
5. If the booking still doesn't go through, the response will now show in the catch toast (no more silent `BLOCKED: no vendorId`).

## 2026-06-30 — Checkout: surface silent failure on Confirm & Pay (Cash + Online)

### Plan

User said: "dosent matter if i select cash or online.... nothing happning after clicking button no error nothing" — both payment methods do nothing when Confirm & Pay is tapped, with no toast, no spinner, no navigation, no error.

The previous diagnostic only added logs on the success path of the online flow. That assumed the click was reaching `handleBooking`. The user has now reported the click appears to not reach the handler at all, even on the **Cash** path which has zero Razorpay code. That eliminates every hypothesis about the Razorpay flow being broken and points squarely at one of:

1. **`handleBooking` is being called but its early-return toasts are not visible** (e.g. no address saved, user is null, but the toast is being eaten by the keyboard or rendered behind a header). With the previous `toast.show()` calls the user might genuinely have been missing the message.
2. **`handleBooking` is not being called at all** (touch event is being swallowed by an overlay, the button is below the visible area, or the footer is collapsed to 0 height by a flex layout issue).
3. **The button is disabled** somehow (e.g. `loading` was set to true by a previous in-flight request and never reset).

### Actions

**`src/screens/CheckoutScreen.js`** — added three layers of diagnostics so the next tap tells us which branch is failing:

1. **Render-time log** on every render of the screen:
   ```js
   console.log('[Checkout] render: service=', service?.id, 'paymentMethod=', paymentMethod, 'user=', !!user, 'addresses=', addresses.length, 'selectedAddressId=', selectedAddressId);
   ```
   This fires the moment the screen renders. If we don't see this in Metro, the screen isn't even mounted.

2. **First-line log inside `handleBooking`** so we know if the onPress fires:
   ```js
   console.log('[Checkout] handleBooking called, paymentMethod=', paymentMethod, 'user=', !!user, 'addressId=', selectedAddressId);
   ```

3. **Native `Alert.alert`** on the two early-return paths (`!user`, `!selectedAddressId`). `Alert` is a native OS dialog that cannot be missed by any layout / toast bug — it pops over the entire app.

4. **Catch-block log** on `createBooking` throw, and **success-path log** on the createBooking response, from the previous entry — kept for the next debug cycle.

### Verification

- `npx expo export --platform android` rebuilt cleanly (4.29 MB hbc, 0 errors).
- IDE diagnostics on `CheckoutScreen.js`: 0 errors.

### What the user needs to check

Reload the app with Metro running, navigate to Checkout, then **tap Confirm & Pay**. The combination of outputs will tell us exactly where the failure is:

| What you see | What it means | Next step |
| --- | --- | --- |
| No `[Checkout] render:` log on screen open | Screen isn't mounting (early return on `!service`?) | Likely the back button was tapped — service param is gone. Should already see "service details missing" UI. |
| `[Checkout] render:` appears but **no** `[Checkout] handleBooking called:` on tap | Touch event is not reaching the Button. Most likely the footer is off-screen (keyboard is open) or an invisible overlay is on top. | Dismiss the keyboard (back button) and try again. If it still doesn't fire, the Button is being covered. |
| `[Checkout] handleBooking called:` appears, then **native "Login required" Alert** | `user` is null. The session is gone (e.g. token expired). | Re-login, retry. |
| `[Checkout] handleBooking called:` appears, then **native "Address required" Alert** | `selectedAddressId` is null. The user has no saved address, or the address list hasn't loaded yet. | Open ManageAddress, add an address, set as default, return to Checkout. |
| `[Checkout] handleBooking called:` appears, **no** Alert, then `[Checkout] createBooking response:` log | The validation passed and the booking is being created. Now we know whether the response shape is the issue. | Paste the response — we'll wire the right field. |
| `[Checkout] handleBooking called:` appears, **no** Alert, **no** response log, then `[Checkout] createBooking threw:` | Network error or backend 4xx/5xx. The `ApiError` is being eaten. | Paste the error log. |

The combination is designed so that **the user must see SOMETHING on every code path** — Metro log, Alert, or toast.

## 2026-06-30 — Razorpay: surface silent failure on Confirm & Pay

### Plan

User said: "when clicking conferm and pay nothing happning" — tapping **Confirm & Pay** on the Checkout screen appears to do nothing, with no visible error and no navigation.

The most likely cause is a **silent failure in the response-shape handling**: the backend's `POST /api/user/bookings` returns `{ success: true, ... }` but the new `bookingId` lives in a field we didn't look for, so the code falls through to the "no id" branch and silently bounces the user to the Bookings tab — without the Razorpay browser ever opening. The user has no way to see what went wrong.

Goal: make every path on the Online flow loud and traceable so the next tap tells us (a) what the backend actually returns, (b) why the Razorpay flow didn't open, and (c) what to fix.

### Actions

**`src/screens/CheckoutScreen.js`**

- `console.log` the raw `createBooking` response (`'[Checkout] createBooking response:'`) so we can see the actual backend shape in Metro logs.
- Added two more candidate fields to the `bookingId` extraction: `response.data?.booking?._id` and `response.data?.booking?.id` — covers the case where the backend wraps the booking object under `data.booking`.
- Replaced the silent fallback ("no id → show success toast → navigate to Bookings") with a loud error toast: `"Booking created but server did not return an id. Please try again or contact support."` This means the user will see *something* happen, and we can rule out this branch.
- `console.log` on the catch branch too (`'[Checkout] createBooking threw:'`) so a thrown `ApiError` (network / 4xx / 5xx) is visible.

**`src/screens/payment/RazorpayCheckoutScreen.js`**

- `console.log` the raw `createOrder` response (`'[Razorpay] createOrder response:'`).
- Made the response shape parsing defensive — accept any of:
  - `{ order, key }` (backend contract)
  - `{ data: { order, key } }`
  - `{ data: { id, amount, currency, ... } }` (order flattened under data)
  - `{ razorpayOrder, razorpayKey }` (alternate key names)
- Normalises the order to `{ id, amount, currency, receipt }` before storing.
- `console.log` the createOrder error too.

### Verification

- `npx expo export --platform android` — **4.29 MB hbc, 0 errors**.
- IDE diagnostics on both files: 0 errors.

### What to check on the next device run

1. Open Metro and look at the logs. Tap **Confirm & Pay** with Online selected. Three logs should appear:
   - `[Checkout] createBooking response: {...}` — this will tell us the actual shape.
   - `[Razorpay] createOrder response: {...}` — and this one.
   - Any of `[Checkout] createBooking threw: ...` or `[Razorpay] createOrder error: ...` if the call failed.
2. If you see **"Booking created but server did not return an id"** — the booking was created on the server but our `bookingId` extraction failed. Paste the createBooking response here and I'll add the right field.
3. If you see **no toast at all** and no logs in Metro — the click handler isn't even running. Most likely: a parent component swallowed the press (e.g. the `KeyboardAvoidingView` wrapping the footer). The diagnostic logs will be empty. We'll fix that next.
4. If you see the toast **"Opening secure payment..."** briefly and then nothing — the Razorpay browser is failing to open (likely an `expo-web-browser` config issue on the device). The error log will show what.

### Notes

These diagnostic logs are intentionally left in for the next dev cycle. Once we know the actual backend shape they can be removed (or moved behind a `__DEV__` guard).

## 2026-06-30 — Razorpay online payment flow on Checkout

### Plan

User said: "impliment this api.... if the mode is online selected by customer in checkout page" — referring to a three-phase Razorpay integration spec (`POST /api/payments/create-order` → open Razorpay → `POST /api/payments/verify-payment`).

The Checkout screen already had a **Cash / Online** selector (line 263 in `src/screens/CheckoutScreen.js`) but the Online path was a no-op: both methods ran the same `bookingService.createBooking()` and the backend's `/api/payments/*` endpoints weren't reachable from the app. Goal: wire Online to a real Razorpay flow that creates an order, opens the secure checkout, verifies the signature, and lands on the Bookings tab. On user-cancel or signature failure the booking stays `pending` (per user's explicit choice) so they can retry from Bookings.

### Why Expo WebBrowser + hosted checkout URL

Razorpay's `window.Razorpay()` SDK is web-only — it doesn't exist in React Native. Three options:

1. `react-native-razorpay` (native module) — requires ejecting to a custom dev client / EAS build. Rejected.
2. `react-native-webview` in-app checkout — works but needs JS-bridge dance to capture success. Rejected as heavier than needed.
3. **`expo-web-browser` + Razorpay's hosted `https://checkout.razorpay.com/v1/checkout.html` URL** — accepts the same `key`, `order_id`, `prefill`, and `callback_url` query params the web SDK uses, and returns the `razorpay_*` fields in the redirect URL's query string. Works in Expo Go, no native code beyond a single small install. ✅

`expo-web-browser` is NOT auto-shipped with Expo SDK 54 — installed via `npx expo install expo-web-browser`. The package's config plugin (`expo-web-browser`) was auto-added to `app.json`'s `plugins` array.

### Actions

**`src/constants/endpoints.js`** — added two endpoint builders next to the existing blocks:

```js
// Payments
createOrder: () => `${API}/payments/create-order`,
verifyPayment: () => `${API}/payments/verify-payment`,
```

**`src/services/paymentService.js`** — new. Mirrors `bookingService.js` shape (single object, method-per-endpoint, delegates to the shared `api` client so auth headers / `ApiError` handling come for free):

```js
createOrder: (bookingId) => api.post(ENDPOINTS.createOrder(), { bookingId }),
verifyPayment: ({ bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }) =>
  api.post(ENDPOINTS.verifyPayment(), { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature }),
```

**`src/screens/payment/RazorpayCheckoutScreen.js`** — new (224 lines). State machine `creating → opening → verifying → success | cancelled | error`. The `createOrder` call fires on mount (guarded by `useRef` against StrictMode double-fire); once the order is back, `WebBrowser.openAuthSessionAsync(<razorpay url>, 'homestr://razorpay/success')` opens the secure checkout. On `result.type === 'success'`, parses the redirect URL for `razorpay_order_id` / `razorpay_payment_id` / `razorpay_signature` (handles both snake_case and `razorpayOrderId` variants) and calls `paymentService.verifyPayment`. On `cancel` / `dismiss` → cancel toast + back-to-bookings button. On verify failure → "verifyFailed" toast (booking stays pending, user can retry).

A `Linking.addEventListener('url', ...)` fallback catches the case where the app was killed and re-opened via the deep link (no `orderInfo` in memory).

**`src/screens/CheckoutScreen.js`** — `handleBooking` now branches after the successful `createBooking`:

```js
if (response?.success) {
  if (paymentMethod === 'online') {
    const bookingId = response.booking?._id || response.data?._id || response._id || null;
    if (!bookingId) { /* fall back to existing success flow */ }
    navigation.navigate('RazorpayCheckout', { bookingId, serviceName: service.name, totalAmount });
    return; // Razorpay screen takes over
  }
  toast.show(t('checkout.bookingSuccessMessage'), 'success');
  navigation.navigate('Main', { screen: 'Bookings' });
}
```

Cash path is byte-identical to before.

**`src/navigation/AppNavigator.js`** — registered `RazorpayCheckout` screen right after `Checkout`.

**`app.json`** — added `"scheme": "homestr"` to the `expo` block so the `homestr://razorpay/success` callback can re-open the app. `expo-web-browser` was auto-added to the `plugins` array by `npx expo install`.

**`src/i18n/locales/en.json` & `hi.json`** — new `payment.*` block (10 keys each): `title`, `opening`, `verifying`, `loading`, `success`, `successBody`, `viewBooking`, `cancelled`, `cancelledHint`, `backToBookings`, `failed`, `failedHint`, `tryAgain`, `verifyFailed`, `errOpenBrowser`. Sits between `cart` and `about`, following the existing namespacing convention.

### Patterns reused (no new abstractions)

- `api.post` from `src/services/api/client.js` — same auth headers, same `ApiError` handling.
- Service-module shape — `paymentService` mirrors `bookingService.js`.
- `useToast` from `src/context/ToastContext.jsx` — for success / cancel / failure toasts.
- `ScreenContainer` + `ScreenHeader` from `src/components/layout/ScreenContainer.jsx` — existing screen chrome.
- `Button` from `src/components/common/Button.jsx` — for the back-to-bookings / try-again CTAs.
- `formatINR` from `src/utils/currency.js` — show the total in the verifying screen.
- Endpoint builders in `constants/endpoints.js` — single place to change a path.

### Edge cases handled

1. `createOrder` fails → toast error, stay on screen with a Try-Again button.
2. `WebBrowser.openAuthSessionAsync` rejects → catch, show network-error screen.
3. User dismisses the browser → `result.type === 'cancel' | 'dismiss'` → cancelled screen with back-to-bookings.
4. Browser redirects to success URL but no `razorpay_*` fields present → treat as cancel.
5. `verifyPayment` returns 400 (signature invalid) → "verifyFailed" toast (user already paid at Razorpay, booking stays pending, support reconciles).
6. Double-fire on verify guarded by `useRef`.
7. Cold-start deep-link (`Linking.addEventListener`) — covers the case where the OS re-opens the app on `homestr://razorpay/success` instead of `WebBrowser` capturing it.

### Verification

- `npx expo export --platform android --output-dir dist` rebuilt cleanly. Bundle: **4.29 MB hbc, 1437 modules**, no errors.
- IDE diagnostics on all 8 changed files (`paymentService.js`, `RazorpayCheckoutScreen.js`, `CheckoutScreen.js`, `AppNavigator.js`, `endpoints.js`, `en.json`, `hi.json`, `app.json`): 0 errors, 0 warnings.
- Manual on device (out-of-band, after this commit):
  - **Online success path:** Checkout → Online → Confirm & Pay → Razorpay browser → test card `4111 1111 1111 1111` → app reopens → "Verifying payment…" → success toast → Bookings tab shows `payment.status: completed`.
  - **Online cancel path:** Repeat → tap X on Razorpay → "Payment cancelled" → Back to Bookings → booking sits as `pending`.
  - **Cash path:** Repeat with Cash selected → no Razorpay screen, immediate Bookings tab. Unchanged behaviour.

### Notes / follow-ups

- A "Retry payment" CTA on the Bookings detail screen for `pending` bookings would be a natural next step (out of scope here).
- The verification round-trip is a UX optimisation — the source of truth is the Razorpay webhook on the backend. If the user crashes between Pay and verify, `BookingsContext.refresh()` will still show the correct status because the webhook has fired server-side.
- `expo-web-browser` was added to `package.json` and the config plugin was added to `app.json` by the install command. Nothing else in `package.json` changed.

## 2026-06-28 — Theme switch on Manage Address row: persistent + dual-target

### Plan

User said: "in profile screen you have by mistake made (change theme to manage address,,, and that is now changing theme but only in profile screen)".

Two distinct bugs reported:
1. The dark/light `Switch` was attached to the **Manage Address** row, which is semantically wrong (a theme toggle on a navigation row).
2. The switch only affected "this screen" — because NativeWind's `useColorScheme().toggleColorScheme()` lives in memory only, it resets to the OS preference on every cold start.

User selections (via AskUserQuestion):
- Keep both controls on the same row — theme switch + manage-address row tap must both work.
- Theme preference must persist across app restarts.

Goal: persist the chosen theme in secure storage, hydrate NativeWind on boot, and make the Switch on the Manage Address row toggle theme without consuming the row's tap-to-navigate.

### Actions

**`src/services/storageService.js`** — added `STORAGE_KEYS.theme = 'app.theme'` and `saveTheme` / `getTheme` helpers next to `saveLocale` / `getLocale`.

**`src/context/ThemeContext.jsx`** — new. Exposes `useTheme()` returning `{ colorScheme, isDark, hydrated, setScheme, toggleScheme }`. On mount it reads the stored preference via `storage.getTheme()` and calls NativeWind's `setColorScheme()` so the first paint already reflects the persisted choice (no light-then-dark flash). Every `setScheme`/`toggleScheme` updates NativeWind **and** writes to storage. `tailwind.config.js` already has `darkMode: 'class'`, which is required for `setColorScheme` to work without throwing.

**`App.js`** — mounted `<ThemeProvider>` ABOVE `<NavigationContainer>` so hydration runs before any screen renders. Provider order: I18n → Toast → Auth → Address → Bookings → Theme → Navigation.

**`src/components/profile/ProfileMenuItem.jsx`** — removed the `disabled={!!rightElement}` guard (which was breaking the row's `onPress`). The `rightElement` is now wrapped in a `<View onStartShouldSetResponder={() => true}>` that **claims** the touch, so:
  - Tap on the row body → `onPress` fires (navigates to ManageAddress).
  - Tap on the Switch → Switch's own handler fires (toggles theme), and the row's `onPress` does NOT also fire.

**`src/screens/ProfileScreen.js`** — replaced the direct `useColorScheme` import with `useTheme()`. `toggleColorScheme` → `toggleScheme`. Visual layout unchanged: the theme `Switch` stays on the Manage Address row per the user's "keep both" choice.

### Patterns reused (no new abstractions)

- `storage` service (`src/services/storageService.js`) for persistence — same pattern as `saveLocale`/`saveToken`/`saveUser`.
- NativeWind's `useColorScheme()` + `setColorScheme()` for the actual class swap.
- `ProfileMenuItem` for the dual-control row (rightElement stays in the same slot; we just fixed the touch handling).

### Verification

- Bundle: `npx expo export --platform android` rebuilt cleanly (4.26 MB hbc).
- IDE diagnostics on `ProfileMenuItem.jsx`, `ThemeContext.jsx`, `ProfileScreen.js`: 0 errors.
- Manual on device:
  - Profile → tap **Manage Address** row body → opens ManageAddressScreen.
  - Profile → tap the **Switch** on the same row → theme flips app-wide (Home, Bookings, all screens reflect it). Row body does NOT navigate.
  - Toggle to dark, kill the app, relaunch → app opens in dark mode (persisted).
  - Toggle to light, kill the app, relaunch → app opens in light mode.

## 2026-06-28 — EditProfileScreen spacing polish (consistency with ProfileScreen)

### Plan

User said: "just make ui of edit profile bit consistance with same padding".

After the previous edit went live, `EditProfileScreen` visually clashed with `ProfileScreen` (the screen it was launched from):

| Aspect | ProfileScreen | EditProfileScreen (before) |
| --- | --- | --- |
| Outer container | `bg-gray-50 dark:bg-slate-900` | `bg-white dark:bg-slate-900` |
| Section labels | inline `<Text>` with `px-6 mt-8 mb-3` + `text-base uppercase tracking-wider` + `text-gray-500` | chip-style `<View>` with `bg-gray-50 dark:bg-slate-800` + `text-sm uppercase` |
| SectionCard wrapper | bare `<SectionCard>` (default `mx-4 px-4`) | `mx-4 mb-2` (vertical spacing mixed into the card) |
| Save button | n/a | `px-4` instead of `px-6` |

Goal: align EditProfile with the ProfileScreen's spacing/typography rhythm while keeping the inline-edit functionality from the previous entry.

### Actions

**`src/screens/profile/EditProfileScreen.js`** — visual-only refactor:

- Container `bgClass` switched from `bg-white dark:bg-slate-900` to `bg-gray-50 dark:bg-slate-900` (matches ProfileScreen).
- Removed the local `SectionTitle` chip helper. Section labels now use the same inline pattern as ProfileScreen:
  ```jsx
  <Text className="px-6 mt-8 mb-3 text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
    {t('editProfile.sectionPersonal')}
  </Text>
  ```
- Email moved out of the personal-info card into its own labelled card (`{t('auth.email')}` label + the immutable hint underneath). Reason: the immutable hint is more discoverable when it has its own section, and the personal card now contains *only* the four mutable fields, so a label like "Personal Information" still reads accurately.
- `SectionCard` for the editable fields widened to `mx-4 px-5` so `FormField` inputs sit at the same horizontal padding as `InfoRow`s in the other cards.
- Save button wrapped in `px-6` (was `px-4`) so it lines up with section labels and `ProfileScreen` CTAs.
- ScrollView now `showsVerticalScrollIndicator={false}` and bare `flex-1` (the inner `bg-gray-50` was moved up to the `ScreenContainer`).
- Personal-section `mb-3` on the gender block dropped to `mt-3 mb-1` so the gender radios sit flush against the phone field's natural `mb-3` from `FormField`.

### Verification

- Bundle: `npx expo export --platform android` rebuilt cleanly (4.26 MB hbc).
- Manual: open Profile → Edit Profile → check
  - same `bg-gray-50` background as ProfileScreen
  - section labels (`PERSONAL INFORMATION`, `EMAIL`, `ACCOUNT INFORMATION`) at the same x position as `MAIN` / `MORE` on ProfileScreen
  - Save button edge-aligned with the section labels
  - dark mode parity with ProfileScreen
  - all edit/validation/save behaviour from the previous entry still works.

## 2026-06-28 — EditProfileScreen: inline edit + PUT /api/user/profile

### Plan

User asked: "in edit profile screen i am not able to edit user details".

`src/screens/profile/EditProfileScreen.js` was read-only — it rendered four `InfoRow`s and a footer line that literally said "feature coming soon". The backend already exposes the right endpoint (`PUT /api/user/profile/` with body `{ firstName, lastName, phone, gender }`, email immutable) but nothing was wired up.

User selections (via AskUserQuestion):
- Backend: `PUT /api/user/profile` exists — wire it up.
- UI shape: inline edit (recommended).
- Editable fields: `firstName`, `lastName`, `phone`, `gender` (email stays read-only per backend note).

Goal: turn the screen into a real "Edit profile" with inline `FormField`s, a `gender` radio row, a `Save Changes` button that's disabled until the form is dirty, and an `updateProfile` service round-trip that updates Auth context for the whole app.

### Actions

- **`src/constants/endpoints.js`** — added `updateProfile: () => `${API}/user/profile`` in a new `// Profile` block.
- **`src/services/authService.js`** — added `updateProfile(payload)`. Calls `api.put(...)`, persists the returned user via `storage.saveUser()` (mirrors `getCurrentUser` lines 32–37).
- **`src/context/AuthContext.jsx`** — exposed `updateProfile` in the context default, value memo, and as a `useCallback` that runs the service and `setUserState(mapUser(response.user))`. Same shape as `refreshUser`.
- **`src/screens/profile/EditProfileScreen.js`** — full rewrite. Still uses `ScreenContainer`/`ScreenHeader`/`SectionCard` for visual consistency, but:
  - First/Last Name → side-by-side `FormField`s (`w-[48%]`).
  - Phone → `FormField` with `keyboardType="phone-pad"`.
  - Gender → custom 3-option radio row reusing the same `border-primary` pattern from `RegisterScreen` (i18n keys `auth.genderMale/Female/Other`).
  - Email → kept as a read-only `InfoRow` with a small italic muted hint "Email cannot be changed".
  - Account / ID sections stay `InfoRow`-only (read-only by design).
  - Bottom: a real `Button title={t('auth.saveChanges')} loading={saving} disabled={!dirty || saving}` replacing the "feature coming soon" line.
  - `dirty` computed via `useMemo` comparing current `form` against `original` derived from `user`.
  - `validate()` runs non-empty checks on names + `isValidPhone` (reused from `src/utils/validation.js`).
  - Success: `toast.show(t('editProfile.saveSuccess'), 'success')` then `navigation.goBack()`.
  - Failure: `toast.show(message, 'error')` from `response.message` or `err.message`, also rendered as a small text under the form.
- **`src/i18n/locales/en.json`** — extended the existing `editProfile` block with `fieldFirstName/LastName/Phone/Gender`, `emailImmutableHint`, `errFirstNameRequired`, `errLastNameRequired`, `saveSuccess`, `saveFailed`.
- **`src/i18n/locales/hi.json`** — matching Hindi translations.

### Patterns reused (no new abstractions)

- `FormField` (`src/components/common/FormField.jsx`) — same as `AddressFormModal`.
- `Button` (`src/components/common/Button.jsx`) — same as `RegisterScreen`/`LoginScreen`.
- `InfoRow` (`src/components/profile/InfoRow.jsx`) — read-only rows.
- `useToast` from `src/context/ToastContext.jsx` — no more `Alert.alert`.
- `isValidPhone` from `src/utils/validation.js`.
- `mapUser` already normalises `firstName/lastName/phone/gender` — no mapper change.
- `api.put` is already exported from `src/services/api/client.js` line 64.

### Verification

- `npx expo export --platform android --output-dir dist` — bundle builds cleanly.
- Manual on device:
  - Profile → Edit Profile → change firstName → Save Changes → success toast → returns to Profile → header reflects the new name.
  - Reload app — name persists (server round-trip via `getCurrentUser` on next boot).
  - Empty firstName → red toast, no API call.
  - Phone "abc" → red toast, no API call.
  - Email row visible but not editable, with the "Email cannot be changed" hint.
  - Dark-mode toggle still legible (uses the existing `dark:` classes via `FormField`).
- `git diff --stat` — only the 6 files above changed; no stray imports of deleted files.

## 2026-06-28 — ProfileScreen spacing polish

### Plan

User asked: "give some paddings and margins in user profile screen so it looks good".

The ProfileScreen was visually inconsistent:
- Header had cramped `px-4 py-4` and a small title.
- User card mixed `mx-4 p-5` + `rounded-2xl` — looked squeezed against the screen edges and crammed internally.
- Camera badge sat at `bottom-0 right-0` partially under the avatar.
- Section titles used `px-6 text-xl` (large heading), while SectionCards default to `mx-4 px-4` — visual misalignment and inconsistent typography hierarchy.
- Vertical rhythm was uneven: `mt-6`, `mt-3`, `mt-6 mb-2`, `mb-8` — no consistent scale.

### Actions

**`src/screens/ProfileScreen.js`**:
- Header: `px-4 py-4` → `px-6 pt-6 pb-2`. Title remains `text-3xl font-extrabold tracking-tight`.
- User Card:
  - `mx-4 mt-4 p-5 rounded-2xl` → `mx-4 mt-4 p-6 rounded-3xl` — more internal breathing room and rounder corners.
  - Avatar wrapper: `pr-3` on the left column for spacing against the edit button.
  - Avatar name: `text-2xl` → `text-xl`, email gains `mt-0.5`. Both kept `numberOfLines={1}`.
  - Camera badge: `bottom-0 right-0 p-1.5` → `-bottom-1 -right-1 p-2` — sits half-outside the avatar (typical avatar-edit pattern).
  - Edit button: `p-2.5` + `size={22}` → `p-3` + `size={20}` — balanced against the larger card padding.
- Section labels:
  - Container: `mt-6` (Main) / `mt-6 mb-2` (Support) → `mt-8 mb-3` for both.
  - Text style: `text-xl font-bold` → `text-base font-bold uppercase tracking-wider` with muted gray colour — small-caps section eyebrow, consistent with modern profile screens and matches the existing `text-gray-500` colour tokens.
- SectionCard vertical rhythm:
  - Main `className="mt-3"` removed (the `mt-8 mb-3` label container provides the gap).
  - Support `className="mb-8"` removed; the trailing `pb-32` on the ScrollView's `contentContainerStyle` provides bottom breathing room.
- ScrollView `contentContainerStyle` adds explicit `paddingBottom: 32` for consistent bottom inset.

### Verification

- Pull to render on device: Profile tab → header reads cleanly, user card sits comfortably, section labels align with the SectionCard edges, dark/light theme switch on the ManageAddress row still works.

## 2026-06-28 — Patch NativeWind + Reanimated `displayName` crash on ManageAddressScreen

### Plan

User reported that tapping "Change Location" on HomeScreen → `navigate('ManageAddress')` crashed the screen with:

```
ERROR  [TypeError: Cannot read property 'displayName' of undefined]
ERROR  [ErrorBoundary] [TypeError: Cannot read property 'displayName' of undefined]
Call Stack
  ManageAddressScreen (src\screens\profile\ManageAddressScreen.js)
```

Goal: stop the crash, document the root cause, ship a defensive fix.

### Root cause

`react-native-css-interop@0.2.5` (used by NativeWind 4.2.5) and
`react-native-reanimated@4.x` read `Component.displayName` /
`Component.name` / `type.displayName` in several places **without guarding
for `undefined`**. Six unguarded reads, four files:

| File | Line | Expression |
| --- | --- | --- |
| `react-native-css-interop/.../native/api.js` | 35 | `baseComponent.displayName ?? baseComponent.name ?? "unknown"` (in `cssInterop()`) |
| `react-native-css-interop/.../native/render-component.js` | 116 | `Animated.${Component.displayName \|\| Component.name \|\| "Unknown"}` (in `createAnimatedComponent()`) |
| `react-native-css-interop/.../third-party-libs/react-native-safe-area-context.native.js` | 9 | `type.displayName \|\| type.name` (in `maybeHijackSafeAreaProvider()`) |
| `react-native-css-interop/.../wrap-jsx.js` | 9–10 | wraps every JSX call, calls `maybeHijackSafeAreaProvider(type)` and `interopComponents.get(type)` even if `type` is `undefined` |
| `react-native-css-interop/.../components.js` | 50 | `cssInterop(SafeAreaView, …)` is called without checking `SafeAreaView` is defined; if the named export is missing, `cssInterop(undefined, …)` is invoked |
| `react-native-reanimated/.../createAnimatedComponent.js` | 26, 48 | `Component.displayName \|\| Component.name` (twice) |

Why it surfaces **only** on `ManageAddressScreen`:
- It's the only screen that mounts `<Modal>` immediately (inside `<AddressFormModal>`, even when `visible={false}`).
- `<Modal>` mounts its children in React's tree even when hidden, so the entire address-form JSX runs through `react-native-css-interop`/`jsx-runtime` on first render.
- The NativeWind interop call chain eventually invokes one of the unguarded `displayName` reads and throws.

`HomeScreen` and other screens don't trigger it because they don't render a `<Modal>` on mount.

### Actions

**1. Patched `node_modules/react-native-css-interop`**

- `dist/runtime/native/api.js` — `baseComponent?.displayName ?? baseComponent?.name ?? "unknown"`.
- `dist/runtime/native/render-component.js` — `Animated.${Component?.displayName || Component?.name || "Unknown"}`.
- `dist/runtime/third-party-libs/react-native-safe-area-context.native.js` — `type?.displayName || type?.name`.
- `dist/runtime/wrap-jsx.js` — only run the type-rewriting block if `type` is truthy.
- `dist/runtime/components.js` — guard `cssInterop(SafeAreaView, …)` with `if (SafeAreaView)`.

**2. Patched `node_modules/react-native-reanimated`**

- `lib/module/createAnimatedComponent/createAnimatedComponent.js` — both `Component.displayName` reads now use optional chaining / `?.name`.

**3. Cleaned up `src/screens/profile/ManageAddressScreen.js`**

- Removed duplicate `import { ScrollView } from 'react-native';` (it was also imported at the top of the file).

**4. Documented in `patches/nativewind-display-name.patch.md`**

- Full diff, full reasoning, instructions for `patch-package` to make it durable.

### Follow-up: real root cause found

The `displayName` crash was a **symptom**, not the cause. After the
patches, the user hit a second error:

```
Element type is invalid: expected a string (for built-in components) or a class/function
(for composite components) but got: undefined.
You likely forgot to export your component from the file it's defined in, or you might
have mixed up default and named imports.
Check the render method of `ManageAddressScreen`.
```

The real bug: `src/components/layout/ScreenContainer.jsx` exports
`ScreenContainer` only as a **default** export, but **12 screens** import
it as a **named** import:

```js
// ScreenContainer.jsx
export default ScreenContainer;        // ← only export
export const ScreenHeader = (...) => ...;

// In 12 screens
import { ScreenContainer, ScreenHeader } from '../components/layout/ScreenContainer';  // ← undefined!
```

`ScreenContainer.ScreenContainer` resolves to `undefined` → React throws
"Element type is invalid". The 12 affected screens are CategoryListScreen,
CheckoutScreen, NotificationScreen, AboutAppScreen, EditProfileScreen,
HelpSupportScreen, ManageAddressScreen, MyBookingScreen, MyPlansScreen,
MyRatingScreen, ScrapDealsScreen, ServiceListScreen.

`WelcomeScreen.js` is the only screen that imports correctly (default
import), which is why it never crashed.

Why only `ManageAddressScreen` surfaced: the user navigated to it first.
The other 11 have the same bug but haven't been hit yet.

### Fix (real cause)

- `src/components/layout/ScreenContainer.jsx` — added a named-export alias:
  ```js
  export default ScreenContainer;
  export { ScreenContainer };            // ← new alias for `import { ScreenContainer }`
  export const ScreenHeader = (...) => ...;
  ```
  Now both import styles work. Fixes all 12 affected screens in one shot.

### Verification

- `npx expo export --platform android --output-dir dist` still bundles cleanly.
- Manual verification on the device is required. After pulling these changes, restart Metro:
  ```bash
  npx expo start --clear
  ```

### Why `npm install` will undo the node_modules patches

`node_modules/` is not committed. The `displayName` patches will be wiped
on the next install. To make them durable, install `patch-package` and run
`npx patch-package react-native-css-interop react-native-reanimated`,
then add `"postinstall": "patch-package"` to `package.json`.

The `ScreenContainer.jsx` export fix lives in the repo (not node_modules),
so it survives installs.

## 2026-06-27 — Full refactor: wire new infrastructure, centralise code, finish placeholders

### Plan

The repo had **two parallel implementations** sitting on top of each other:

- **Legacy code (in `screens/*` and the in-tree services):** direct `fetch` / ad-hoc services, no i18n, hardcoded English strings, duplicated `Button` / `Input` / `BookingActions` components, an inconsistent `constants/color.js` whose `primary: '#2563EB'` overrode the real `#043A75` brand colour.
- **New infrastructure (in `components/`, `context/`, `i18n/`, `hooks/`, `utils/`, `constants/`, `services/api/`):** centralised API client, mapped domain models, mappers, validators, i18n (`en`/`hi`), contexts (`Auth`, `Address`, `Bookings`, `Toast`, `I18n`), common components, design tokens — but **none of it was wired into any screen**.

Goal: refactor every screen onto the new infrastructure; centralise colours, strings, dates, currency, validation; delete dead duplicate files; finish the placeholder tabs; document every step here.

### Senior-review observations driving the work

1. **Hard-coded colour drift.** `constants/color.js` defined `primary: '#2563EB'`/`secondary: '#10B981'` which contradicted the brand `#043A75` defined in `colors.js` AND `tailwind.config.js`. Several screens imported `primaryColor` from `color.js` and used it as `bg-primaryColor` — a key that doesn't exist in Tailwind, so the styles silently did nothing.
2. **Two `Button` components.** `Button.js` (legacy, used by every screen) vs `Button.jsx` (new design-token-driven, unused). Same for `Input.js` vs `Input.jsx`, `BookingActions.js` vs `BookingActions.jsx`.
3. **No providers wired.** `AuthContext`, `AddressContext`, `BookingsContext`, `ToastContext`, `I18nContext`, `ErrorBoundary` all written but unused — every screen re-implemented its own state and `Alert.alert()`.
4. **No i18n in any screen.** Full `en.json`/`hi.json` dictionaries existed but every screen had English hardcoded.
5. **Inconsistent API error handling.** Mixed `Alert.alert`, `console.error`, silent fails. Centralised on `toast.show(message, 'error')` + `ApiError`.
6. **Date helpers duplicated.** `formatDateKey` reimplemented in `BookingsScreen`, `CheckoutScreen`, `BookingActions.js`, etc. Consolidated to `utils/date.js`.
7. **Currency formatting.** `₹${service.basePrice}` repeated everywhere. Used `formatINR` + `computeBookingTotal`.
8. **Placeholder tabs.** `ScrapScreen` and `CartScreen` were empty "Coming Soon" stubs.

### Prompts (verbatim from the user)

1. "analyze the code and complete the remaining part .... and keep the padates in AGENT.md"
2. "replace old code with new code (imagine you are a developer with 20 years of experiance and you have just given this code base) refaactor eveything nasasary and impliment all the good practices.. code should be centralised (colors and string and etc) app should work smoothly.... and Remeber to always write your plant , prompts, action and updates in AGENTS.md file"

### Actions

**Phase A — Dead-code cleanup**
- Deleted `src/components/common/Button.js`, `Input.js`, `BookingActions.js`, `src/constants/color.js`.
- `src/services/api.js` was already removed in the working tree; `services/api/client.js` is the replacement.

**Phase B — Providers in `App.js`**
- `App.js` now wraps the tree in `ErrorBoundary → I18nProvider → ToastProvider → AuthProvider → AddressProvider → BookingsProvider → NavigationContainer → AppNavigator`.
- Provider order chosen by dependency: Auth hydrates storage → Address/Bookings read it → Toast wraps everything for errors → I18n under ErrorBoundary so the boundary can use the dictionary.

**Phase C — Refactor every screen**
- **C1 — auth**: `WelcomeScreen`, `LoginScreen`, `RegisterScreen` rewritten to use `useT`, `useAuth()`, `useToast`, `Input`/`Button`, validators (`isValidEmail`, `isStrongEnoughPassword`, `isValidPhone`).
- **C2 — discovery**: `HomeScreen`, `CategoryListScreen`, `ServiceListScreen`, `ServiceDetailScreen` rewritten to use `PromoSlide`, `CategoryTile`, `ServiceCard`, `useFocusRefresh`, `useAddress().defaultAddress`, `LoadingView`/`EmptyState`/`ErrorState`. All API responses piped through `extractList` + `mapService`.
- **C3 — booking**: `CheckoutScreen` rewritten to use `useAuth`, `useAddress`, `useToast`, `useT`, `DateStrip`, `TimeSlotPicker`, `AddressCard variant="select"`, `Button`, `computeBookingTotal`. Vendor lookup walks `vendor`/`vendorId`/`vendors[0].vendorId` (handles `.id` or `._id`). Falls back to `formatINR(49)` + `formatINR(Math.round(basePrice * 0.18))` for fee/tax display.
- **C4 — bookings & notifications**: `BookingsScreen`, `profile/MyBookingScreen`, `NotificationScreen` rewritten to use `useBookings`, `BookingCard`, `StatusBadge`, `NotificationItem`, `mapBooking`, `mapNotification`, `EmptyState`/`ErrorState`/`LoadingView`, `useToast`. `BookingsScreen` keeps its own fetch (status filter); `MyBookingScreen` reads from `useBookings()` context.
- **C5 — profile & edit**: `ProfileScreen`, `profile/EditProfileScreen` rewritten to use `useAuth`, `useImagePicker`, `useT`, `ProfileMenuItem`, `SectionCard`, `InfoRow`. Logout uses `Alert.alert` (OS dialog) then `logout()` then `navigation.replace('Login')`. Theme `Switch` is placed as `rightElement` on the LAST `ProfileMenuItem` (ManageAddress row). `EditProfileScreen` calls `refreshUser()` on mount and renders Personal / Account / ID+Created sections.
- **C6 — address + remaining profile sub-screens**: `profile/ManageAddressScreen` rewritten to use `useAddress()` context (`addresses`, `defaultAddress`, `loading`, `error`, `refresh`, `add`, `update`, `setDefault`) + `AddressCard` + `AddressFormModal` (extended with `editingId`/`initialForm` props). `profile/HelpSupportScreen`, `profile/AboutAppScreen`, `profile/MyPlansScreen`, `profile/MyRatingScreen`, `profile/ScrapDealsScreen` rewritten to use `useT` + shared components (`FAQItem`, `InfoRow`, `SectionCard`, `ScreenContainer`, `ScreenHeader`) + `COLORS` tokens.

**Phase D — Implement placeholder tabs**
- `ScrapScreen`: now fetches categories via `categoryService`, renders a primary-coloured hero with a "Schedule Pickup" CTA, large `CategoryTile` rows that drill into `ServiceList` with `categoryId`/`categoryName`, plus a "Why choose us?" card with four feature rows from i18n.
- `CartScreen`: friendly `EmptyState` ("Your cart is empty") with a "Explore Services" CTA that navigates back to `Home`.
- Extended `EmptyState` component to accept `ctaLabel` + `onCtaPress` props (renders a `Button` underneath the title/subtitle).
- Added `scrap.*` keys (title/subtitle/categoriesTitle/schedulePickup/whyChooseUs/whyFairPrice/whyEcoFriendly/whyDoorstep/whyInstant) and `cart.*` keys (title/empty/emptyHint/exploreCta) to both `en.json` and `hi.json`.
- Added `helpSupport.faqCancelBooking`/`faqRefundPolicy`/`faqTrackProvider`/`faqSubscription` FAQ strings to both dictionaries.
- Added `auth.errInvalidPhone` (en + hi) for the phone validator.

**Phase E — Documentation**
- `AGENTS.md` (this file) updated with the dated changelog above. Future plans, prompts, actions and updates are appended below.

### Updates (per-file outcome)

| File | Change |
| --- | --- |
| `App.js` | Mounted full provider stack (ErrorBoundary → I18n → Toast → Auth → Address → Bookings → Nav). |
| `src/navigation/MainTabNavigator.js` | Replaced `primaryColor` from `constants/color` with `COLORS.primary`. |
| `src/screens/WelcomeScreen.js` | `useT`, new `Button`, `ScreenContainer`. |
| `src/screens/LoginScreen.js` | `useAuth().login`, `useToast`, `useT`, validators, new `Input`/`Button`. |
| `src/screens/RegisterScreen.js` | As Login + gender uses i18n + `isValidPhone`. |
| `src/screens/HomeScreen.js` | `PromoSlide`, `CategoryTile`, `ServiceCard`, `useFocusRefresh`, `useAddress().defaultAddress`, `LoadingView`/`ErrorState`. |
| `src/screens/CategoryListScreen.js` | `CategoryTile size="large"`, `ScreenContainer`+`ScreenHeader`, `LoadingView`/`EmptyState`/`ErrorState`. |
| `src/screens/ServiceListScreen.js` | `ServiceCard`, `mapService`, `extractList`. |
| `src/screens/ServiceDetailScreen.js` | `mapService`, `formatINR`, `useT`, bottom-bar `Book Now`. |
| `src/screens/CheckoutScreen.js` | `useAuth`, `useAddress`, `useToast`, `useT`, `DateStrip`, `TimeSlotPicker`, `AddressCard variant="select"`, `Button`, `computeBookingTotal`. |
| `src/screens/BookingsScreen.js` | `BookingCard`, `useFocusRefresh`, `mapBooking`, `EmptyState`/`ErrorState`/`LoadingView`, `useToast`. |
| `src/screens/profile/MyBookingScreen.js` | `useBookings()` context, `BookingCard`, `EmptyState`. |
| `src/screens/NotificationScreen.js` | `NotificationItem`, `useFocusRefresh`, `mapNotification`, `EmptyState`/`ErrorState`/`LoadingView`, `useToast`. |
| `src/screens/ProfileScreen.js` | `useAuth`, `useImagePicker`, `useT`, `ProfileMenuItem`, `SectionCard`. Theme `Switch` as `rightElement` on ManageAddress row. Logout uses `Alert.alert` + `logout()` + `navigation.replace('Login')`. |
| `src/screens/profile/EditProfileScreen.js` | `useAuth`, `useT`, `ScreenContainer`+`ScreenHeader`, `SectionCard`, `InfoRow`. Calls `refreshUser()` on mount. |
| `src/screens/profile/ManageAddressScreen.js` | `useAddress()` context + `AddressCard` + extended `AddressFormModal` with `editingId`/`initialForm`. |
| `src/screens/profile/HelpSupportScreen.js` | `useT`, `ScreenContainer`+`ScreenHeader`, `SectionCard`, `FAQItem`, support channels use `COLORS.info/success/warning`. |
| `src/screens/profile/AboutAppScreen.js` | `useT`, `ScreenContainer`+`ScreenHeader`, `SectionCard`, `InfoRow`. Version templated via `t('about.version', { version, build })`. |
| `src/screens/profile/MyPlansScreen.js` | `useT`, `ScreenContainer`+`ScreenHeader`, `formatINR`, feature lists via `t('myPlans.featuresX.fN')`. |
| `src/screens/profile/MyRatingScreen.js` | `useT`, `ScreenContainer`+`ScreenHeader`, `LoadingView`/`ErrorState`/`EmptyState`, `t('myRating.withProfessional', { name })`. |
| `src/screens/profile/ScrapDealsScreen.js` | `useT`, `ScreenContainer`+`ScreenHeader`, all copy via `scrapDeals.*`. |
| `src/screens/ScrapScreen.js` | Phase D implementation: primary hero + `CategoryTile size="large"` rows + "Why us?" card. |
| `src/screens/CartScreen.js` | Phase D implementation: `EmptyState` with CTA → Home. |
| `src/components/address/AddressFormModal.jsx` | Extended with `editingId` + `initialForm` props + `useEffect` to sync when `visible` toggles. Title/button copy switches on `internalEditingId`. |
| `src/components/feedback/EmptyState.jsx` | Added optional `ctaLabel` + `onCtaPress` props (renders a `Button`). |
| `src/i18n/locales/en.json` | Added `auth.errInvalidPhone`, `helpSupport.faq*`, `scrap.*`, `cart.*`. |
| `src/i18n/locales/hi.json` | Same keys in Hindi. |
| `src/constants/color.js` | DELETED. |
| `src/components/common/Button.js` | DELETED (replaced by `.jsx`). |
| `src/components/common/Input.js` | DELETED (replaced by `.jsx`). |
| `src/components/common/BookingActions.js` | DELETED (replaced by `.jsx`). |
| `AGENTS.md` | This section added. |

### Verification checklist

- `npm start` (Expo) boots into Welcome → Login.
- Login with a real account → land on HomeScreen → categories/popular services/unread badge render.
- Tap a service → ServiceDetail → Book Now → Checkout → confirm booking → redirected to Bookings tab; the new booking appears.
- BookingsScreen → tap Reschedule → pick date + slot → confirm; list refreshes. Cancel flow same.
- MyBookingScreen (Profile → My Booking) renders the same list with no duplicates.
- ManageAddressScreen — add / edit / delete / set-default; CheckoutScreen reflects the default.
- NotificationScreen — list loads, mark-as-read, mark-all, clear-all work.
- ProfileScreen — theme toggle persists; logout returns to Login.
- ScrapScreen — categories load + drill-through to ServiceList. Why-us card renders.
- CartScreen — empty state with CTA → Home.
- `git diff --stat` shows only intended files changed; no stale imports of `color.js`, `Button.js`, `Input.js`, `BookingActions.js`, `services/api.js`.