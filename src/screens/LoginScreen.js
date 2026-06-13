import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Checkbox from 'expo-checkbox';
import { login } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!email.trim()) {
      setError('Email is required');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email');
      return false;
    }
    if (!password.trim()) {
      setError('Password is required');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    // if (!validate()) return;

    try {
      setLoading(true);
      setError('');
      // const data = await login(email, password);
      // console.log('Login Success:', data);
      navigation.replace('Main');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Image
          source={require('../../assets/img/welcome_bg.png')}
          style={{ width: '100%', height: 500,}}
          resizeMode="cover"
        />

        <View className="-translate-y-16 px-6" style={{transform: [{ translateY: -100 }]}}>
          <Text className="font-bold text-4xl mb-8">Login</Text>

          <Input
            value={email}
            onChangeText={setEmail}
            placeholder="Enter your email"
            icon="mail"
            isFocused={emailFocused}
            onFocus={() => setEmailFocused(true)}
            onBlur={() => setEmailFocused(false)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            icon="lock"
            secureTextEntry={!showPassword}
            showPasswordToggle
            onPasswordToggle={() => setShowPassword(!showPassword)}
            isFocused={passwordFocused}
            onFocus={() => setPasswordFocused(true)}
            onBlur={() => setPasswordFocused(false)}
          />

          <View className="flex-row justify-between items-center mt-2 mb-6">
            <TouchableOpacity 
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center"
            >
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? '#FF8383' : '#9CA3AF'}
              />
              <Text className="ml-2 text-gray-500">Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-primaryPink font-medium">Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <Text className="text-red-500 mb-4 text-center">{error}</Text>
          ) : null}

          <Button
            title="Login"
            onPress={handleLogin}
            loading={loading}
          />

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primaryPink font-bold">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ height: 200 }}>


        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
