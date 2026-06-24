import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator, 
  RefreshControl,
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { notificationService } from '../services/notificationService';
import { primaryColor } from '../constants/color';

const NotificationItem = ({ item, onMarkAsRead, onDelete }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'booking_created':
      case 'booking_accepted':
        return { name: 'calendar', color: '#3B82F6', bg: '#DBEAFE' };
      case 'booking_completed':
        return { name: 'check-circle', color: '#10B981', bg: '#D1FAE5' };
      case 'booking_cancelled':
      case 'booking_rejected':
        return { name: 'x-circle', color: '#EF4444', bg: '#FEE2E2' };
      default:
        return { name: 'bell', color: primaryColor, bg: '#FFE4E6' };
    }
  };

  const iconData = getIcon(item.type);
  const formattedDate = new Date(item.createdAt).toLocaleDateString([], { 
    day: '2-digit', 
    month: 'short', 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <TouchableOpacity 
      activeOpacity={0.7}
      className={`p-4 mb-3 rounded-3xl flex-row items-center border ${item.isRead ? 'bg-white border-gray-100' : 'bg-primaryColor/5 border-primaryColor/10'}`}
      onPress={() => !item.isRead && onMarkAsRead(item._id)}
    >
      <View 
        className="w-12 h-12 rounded-2xl items-center justify-center"
        style={{ backgroundColor: iconData.bg }}
      >
        <Feather name={iconData.name} size={24} color={iconData.color} />
      </View>
      
      <View className="flex-1 ml-4">
        <View className="flex-row justify-between items-start">
          <Text className={`text-base flex-1 ${item.isRead ? 'font-bold text-gray-700' : 'font-black text-gray-900'}`}>
            {item.title}
          </Text>
          <Text className="text-[10px] text-gray-400 font-bold ml-2">
            {formattedDate}
          </Text>
        </View>
        <Text className="text-sm text-gray-500 mt-1" numberOfLines={2}>
          {item.message}
        </Text>
      </View>

      {!item.isRead && (
        <View className="ml-3 w-2 h-2 rounded-full bg-primaryColor" />
      )}
    </TouchableOpacity>
  );
};

export default function NotificationScreen({ navigation }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await notificationService.getNotifications();
      if (response.success) {
        setNotifications(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = async (id) => {
    try {
      await notificationService.markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const clearAll = async () => {
    try {
      await notificationService.clearAllNotifications();
      setNotifications([]);
    } catch (error) {
      console.error('Error clearing notifications:', error);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <View className="flex-row items-center">
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={primaryColor} />
          </TouchableOpacity>
          <Text className="ml-4 text-xl font-bold dark:text-white">Notifications</Text>
        </View>
        
        <View className="flex-row space-x-2">
          <TouchableOpacity onPress={markAllRead} className="p-2">
            <Ionicons name="checkmark-done" size={20} color={primaryColor} />
          </TouchableOpacity>
          <TouchableOpacity onPress={clearAll} className="p-2">
            <Feather name="trash-2" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <FlatList
          data={notifications}
          renderItem={({ item }) => (
            <NotificationItem 
              item={item} 
              onMarkAsRead={markAsRead}
            />
          )}
          keyExtractor={item => item._id}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchNotifications(true)} colors={[primaryColor]} />
          }
          ListEmptyComponent={
            <View className="py-20 items-center">
              <View className="w-20 h-20 bg-gray-50 rounded-full items-center justify-center mb-4">
                <Feather name="bell-off" size={40} color="#9CA3AF" />
              </View>
              <Text className="text-gray-400 font-bold">No notifications yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}
