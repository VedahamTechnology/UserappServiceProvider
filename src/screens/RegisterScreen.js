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
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
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
            className="flex-1 bg-white"
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

                <View className="-translate-y-12 px-6" style={{ transform: [{ translateY: -250 }] }}>
                    <Text className="font-bold text-4xl mb-8">Register</Text>

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
                        <Text className="text-gray-500">Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text className="text-primaryPink font-bold">Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
