import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../i18n/useT';
import { useImagePicker } from '../hooks/useImagePicker';
import { COLORS } from '../constants/colors';

import ProfileMenuItem from '../components/profile/ProfileMenuItem';
import SectionCard from '../components/profile/SectionCard';

export default function ProfileScreen({ navigation }) {
  const t = useT();
  const toast = useToast();
  const { user, logout } = useAuth();
  const { isDark, toggleScheme } = useTheme();

  const { image, pick } = useImagePicker();

  const handleLogout = useCallback(() => {
    Alert.alert(
      t('auth.logoutTitle'),
      t('auth.logoutConfirm'),
      [
        { text: t('common.cancel'), style: 'cancel' },
        {
          text: t('auth.logout'),
          style: 'destructive',
          onPress: async () => {
            try {
              await logout();
            } catch (e) {
              // Even if logout request fails, the local session is cleared.
              // We surface a toast for diagnostics only.
              toast.show(e?.message || t('errors.genericError'), 'error');
            } finally {
              navigation.replace('Login');
            }
          },
        },
      ],
    );
  }, [logout, navigation, t, toast]);

  if (!user) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 dark:bg-slate-900">
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || t('profile.userFallback');
  const avatarSource = image
    ? { uri: image }
    : user.avatar
      ? { uri: user.avatar }
      : require('../../assets/img/user_avtar.png');

  return (
    <SafeAreaView edges={['top']} className="flex-1 bg-gray-50 dark:bg-slate-900">
      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 32 }}
      >
        {/* Header */}
        <View className="px-6 pt-6 pb-2">
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {t('profile.title')}
          </Text>
        </View>

        {/* User Card */}
        <View className="mx-4 mt-4 bg-primary rounded-3xl p-6 shadow-lg shadow-primary/30">
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1 pr-3">
              <View className="relative">
                <Image
                  source={avatarSource}
                  className="w-20 h-20 rounded-full border-2 border-white/30"
                />
                <TouchableOpacity
                  onPress={pick}
                  className="absolute -bottom-1 -right-1 bg-white p-2 rounded-full shadow-md"
                  accessibilityLabel={t('profile.changePhoto')}
                >
                  <Feather name="camera" size={14} color={COLORS.primary} />
                </TouchableOpacity>
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-xl font-bold text-white" numberOfLines={1}>
                  {fullName}
                </Text>
                <Text className="text-white/80 text-sm mt-0.5" numberOfLines={1}>
                  {user.email}
                </Text>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('EditProfile')}
              className="bg-white/20 p-3 rounded-xl"
              accessibilityLabel={t('profile.editProfile')}
            >
              <Feather name="edit-3" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Actions */}
        <View className="px-6 mt-8 mb-3">
          <Text className="text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('profile.sectionMain')}
          </Text>
        </View>
        <SectionCard>
          <ProfileMenuItem
            icon="percent"
            title={t('profile.menuScrapDeals')}
            onPress={() => navigation.navigate('ScrapDeals')}
          />
          <ProfileMenuItem
            icon="layers"
            title={t('profile.menuMyPlans')}
            onPress={() => navigation.navigate('MyPlans')}
          />
          <ProfileMenuItem
            icon="calendar"
            title={t('profile.menuMyBooking')}
            onPress={() => navigation.navigate('MyBooking')}
          />
          <ProfileMenuItem
            icon="star"
            title={t('profile.menuMyRating')}
            onPress={() => navigation.navigate('MyRating')}
          />
          <ProfileMenuItem
            icon="map-pin"
            title={t('profile.menuManageAddress')}
            onPress={() => navigation.navigate('ManageAddress')}


          />
          <ProfileMenuItem
            icon="moon"
            title={"Theme"}
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleScheme}
                trackColor={{ false: '#D1D5DB', true: COLORS.primary }}
                thumbColor={isDark ? '#FFFFFF' : '#F3F4F6'}
              />
            }
          />


        </SectionCard>

        {/* Support & App */}
        <View className="px-6 mt-8 mb-3">
          <Text className="text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('profile.sectionMore')}
          </Text>
        </View>
        <SectionCard>
          <ProfileMenuItem
            icon="help-circle"
            title={t('profile.menuHelpSupport')}
            onPress={() => navigation.navigate('HelpSupport')}
          />
          <ProfileMenuItem
            icon="info"
            title={t('profile.menuAboutApp')}
            onPress={() => navigation.navigate('AboutApp')}
          />
          <ProfileMenuItem
            icon="log-out"
            title={t('profile.menuLogout')}
            onPress={handleLogout}
            isLast
          />
        </SectionCard>
      </ScrollView>
    </SafeAreaView>
  );
}