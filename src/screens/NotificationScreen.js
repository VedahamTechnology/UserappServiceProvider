import React, { useState, useCallback } from 'react';
import { View, FlatList, TouchableOpacity, RefreshControl, StatusBar } from 'react-native';
import { Feather, Ionicons } from '@expo/vector-icons';

import { useT } from '../i18n/useT';
import { useToast } from '../context/ToastContext';
import { COLORS } from '../constants/colors';
import { mapNotification } from '../utils/mappers';
import { useFocusRefresh } from '../hooks/useFocusRefresh';

import { ScreenContainer } from '../components/layout/ScreenContainer';
import NotificationItem from '../components/notification/NotificationItem';
import LoadingView from '../components/feedback/LoadingView';
import EmptyState from '../components/feedback/EmptyState';
import ErrorState from '../components/feedback/ErrorState';

import { notificationService } from '../services/notificationService';

export default function NotificationScreen({ navigation }) {
  const t = useT();
  const toast = useToast();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const response = await notificationService.getNotifications();
      if (response?.success) {
        const list = response.data?.notifications || response.data || [];
        setNotifications(list.map(mapNotification));
      } else {
        setNotifications([]);
      }
    } catch (e) {
      setError(e);
      toast.show(e?.message || t('errors.failedToFetch'), 'error');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [t, toast]);

  useFocusRefresh(fetchNotifications);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (e) {
      toast.show(e?.message || t('errors.genericError'), 'error');
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      toast.show(t('notifications.markAllRead'), 'success');
    } catch (e) {
      toast.show(e?.message || t('errors.genericError'), 'error');
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
      toast.show(t('notifications.clearAll'), 'success');
    } catch (e) {
      toast.show(e?.message || t('errors.genericError'), 'error');
    }
  };

  return (
    <ScreenContainer bgClass="bg-white dark:bg-slate-900" edges={['top']}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 -ml-2">
            <Feather name="arrow-left" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          <Text className="ml-2 text-xl font-bold dark:text-white">{t('notifications.title')}</Text>
        </View>

        <View className="flex-row space-x-2">
          <TouchableOpacity onPress={markAllRead} className="p-2">
            <Ionicons name="checkmark-done" size={20} color={COLORS.primary} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} className="p-2">
            <Feather name="trash-2" size={20} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <LoadingView />
      ) : error ? (
        <ErrorState message={error.message} onRetry={() => fetchNotifications()} />
      ) : (
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <NotificationItem item={item} onPress={() => markAsRead(item.id)} />}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchNotifications(true)}
              colors={[COLORS.primary]}
            />
          }
          ListEmptyComponent={<EmptyState icon="bell-off" title={t('notifications.empty')} />}
        />
      )}
    </ScreenContainer>
  );
}