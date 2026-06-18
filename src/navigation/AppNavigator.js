import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import CategoryListScreen from '../screens/CategoryListScreen';
import ServiceListScreen from '../screens/ServiceListScreen';
import ServiceDetailScreen from '../screens/ServiceDetailScreen';
import NotificationScreen from '../screens/NotificationScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import MainTabNavigator from './MainTabNavigator';

// Profile Screens
import EditProfileScreen from '../screens/profile/EditProfileScreen';
import ScrapDealsScreen from '../screens/profile/ScrapDealsScreen';
import MyPlansScreen from '../screens/profile/MyPlansScreen';
import MyBookingScreen from '../screens/profile/MyBookingScreen';
import MyRatingScreen from '../screens/profile/MyRatingScreen';
import ManageAddressScreen from '../screens/profile/ManageAddressScreen';
import HelpSupportScreen from '../screens/profile/HelpSupportScreen';
import AboutAppScreen from '../screens/profile/AboutAppScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Main"
        component={MainTabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CategoryList"
        component={CategoryListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceList"
        component={ServiceListScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ServiceDetail"
        component={ServiceDetailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScreen}
        options={{ headerShown: false }}
      />

      {/* Profile Stack */}
      <Stack.Group screenOptions={{ headerShown: false }}>
        <Stack.Screen name="EditProfile" component={EditProfileScreen} />
        <Stack.Screen name="ScrapDeals" component={ScrapDealsScreen} />
        <Stack.Screen name="MyPlans" component={MyPlansScreen} />
        <Stack.Screen name="MyBooking" component={MyBookingScreen} />
        <Stack.Screen name="MyRating" component={MyRatingScreen} />
        <Stack.Screen name="ManageAddress" component={ManageAddressScreen} />
        <Stack.Screen name="HelpSupport" component={HelpSupportScreen} />
        <Stack.Screen name="AboutApp" component={AboutAppScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
}