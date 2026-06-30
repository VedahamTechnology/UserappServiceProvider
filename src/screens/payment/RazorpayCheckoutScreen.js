import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, ActivityIndicator, Linking, Alert } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { Ionicons } from '@expo/vector-icons';

import { useT } from '../../i18n/useT';
import { useToast } from '../../context/ToastContext';
import { COLORS } from '../../constants/colors';
import Button from '../../components/common/Button';
import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import { paymentService } from '../../services/paymentService';
import { formatINR } from '../../utils/currency';

// Complete any pending auth session on web (no-op on iOS/Android, kept for parity).
WebBrowser.maybeCompleteAuthSession();

const RAZORPAY_CHECKOUT_URL = 'https://checkout.razorpay.com/v1/checkout.html';
const REDIRECT_SCHEME = 'homestr';
const REDIRECT_SUCCESS = `${REDIRECT_SCHEME}://razorpay/success`;
const REDIRECT_CANCEL = `${REDIRECT_SCHEME}://razorpay/cancel`;

/**
 * Build a query string from an object. Handles undefined / null values
 * by skipping them (so we don't get `prefill[name]=undefined` in the URL).
 */
const buildQuery = (params) => {
  const parts = [];
  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') return;
    parts.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  });
  return parts.join('&');
};

/**
 * Extract the `razorpay_*` query params from a callback URL.
 * Returns null if the URL isn't a Razorpay success callback.
 */
const parseRazorpayCallback = (rawUrl) => {
  if (!rawUrl) return null;
  // Accept either the full custom-scheme URL or an https redirect.
  if (!/razorpay\/success/i.test(rawUrl)) return null;

  // Normalize the part after the `?`.
  const qIndex = rawUrl.indexOf('?');
  if (qIndex === -1) return null;
  const query = rawUrl.slice(qIndex + 1);

  const params = {};
  query.split('&').forEach((pair) => {
    const [k, v] = pair.split('=');
    if (!k) return;
    params[decodeURIComponent(k)] = v ? decodeURIComponent(v) : '';
  });

  // Razorpay sometimes uses `razorpay_order_id` (snake) and sometimes
  // `razorpayOrderId` — handle both.
  const razorpay_order_id =
    params.razorpay_order_id || params.razorpayOrderId || params.order_id || '';
  const razorpay_payment_id =
    params.razorpay_payment_id || params.razorpayPaymentId || params.payment_id || '';
  const razorpay_signature =
    params.razorpay_signature || params.razorpaySignature || params.signature || '';

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) return null;
  return { razorpay_order_id, razorpay_payment_id, razorpay_signature };
};

/**
 * RazorpayCheckoutScreen
 *   route.params: { bookingId, serviceName, totalAmount, user }
 *
 * Flow:
 *   1. createOrder(bookingId) → { order: { id, amount, currency, receipt }, key }
 *   2. openAuthSessionAsync(<razorpay checkout URL>, redirectUrl) — pops the
 *      in-app browser open, the user pays, and the browser redirects back
 *      to `homestr://razorpay/success?razorpay_*`
 *   3. verifyPayment(...) → success toast → navigate to Bookings tab
 *   4. On cancel / dismiss / network error → toast + goBack
 */
