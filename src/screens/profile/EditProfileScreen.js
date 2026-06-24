import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { primaryColor } from '../../constants/color';
import {getCurrentUser} from '../../services/authService'

const SectionHeader = ({ title }) => (
  <View className="px-4 py-3 bg-gray-50 dark:bg-slate-800">
    <Text className="text-sm font-bold text-gray-500 uppercase">
      {title}
    </Text>
  </View>
);

const SettingItem = ({ icon, title, value, onPress }) => (
  <TouchableOpacity
    onPress={onPress}
    className="flex-row items-center justify-between px-4 py-4 bg-white border-b border-gray-100"
  >
    <View className="flex-row items-center flex-1">
      <View className="w-8">
        <Feather name={icon} size={20} color={primaryColor} />
      </View>

      <View className="ml-3 flex-1">
        <Text className="text-base font-semibold text-gray-800">
          {title}
        </Text>

        {value ? (
          <Text className="text-sm text-gray-500 mt-1">
            {value}
          </Text>
        ) : null}
      </View>
    </View>

    <Feather name="chevron-right" size={20} color="#9CA3AF" />
  </TouchableOpacity>
);

export default function EditProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const data = await getCurrentUser();
      console.log('User data:', data); // Log the entire response for debugging

      if (data.success) {
        setUser(data.user);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator
          size="large"
          color={primaryColor}
        />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row items-center px-4 py-3 border-b border-gray-100">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather
            name="arrow-left"
            size={24}
            color={primaryColor}
          />
        </TouchableOpacity>

        <Text className="ml-4 text-xl font-bold">
          Edit Profile
        </Text>
      </View>

      <ScrollView className="flex-1 bg-gray-50">
        <SectionHeader title="Personal Information" />

        <SettingItem
          icon="user"
          title="Full Name"
          value={`${user?.firstName || ''} ${user?.lastName || ''}`}
        />

        <SettingItem
          icon="mail"
          title="Email"
          value={user?.email}
        />

        <SettingItem
          icon="phone"
          title="Phone"
          value={user?.phone}
        />

        <SettingItem
          icon="shield"
          title="Role"
          value={user?.role}
        />

        <SettingItem
          icon="check-circle"
          title="Status"
          value={user?.isActive ? 'Active' : 'Inactive'}
        />

        <SectionHeader title="Account Information" />

        <SettingItem
          icon="hash"
          title="User ID"
          value={user?.userId}
        />

        <SettingItem
          icon="calendar"
          title="Created At"
          value={
            user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString()
              : ''
          }
        />

        <View className="p-4">
          <TouchableOpacity
            className="py-4 rounded-xl items-center"
            style={{ backgroundColor: primaryColor }}
          >
            <Text className="text-white font-bold text-lg">
              Save Changes
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}