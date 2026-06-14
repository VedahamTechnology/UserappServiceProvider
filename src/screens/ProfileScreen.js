import { Feather, MaterialIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import * as ImagePicker from 'expo-image-picker';

const ProfileMenuItem = ({ icon, title, onPress, isLast, color = "#FF8383", rightElement }) => (
  <TouchableOpacity
    onPress={onPress}
    disabled={!!rightElement}
    className={`flex-row items-center justify-between py-4 ${!isLast ? 'border-b border-gray-50 dark:border-slate-700' : ''}`}
  >
    <View className="flex-row items-center">
      <View className="w-8 items-center">
        <Feather name={icon} size={22} color={color} />
      </View>
      <Text className="ml-4 text-lg text-gray-700 dark:text-gray-200 font-medium">{title}</Text>
    </View>
    {rightElement ? rightElement : <Feather name="chevron-right" size={20} color="#9CA3AF" />}
  </TouchableOpacity>
);

export default function ProfileScreen({ navigation }) {
  const { colorScheme, toggleColorScheme } = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [profileImage, setProfileImage] = useState(null);

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => navigation.replace('Login'), style: 'destructive' }
      ]
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-gray-50 dark:bg-slate-900"
    >
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="px-4 py-4">
          <Text className="text-3xl font-extrabold text-gray-900 dark:text-white">
            Profile
          </Text>
        </View>

        {/* User Card */}
        <View className="bg-primaryPink rounded-2xl p-5 mx-4 shadow-lg shadow-primaryPink/30 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="relative">
              <Image
                source={profileImage ? { uri: profileImage } : require('../../assets/img/user_avtar.png')}
                className="w-20 h-20 rounded-full border-2 border-white/30"
              />
              <TouchableOpacity 
                onPress={pickImage}
                className="absolute bottom-0 right-0 bg-white p-1.5 rounded-full shadow-sm"
              >
                <Feather name="camera" size={14} color="#FF8383" />
              </TouchableOpacity>
            </View>
            <View className="ml-4">
              <Text className="text-2xl font-bold text-white">John Doe</Text>
              <Text className="text-white/80 text-base">@johndoe</Text>
            </View>
          </View>
          <TouchableOpacity 
            onPress={() => navigation.navigate('EditProfile')}
            className="bg-white/20 p-2.5 rounded-xl"
          >
            <Feather name="edit-3" size={22} color="white" />
          </TouchableOpacity>
        </View>

        {/* Container 2: Main Actions */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl mx-4 mt-6 px-4 shadow-sm">
          <ProfileMenuItem icon="percent" title="Scrap Deals" onPress={() => navigation.navigate('ScrapDeals')} />
          <ProfileMenuItem icon="layers" title="My Plans" onPress={() => navigation.navigate('MyPlans')} />
          <ProfileMenuItem icon="calendar" title="My Booking" onPress={() => navigation.navigate('MyBooking')} />
          <ProfileMenuItem icon="star" title="My Rating" onPress={() => navigation.navigate('MyRating')} />
          <ProfileMenuItem icon="map-pin" title="Manage Address" onPress={() => navigation.navigate('ManageAddress')} />
          <ProfileMenuItem 
            icon={isDark ? "moon" : "sun"} 
            title={isDark ? "Dark Mode" : "Light Mode"} 
            isLast 
            rightElement={
              <Switch
                value={isDark}
                onValueChange={toggleColorScheme}
                trackColor={{ false: '#D1D5DB', true: '#FF8383' }}
                thumbColor={isDark ? '#FFFFFF' : '#F3F4F6'}
              />
            }
          />
        </View>

        {/* Container 3: Support & App */}
        <View className="px-4 mt-6 mb-2">
          <Text className="text-xl font-bold text-gray-800 dark:text-white">More</Text>
        </View>
        
        <View className="bg-white dark:bg-slate-800 rounded-2xl mx-4 mb-8 px-4 shadow-sm">
          <ProfileMenuItem icon="help-circle" title="Help and Support" onPress={() => navigation.navigate('HelpSupport')} />
          <ProfileMenuItem icon="info" title="About App" onPress={() => navigation.navigate('AboutApp')} />
          <ProfileMenuItem 
            icon="log-out" 
            title="Logout" 
            onPress={handleLogout} 
            isLast 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
