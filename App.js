import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import AppNavigator from './src/navigation/AppNavigator';
import ErrorBoundary from './src/components/common/ErrorBoundary';
import { I18nProvider } from './src/i18n/context';
import { ToastProvider } from './src/context/ToastContext';
import { AuthProvider } from './src/context/AuthContext';
import { AddressProvider } from './src/context/AddressContext';
import { BookingsProvider } from './src/context/BookingsContext';
import { ThemeProvider } from './src/context/ThemeContext';

/**
 * App root.
 *
 * Provider order (outer → inner):
 *   GestureHandlerRootView / SafeAreaProvider   — must wrap everything.
 *   ErrorBoundary                                — catches render-time crashes anywhere below.
 *   I18nProvider                                 — dictionaries available for error boundary copy.
 *   ToastProvider                                — toasts available for auth/data errors.
 *   AuthProvider                                 — reads token from secure storage on boot.
 *   AddressProvider / BookingsProvider           — depend on AuthProvider having hydrated.
 *   ThemeProvider                                — must sit ABOVE the navigator so the first paint
 *                                                 uses the persisted light/dark scheme (no flash).
 *   NavigationContainer + AppNavigator           — actual screens.
 */
export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ErrorBoundary>
          <I18nProvider>
            <ToastProvider>
              <AuthProvider>
                <AddressProvider>
                  <BookingsProvider>
                    <ThemeProvider>
                      <NavigationContainer>
                        <AppNavigator />
                      </NavigationContainer>
                    </ThemeProvider>
                  </BookingsProvider>
                </AddressProvider>
              </AuthProvider>
            </ToastProvider>
          </I18nProvider>
        </ErrorBoundary>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}