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
import { register } from '../services/authService';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Checkbox from 'expo-checkbox';

export default function LoginScreen({ navigation }) {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
        const { firstName, lastName, phone, email, password, confirmPassword } = formData;
        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
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
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return false;
        }
        return true;
    };

    const handleRegister = async () => {
        // if (!validate()) return;

        try {
            setLoading(true);
            setError('');
            // await register({ ...formData });
            navigation.replace('Main');
        } catch (err) {
            setError(err.message);
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
                color={rememberMe ? '#FF8383' : '#9CA3AF'}
              />
              <Text className="ml-2 text-gray-500 dark:text-gray-400">Remember me</Text>
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
                        onPress={handleRegister}
                        loading={loading}
                    />

                    <View className="flex-row justify-center mt-8 pb-10">
                        <Text className="text-gray-500 dark:text-gray-400">don't have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-primaryPink font-bold">Register</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