export default function RazorpayCheckoutScreen({ route, navigation }) {
  const t = useT();
  const toast = useToast();

  const { bookingId, serviceName, totalAmount, user } = route.params || {};

  const [phase, setPhase] = useState('creating'); // creating | opening | verifying | success | cancelled | error
  const [errorMsg, setErrorMsg] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null); // { order, key }

  // Guards against double-fire (StrictMode / fast re-render).
  const verifyGuard = useRef(false);
  const startGuard = useRef(false);

  // ------------------------------------------------------------------
  // 1. createOrder on mount
  // ------------------------------------------------------------------
  useEffect(() => {
    if (startGuard.current) return;
    startGuard.current = true;

    const runCreate = async () => {
      // eslint-disable-next-line no-console
      console.log('[Razorpay] runCreate start, bookingId=', bookingId);
      if (!bookingId) {
        // eslint-disable-next-line no-console
        console.log('[Razorpay] BLOCKED: no bookingId');
        setPhase('error');
        setErrorMsg(t('payment.errOpenBrowser'));
        return;
      }
      try {
        // eslint-disable-next-line no-console
        console.log('[Razorpay] about to call createOrder');
        const res = await paymentService.createOrder(bookingId);
        // eslint-disable-next-line no-console
        console.log('[Razorpay] createOrder returned, res=', JSON.stringify(res));

        // The backend contract is { success, order: { id, amount, currency, receipt }, key }
        // but be defensive — accept any of the common shapes.
        const order =
          res?.order ||
          res?.data?.order ||
          res?.data ||
          res?.razorpayOrder ||
          null;
        const key = res?.key || res?.data?.key || res?.razorpayKey || null;

        if (res?.success && order && (order.id || order._id) && key) {
          const normalisedOrder = {
            id: order.id || order._id,
            amount: Number(order.amount ?? 0),
            currency: order.currency || 'INR',
            receipt: order.receipt || '',
          };
          setOrderInfo({ order: normalisedOrder, key });
          setPhase('opening');
        } else {
          // eslint-disable-next-line no-console
          console.log('[Razorpay] createOrder response missing fields');
          Alert.alert(
            'Create order failed',
            res?.message || 'Backend did not return a valid Razorpay order. Please contact support.',
          );
          throw new Error(res?.message || 'Failed to create order');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.log('[Razorpay] createOrder threw:', err?.message || err);
        setPhase('error');
        setErrorMsg(err?.message || t('payment.failed'));
      }
    };

    runCreate();
  }, [bookingId, t]);

  // ------------------------------------------------------------------
  // 2. openAuthSessionAsync once we have the order
  // ------------------------------------------------------------------
  useEffect(() => {
    if (phase !== 'opening' || !orderInfo) return;

    let cancelled = false;
    const openBrowser = async () => {
      const { order, key } = orderInfo;
      const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
      const email = user?.email || '';
      const contact = user?.phone || '';

      const query = buildQuery({
        key,
        order_id: order.id,
        amount: order.amount, // paise
        currency: order.currency || 'INR',
        name: 'HomeStr',
        description: serviceName,
        'prefill[name]': fullName,
        'prefill[email]': email,
        'prefill[contact]': contact,
        callback_url: REDIRECT_SUCCESS,
        cancel_url: REDIRECT_CANCEL,
      });
      const url = `${RAZORPAY_CHECKOUT_URL}?${query}`;
      // eslint-disable-next-line no-console
      console.log('[Razorpay] opening browser, url=', url);

      let result;
      try {
        result = await WebBrowser.openAuthSessionAsync(url, REDIRECT_SUCCESS);
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log('[Razorpay] openBrowser threw:', e?.message || e);
        if (cancelled) return;
        setPhase('error');
        setErrorMsg(t('payment.errOpenBrowser'));
        return;
      }

      // eslint-disable-next-line no-console
      console.log('[Razorpay] browser result:', JSON.stringify(result));
      if (cancelled) return;

      // Result shape: { type: 'success', url } | { type: 'cancel' | 'dismiss' }
      if (result?.type === 'success' && result.url) {
        const cb = parseRazorpayCallback(result.url);
        if (cb) {
          await runVerify(cb);
        } else {
          // Redirected to success URL but no fields — treat as cancel.
          handleCancel();
        }
      } else {
        handleCancel();
      }
    };

    openBrowser();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, orderInfo]);

  // ------------------------------------------------------------------
  // 3. verifyPayment (guarded against double-fire)
  // ------------------------------------------------------------------
  const runVerify = useCallback(
    async (cb) => {
      if (verifyGuard.current) return;
      verifyGuard.current = true;
      setPhase('verifying');

      try {
        const res = await paymentService.verifyPayment({
          bookingId,
          ...cb,
        });
        if (res?.success) {
          setPhase('success');
          toast.show(t('payment.success'), 'success');
          // Pop Razorpay screen + Checkout, land on Bookings tab.
          navigation.popToTop();
          navigation.navigate('Main', { screen: 'Bookings' });
        } else {
          throw new Error(res?.message || 'Verification failed');
        }
      } catch (err) {
        // User already paid at Razorpay but our backend couldn't verify —
        // explain and let them retry from Bookings (booking is still pending).
        setPhase('error');
        setErrorMsg(t('payment.verifyFailed'));
      }
    },
    [bookingId, navigation, t, toast],
  );

  const handleCancel = useCallback(() => {
    setPhase('cancelled');
    toast.show(t('payment.cancelled'), 'warning');
  }, [t, toast]);

  const handleTryAgain = useCallback(() => {
    verifyGuard.current = false;
    setPhase('opening');
    setErrorMsg(null);
  }, []);

  // Fallback for cold start: if the app was killed and re-opened via the
  // deep link (no orderInfo in memory), show a "payment already received"
  // message and let the user go back to Bookings.
  useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      const cb = parseRazorpayCallback(url);
      if (cb && orderInfo && !verifyGuard.current) {
        runVerify(cb);
      }
    });
    return () => sub.remove();
  }, [orderInfo, runVerify]);

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------
  const renderCenter = (icon, title, subtitle) => (
    <View className="flex-1 items-center justify-center px-8">
      <View
        className="w-20 h-20 rounded-full items-center justify-center mb-6"
        style={{ backgroundColor: `${COLORS.primary}15` }}
      >
        <Ionicons name={icon} size={40} color={COLORS.primary} />
      </View>
      <Text className="text-xl font-extrabold text-gray-900 dark:text-white text-center mb-2">
        {title}
      </Text>
      {subtitle ? (
        <Text className="text-sm text-gray-500 dark:text-gray-400 text-center mb-8 leading-5">
          {subtitle}
        </Text>
      ) : null}
    </View>
  );

  let body;
  if (phase === 'creating' || phase === 'verifying') {
    body = (
      <View className="flex-1 items-center justify-center px-8">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="text-base font-bold text-gray-900 dark:text-white mt-6 text-center">
          {phase === 'creating' ? t('payment.loading') : t('payment.verifying')}
        </Text>
        {totalAmount ? (
          <Text className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            {formatINR(totalAmount)}
          </Text>
        ) : null}
      </View>
    );
  } else if (phase === 'opening') {
    // Browser is being opened — keep a minimal overlay.
    body = (
      <View className="flex-1 items-center justify-center px-8">
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text className="text-base font-bold text-gray-900 dark:text-white mt-6 text-center">
          {t('payment.opening')}
        </Text>
      </View>
    );
  } else if (phase === 'success') {
    body = renderCenter(
      'checkmark-circle',
      t('payment.success'),
      t('payment.successBody'),
    );
  } else if (phase === 'cancelled') {
    body = (
      <>
        {renderCenter('close-circle', t('payment.cancelled'), t('payment.cancelledHint'))}
        <View className="px-6 pb-8">
          <Button
            title={t('payment.backToBookings')}
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('Main', { screen: 'Bookings' });
            }}
          />
        </View>
      </>
    );
  } else {
    // error
    body = (
      <>
        {renderCenter('alert-circle', t('payment.failed'), errorMsg || t('payment.failedHint'))}
        <View className="px-6 pb-8 space-y-3">
          <Button title={t('payment.tryAgain')} onPress={handleTryAgain} />
          <Button
            title={t('payment.backToBookings')}
            variant="muted"
            onPress={() => {
              navigation.popToTop();
              navigation.navigate('Main', { screen: 'Bookings' });
            }}
          />
        </View>
      </>
    );
  }

  return (
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('payment.title')} onBack={() => navigation.goBack()} />
      {body}
    </ScreenContainer>
  );
}
