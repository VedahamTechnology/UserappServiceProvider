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

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useT } from '../i18n/useT';
import { COLORS } from '../constants/colors';
import {
  isValidEmail,
  isStrongEnoughPassword,
} from '../utils/validation';

import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const toast = useToast();
  const t = useT();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const { email, password } = formData;
    if (!email || !password) {
      setError(t('auth.errAllFieldsRequired'));
      return false;
    }
    if (!isValidEmail(email)) {
      setError(t('auth.errInvalidEmail'));
      return false;
    }
    if (!isStrongEnoughPassword(password)) {
      setError(t('auth.errPasswordTooShort'));
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');
    try {
      const response = await login(formData.email, formData.password);
      if (response?.success) {
        navigation.replace('Main');
      } else {
        const msg = response?.message || t('auth.errLoginFailed');
        setError(msg);
        toast.show(msg, 'error');
      }
    } catch (err) {
      const msg = err?.message || t('auth.errUnexpected');
      setError(msg);
      toast.show(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white dark:bg-slate-900"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={{ flexGrow: 1 }}
      >
        <Image
          source={require('../../assets/img/welcome_bg.png')}
          style={{ width: '100%', height: 500, transform: [{ translateY: -150 }] }}
          resizeMode="cover"
        />

        <View className="-translate-y-12 px-6" style={{ transform: [{ translateY: -200 }] }}>
          <Text className="font-bold text-4xl mb-8 dark:text-white">{t('auth.login')}</Text>

          <Input
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            placeholder={t('auth.emailPlaceholder')}
            icon="mail"
            isFocused={focusedField === 'email'}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Input
            value={formData.password}
            onChangeText={(val) => handleChange('password', val)}
            placeholder={t('auth.password')}
            icon="lock"
            secureTextEntry={!showPassword}
            showPasswordToggle
            onPasswordToggle={() => setShowPassword(!showPassword)}
            isFocused={focusedField === 'password'}
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />

          <View className="flex-row justify-between items-center mt-2 mb-6">
            <TouchableOpacity
              onPress={() => setRememberMe(!rememberMe)}
              className="flex-row items-center"
            >
              <Checkbox
                value={rememberMe}
                onValueChange={setRememberMe}
                color={rememberMe ? COLORS.primary : COLORS.textSubtle}
              />
              <Text className="ml-2 text-gray-500 dark:text-gray-400">
                {t('auth.rememberMe')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-primary font-medium">{t('auth.forgotPassword')}</Text>
            </TouchableOpacity>
          </View>

          {error ? (
            <Text className="text-danger mb-4 text-center">{error}</Text>
          ) : null}

          <Button title={t('auth.login')} onPress={handleLogin} loading={loading} />

          <View className="flex-row justify-center mt-8 pb-10">
            <Text className="text-gray-500 dark:text-gray-400">{t('auth.noAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text className="text-primary font-bold">{t('auth.register')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}