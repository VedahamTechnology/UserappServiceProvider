import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Animated } from 'react-native';
import { Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

const ToastContext = createContext({
  show: () => {},
});

const TOAST_BG = {
  success: COLORS.success,
  error: COLORS.danger,
  warning: COLORS.warning,
  info: COLORS.info,
};

let nextId = 1;

/**
 * Global toast provider. Replaces ad-hoc Alert.alert() on error paths.
 * Usage:
 *   const toast = useToast();
 *   toast.show('Booking confirmed', 'success');
 */
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const show = useCallback((message, type = 'info', duration = 3000) => {
    const id = nextId++;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View pointerEvents="none" className="absolute top-12 left-0 right-0 items-center">
        {toasts.map((t) => (
          <Toast key={t.id} message={t.message} type={t.type} />
        ))}
      </View>
    </ToastContext.Provider>
  );
};

const Toast = ({ message, type }) => {
  const opacity = React.useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    Animated.timing(opacity, { toValue: 0, duration: 200, delay: 2700, useNativeDriver: true }).start();
  }, [opacity]);

  return (
    <Animated.View
      style={{ opacity, backgroundColor: TOAST_BG[type] || TOAST_BG.info }}
      className="mx-6 my-1 px-4 py-3 rounded-xl"
    >
      <Text className="text-white font-semibold">{message}</Text>
    </Animated.View>
  );
};

export const useToast = () => useContext(ToastContext);

export default ToastContext;