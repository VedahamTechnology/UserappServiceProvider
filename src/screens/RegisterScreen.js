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

export default function RegisterScreen({ navigation }) {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        gender: 'male', // default gender
    });
    const [focusedField, setFocusedField] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const validate = () => {
        const { firstName, lastName, phone, email, password, confirmPassword } = formData;
        if (!firstName || !lastName || !phone || !email || !password || !confirmPassword) {
            setError('Please provide all required fields');
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
        if (!validate()) return;

        try {
            setLoading(true);
            setError('');
            const { confirmPassword, ...registerData } = formData;
            const response = await register(registerData);
            if (response.success) {
                navigation.replace('Main');
            } else {
                setError(response.message || 'Registration failed');
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
                    <Text className="font-bold text-4xl mb-8 dark:text-white">Register</Text>

                    <View className="flex-row justify-between">
                        <View className="w-[48%]">
                            <Input
                                value={formData.firstName}
                                onChangeText={(val) => handleChange('firstName', val)}
                                placeholder="First Name"
                                icon="user"
                                keyboardType="default"
                                isFocused={focusedField === 'firstName'}
                                onFocus={() => setFocusedField('firstName')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>

                        <View className="w-[48%]">
                            <Input
                                value={formData.lastName}
                                onChangeText={(val) => handleChange('lastName', val)}
                                placeholder="Last Name"
                                icon="user"
                                keyboardType="default"

                                isFocused={focusedField === 'lastName'}
                                onFocus={() => setFocusedField('lastName')}
                                onBlur={() => setFocusedField(null)}
                            />
                        </View>
                    </View>

                    <Input
                        value={formData.phone}
                        onChangeText={(val) => handleChange('phone', val)}
                        placeholder="Phone Number"
                        icon="phone"
                        keyboardType="phone-pad"
                        isFocused={focusedField === 'phone'}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                    />

                    <Input
                        value={formData.email}
                        onChangeText={(val) => handleChange('email', val)}
                        placeholder="Email Address"
                        icon="mail"
                        isFocused={focusedField === 'email'}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <View className="mb-6">
                        <Text className="text-gray-500 dark:text-gray-400 mb-3 ml-1 font-medium">Gender</Text>
                        <View className="flex-row justify-between">
                            {['male', 'female', 'other'].map((g) => (
                                <TouchableOpacity
                                    key={g}
                                    onPress={() => handleChange('gender', g)}
                                    className="flex-row items-center space-x-2"
                                >
                                    <View className={`w-5 h-5 rounded-full border-2 items-center justify-center ${formData.gender === g ? 'border-primaryPink' : 'border-gray-300 dark:border-slate-600'}`}>
                                        {formData.gender === g && (
                                            <View className="w-2.5 h-2.5 rounded-full bg-primaryPink" />
                                        )}
                                    </View>
                                    <Text className={`capitalize ml-2 ${formData.gender === g ? 'text-gray-900 dark:text-white font-bold' : 'text-gray-500'}`}>
                                        {g}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

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

                    <Input
                        value={formData.confirmPassword}
                        onChangeText={(val) => handleChange('confirmPassword', val)}
                        placeholder="Confirm Password"
                        icon="lock"
                        showPasswordToggle
                        onPasswordToggle={() => setShowPassword(!showPassword)}
                        secureTextEntry={!showPassword}
                        isFocused={focusedField === 'confirmPassword'}
                        onFocus={() => setFocusedField('confirmPassword')}
                        onBlur={() => setFocusedField(null)}
                    />

                    {error ? (
                        <Text className="text-red-500 mb-4 text-center">{error}</Text>
                    ) : null}

                    <Button
                        title="Create Account"
                        onPress={handleRegister}
                        loading={loading}
                    />

                    <View className="flex-row justify-center mt-8 pb-10">
                        <Text className="text-gray-500 dark:text-gray-400">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-primaryPink font-bold">Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
