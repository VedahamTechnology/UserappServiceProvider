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
import { login } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Checkbox from 'expo-checkbox';
import { primaryColor } from '../constants/color';

export default function LoginScreen({ navigation }) {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const { email, password } = formData;
        if (!email || !password) {
            setError('All fields are required');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError('Invalid email format');
            return false;
        }
        if (password.length < 6) {
            setError('Password must be at least 6 characters');
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        if (!validate()) return;

        try {
            setLoading(true);
            setError('');
            const response = await login(formData.email, formData.password);
            if (response.success) {
                // You might want to save the token here
                navigation.replace('Main');
            } else {
                setError(response.message || 'Login failed');
            }
        } catch (err) {
            setError(err.message || 'An unexpected error occurred');
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
                    <Text className="font-bold text-4xl mb-8 dark:text-white">Login</Text>


                    <Input
                        value={formData.email}
                        onChangeText={(val) => handleChange('email', val)}
                        placeholder="Email Addresss"
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
                        placeholder="Password"
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
                color={rememberMe ? primaryColor : '#9CA3AF'}
              />
              <Text className="ml-2 text-gray-500 dark:text-gray-400">Remember me</Text>
            </TouchableOpacity>

            <TouchableOpacity>
              <Text className="text-primaryColor font-medium">Forgot Password?</Text>
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

                    <View className="flex-row justify-center mt-8 pb-10">
                        <Text className="text-gray-500 dark:text-gray-400">don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-primaryColor font-bold">Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
