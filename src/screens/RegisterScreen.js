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

import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useT } from '../i18n/useT';
import { COLORS } from '../constants/colors';
import {
  isValidEmail,
  isValidPhone,
  isStrongEnoughPassword,
} from '../utils/validation';

import Button from '../components/common/Button';
import Input from '../components/common/Input';

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const toast = useToast();
  const t = useT();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: 'male',
  });
  const [focusedField, setFocusedField] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const validate = () => {
    const { firstName, lastName, phone, email, password, confirmPassword } = formData;
    if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
      setError(t('auth.errMissingRequiredFields'));
      return false;
    }
    if (!isValidEmail(email)) {
      setError(t('auth.errInvalidEmail'));
      return false;
    }
    if (!isValidPhone(phone)) {
      setError(t('auth.errInvalidPhone') || 'Invalid phone number');
      return false;
    }
    if (!isStrongEnoughPassword(password)) {
      setError(t('auth.errPasswordTooShort'));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t('auth.errPasswordMismatch'));
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    setError('');
    try {
      const { confirmPassword, ...registerData } = formData;
      const response = await register(registerData);
      if (response?.success) {
        navigation.replace('Main');
      } else {
        const msg = response?.message || t('auth.errRegisterFailed');
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
          <Text className="font-bold text-4xl mb-8 dark:text-white">{t('auth.register')}</Text>

          <View className="flex-row justify-between">
            <View className="w-[48%]">
              <Input
                value={formData.firstName}
                onChangeText={(val) => handleChange('firstName', val)}
                placeholder={t('auth.firstName')}
                icon="user"
                isFocused={focusedField === 'firstName'}
                onFocus={() => setFocusedField('firstName')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
            <View className="w-[48%]">
              <Input
                value={formData.lastName}
                onChangeText={(val) => handleChange('lastName', val)}
                placeholder={t('auth.lastName')}
                icon="user"
                isFocused={focusedField === 'lastName'}
                onFocus={() => setFocusedField('lastName')}
                onBlur={() => setFocusedField(null)}
              />
            </View>
          </View>

          <Input
            value={formData.phone}
            onChangeText={(val) => handleChange('phone', val)}
            placeholder={t('auth.phoneNumber')}
            icon="phone"
            keyboardType="phone-pad"
            isFocused={focusedField === 'phone'}
            onFocus={() => setFocusedField('phone')}
            onBlur={() => setFocusedField(null)}
          />

          <Input
            value={formData.email}
            onChangeText={(val) => handleChange('email', val)}
            placeholder={t('auth.emailPlaceholder')}
            icon="mail"
            keyboardType="email-address"
            autoCapitalize="none"
            isFocused={focusedField === 'email'}
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />

          <View className="mb-6">
            <Text className="text-gray-500 dark:text-gray-400 mb-3 ml-1 font-medium">
              {t('auth.gender')}
            </Text>
            <View className="flex-row justify-between">
              {[
                { value: 'male', label: t('auth.genderMale') },
                { value: 'female', label: t('auth.genderFemale') },
                { value: 'other', label: t('auth.genderOther') },
              ].map((g) => (
                <TouchableOpacity
                  key={g.value}
                  onPress={() => handleChange('gender', g.value)}
                  className="flex-row items-center"
                >
                  <View
                    className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                      formData.gender === g.value ? 'border-primary' : 'border-gray-300 dark:border-slate-600'
                    }`}
                  >
                    {formData.gender === g.value ? (
                      <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                    ) : null}
                  </View>
                  <Text
                    className={`capitalize ml-2 ${
                      formData.gender === g.value
                        ? 'text-gray-900 dark:text-white font-bold'
                        : 'text-gray-500'
                    }`}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

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

          <Input
            value={formData.confirmPassword}
            onChangeText={(val) => handleChange('confirmPassword', val)}
            placeholder={t('auth.confirmPassword')}
            icon="lock"
            showPasswordToggle
            onPasswordToggle={() => setShowPassword(!showPassword)}
            secureTextEntry={!showPassword}
            isFocused={focusedField === 'confirmPassword'}
            onFocus={() => setFocusedField('confirmPassword')}
            onBlur={() => setFocusedField(null)}
          />

          {error ? (
            <Text className="text-danger mb-4 text-center">{error}</Text>
          ) : null}

          <Button title={t('auth.createAccount')} onPress={handleRegister} loading={loading} />

          <View className="flex-row justify-center mt-8 pb-10">
            <Text className="text-gray-500 dark:text-gray-400">{t('auth.haveAccount')} </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text className="text-primary font-bold">{t('auth.login')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}