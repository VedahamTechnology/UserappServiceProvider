# Patch: react-native-css-interop + react-native-reanimated — defensive displayName access

## Bug

```
ERROR  [TypeError: Cannot read property 'displayName' of undefined]
```

Throws when navigating HomeScreen → ManageAddressScreen. The ErrorBoundary
catches it during render. Source: anywhere `Component.displayName` is read
without guarding for `Component === undefined`.

The bug surfaces only on **ManageAddressScreen** because it's the only
screen that mounts `<Modal>` (inside `<AddressFormModal>`) immediately on
mount, even when `visible={false}`. Modal children still execute React's
render tree, and the resulting NativeWind interop call chain is what
finally hits the unguarded `Component.displayName` read.

## Patched files

| File | Why |
| --- | --- |
| `node_modules/react-native-css-interop/dist/runtime/native/api.js` | `cssInterop(baseComponent, ...)` reads `baseComponent.displayName` without guarding. If `baseComponent` is `undefined`, it throws. |
| `node_modules/react-native-css-interop/dist/runtime/native/render-component.js` | `createAnimatedComponent(Component)` reads `Component.displayName` without guarding. Same crash mode. |
| `node_modules/react-native-css-interop/dist/runtime/third-party-libs/react-native-safe-area-context.native.js` | `maybeHijackSafeAreaProvider(type)` reads `type.displayName` without guarding. |
| `node_modules/react-native-css-interop/dist/runtime/wrap-jsx.js` | Wraps every JSX call. If `type` is `undefined`, defers to the underlying `jsx` instead of throwing inside the wrapper. |
| `node_modules/react-native-css-interop/dist/runtime/components.js` | `cssInterop(SafeAreaView, ...)` is called even when `SafeAreaView` is `undefined` (e.g., the named export doesn't exist). Now it guards first. |
| `node_modules/react-native-reanimated/lib/module/createAnimatedComponent/createAnimatedComponent.js` | Two `Component.displayName` reads that fire whenever Reanimated is asked to animate an `undefined` component. |

## Diff

```diff
--- a/node_modules/react-native-css-interop/dist/runtime/native/api.js
+++ b/node_modules/react-native-css-interop/dist/runtime/native/api.js
@@ -32,1 +32,1 @@
-    const name = baseComponent.displayName ?? baseComponent.name ?? "unknown";
+    const name = baseComponent?.displayName ?? baseComponent?.name ?? "unknown";

--- a/node_modules/react-native-css-interop/dist/runtime/native/render-component.js
+++ b/node_modules/react-native-css-interop/dist/runtime/native/render-component.js
@@ -113,1 +113,1 @@
-    AnimatedComponent.displayName = `Animated.${Component.displayName || Component.name || "Unknown"}`;
+    AnimatedComponent.displayName = `Animated.${Component?.displayName || Component?.name || "Unknown"}`;

--- a/node_modules/react-native-css-interop/dist/runtime/third-party-libs/react-native-safe-area-context.native.js
+++ b/node_modules/react-native-css-interop/dist/runtime/third-party-libs/react-native-safe-area-context.native.js
@@ -6,3 +6,3 @@
 function maybeHijackSafeAreaProvider(type) {
-    const name = type.displayName || type.name;
+    const name = type?.displayName || type?.name;
     if (react_native_1.Platform.OS !== "web" && name === "SafeAreaProvider") {

--- a/node_modules/react-native-css-interop/dist/runtime/wrap-jsx.js
+++ b/node_modules/react-native-css-interop/dist/runtime/wrap-jsx.js
@@ -5,4 +5,5 @@
-        if (process.env.NODE_ENV !== "test")
-            require("./components");
-        type = (0, react_native_safe_area_context_1.maybeHijackSafeAreaProvider)(type);
-        if (props && props.cssInterop === false) {
+        if (process.env.NODE_ENV !== "test")
+            require("./components");
+        if (type) {
+            type = (0, react_native_safe_area_context_1.maybeHijackSafeAreaProvider)(type);
+            if (props && props.cssInterop === false) {
             delete props.cssInterop;
@@ -14,2 +15,3 @@
-        else {
+            else {
             type = api_1.interopComponents.get(type) ?? type;
-        }
+            }
+        }
         return jsx.call(jsx, type, props, ...rest);

--- a/node_modules/react-native-css-interop/dist/runtime/components.js
+++ b/node_modules/react-native-css-interop/dist/runtime/components.js
@@ -46,4 +46,6 @@
 try {
     const SafeAreaView = require("react-native-safe-area-context").SafeAreaView;
-    (0, api_1.cssInterop)(SafeAreaView, {
-        className: "style",
-    });
+    if (SafeAreaView) {
+        (0, api_1.cssInterop)(SafeAreaView, {
+            className: "style",
+        });
+    }
 }
 catch { }

--- a/node_modules/react-native-reanimated/lib/module/createAnimatedComponent/createAnimatedComponent.js
+++ b/node_modules/react-native-reanimated/lib/module/createAnimatedComponent/createAnimatedComponent.js
@@ -23,3 +23,3 @@
-    static displayName = `AnimatedComponent(${Component.displayName || Component.name || 'Component'})`;
+    static displayName = `AnimatedComponent(${Component?.displayName || Component?.name || 'Component'})`;
     constructor(props) {
-      const jsProps = options?.jsProps ?? Component.jsProps;
+      const jsProps = options?.jsProps ?? Component?.jsProps;
@@ -45,1 +45,1 @@
-  animatedComponent.displayName = Component.displayName || Component.name || 'Component';
+  animatedComponent.displayName = Component?.displayName || Component?.name || 'Component';
```

## How to apply (no patch-package)

The patches above are already applied to `node_modules/`. They will be lost
on the next `npm install`. To make them durable:

```bash
npm i -D patch-package
npx patch-package react-native-css-interop
npx patch-package react-native-reanimated
# Add `patch-package` to the "postinstall" script in package.json
```

## Related app code change

In `src/screens/profile/ManageAddressScreen.js`, removed a duplicate
`import { ScrollView } from 'react-native';` (line 16) — it was already
imported at the top. Duplicate imports are harmless but worth cleaning up.