import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';

import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useT } from '../../i18n/useT';
import { COLORS } from '../../constants/colors';
import { isValidPhone } from '../../utils/validation';

import { ScreenContainer, ScreenHeader } from '../../components/layout/ScreenContainer';
import SectionCard from '../../components/profile/SectionCard';
import InfoRow from '../../components/profile/InfoRow';
import FormField from '../../components/common/FormField';
import Button from '../../components/common/Button';

const GENDER_OPTIONS = [
  { value: 'male', key: 'auth.genderMale' },
  { value: 'female', key: 'auth.genderFemale' },
  { value: 'other', key: 'auth.genderOther' },
];

export default function EditProfileScreen({ navigation }) {
  const t = useT();
  const toast = useToast();
  const { user, refreshUser, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    gender: 'male',
  });
  const [error, setError] = useState('');

  // Seed the form from the current user and refresh on mount so the
  // screen reflects the latest data.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        await refreshUser();
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshUser]);

  useEffect(() => {
    if (!user) return;
    setForm({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      phone: user.phone || '',
      gender: user.gender || 'male',
    });
  }, [user]);

  const original = useMemo(
    () => ({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: user?.phone || '',
      gender: user?.gender || 'male',
    }),
    [user]
  );

  const dirty =
    form.firstName !== original.firstName ||
    form.lastName !== original.lastName ||
    form.phone !== original.phone ||
    form.gender !== original.gender;

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError('');
  };

  const validate = () => {
    if (!form.firstName.trim()) return t('editProfile.errFirstNameRequired');
    if (!form.lastName.trim()) return t('editProfile.errLastNameRequired');
    if (form.phone && !isValidPhone(form.phone)) {
      return t('auth.errInvalidPhone') || 'Please enter a valid phone number';
    }
    return '';
  };

  const handleSave = async () => {
    const msg = validate();
    if (msg) {
      setError(msg);
      toast.show(msg, 'error');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const response = await updateProfile({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        gender: form.gender,
      });
      if (response?.success) {
        toast.show(t('editProfile.saveSuccess'), 'success');
        navigation.goBack();
      } else {
        const errMsg = response?.message || t('editProfile.saveFailed');
        setError(errMsg);
        toast.show(errMsg, 'error');
      }
    } catch (err) {
      const errMsg = err?.message || t('editProfile.saveFailed');
      setError(errMsg);
      toast.show(errMsg, 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenContainer bgClass="bg-gray-50 dark:bg-slate-900" edges={['top']}>
      <ScreenHeader title={t('editProfile.title')} onBack={() => navigation.goBack()} />

      {loading && !user ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={{ paddingBottom: 32 }}
        >
          {/* Personal Information */}
          <Text className="px-6 mt-8 mb-3 text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('editProfile.sectionPersonal')}
          </Text>
          <SectionCard className="mx-4 px-5">
            <View className="flex-row justify-between p-2">
              <View className="w-[48%]">
                <FormField
                  label={t('editProfile.fieldFirstName')}
                  value={form.firstName}
                  onChangeText={(v) => handleChange('firstName', v)}
                  placeholder={t('editProfile.fieldFirstName')}
                  autoCapitalize="words"
                />
              </View>
              <View className="w-[48%]">
                <FormField
                  label={t('editProfile.fieldLastName')}
                  value={form.lastName}
                  onChangeText={(v) => handleChange('lastName', v)}
                  placeholder={t('editProfile.fieldLastName')}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <FormField
              label={t('editProfile.fieldPhone')}
              value={form.phone}
              onChangeText={(v) => handleChange('phone', v)}
              placeholder={t('editProfile.fieldPhone')}
              keyboardType="phone-pad"
            />

            <View className="mt-3 mb-1 p-2">
              <Text className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {t('editProfile.fieldGender')}
              </Text>
              <View className="flex-row justify-between">
                {GENDER_OPTIONS.map((g) => {
                  const selected = form.gender === g.value;
                  return (
                    <TouchableOpacity
                      key={g.value}
                      onPress={() => handleChange('gender', g.value)}
                      className="flex-row items-center"
                      accessibilityRole="radio"
                      accessibilityState={{ selected }}
                    >
                      <View
                        className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
                          selected ? 'border-primary' : 'border-gray-300 dark:border-slate-600'
                        }`}
                      >
                        {selected ? (
                          <View className="w-2.5 h-2.5 rounded-full bg-primary" />
                        ) : null}
                      </View>
                      <Text
                        className={`capitalize ml-2 ${
                          selected
                            ? 'text-gray-900 dark:text-white font-bold'
                            : 'text-gray-500'
                        }`}
                      >
                        {t(g.key)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </SectionCard>

          {/* Email (read-only) */}
          <Text className="px-6 mt-8 mb-3 text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('auth.email')}
          </Text>
          <SectionCard className="mx-4 px-5">
            <InfoRow
              label={t('auth.email')}
              value={user?.email}
              isLast
            />
            <Text className="text-xs text-gray-400 dark:text-gray-500 italic -mt-2 mb-3 px-1">
              {t('editProfile.emailImmutableHint')}
            </Text>
          </SectionCard>

          {/* Account Information */}
          <Text className="px-6 mt-8 mb-3 text-base font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
            {t('editProfile.sectionAccount')}
          </Text>
          <SectionCard className="mx-4 mb-2 px-4">
            <InfoRow label={t('editProfile.rowRole')} value={user?.role} />
            <InfoRow
              label={t('editProfile.rowStatus')}
              value={user?.isActive ? t('common.active') : t('common.inactive')}
              isLast
            />
          </SectionCard>

          <SectionCard className="mx-4 px-3">
            <InfoRow label={t('editProfile.rowUserId')} value={user?.userId || user?.id} />
            <InfoRow
              label={t('editProfile.rowCreatedAt')}
              value={
                user?.createdAt
                  ? new Date(user.createdAt).toLocaleDateString()
                  : ''
              }
              isLast
            />
          </SectionCard>

          {error ? (
            <Text className="text-danger text-center text-sm mt-4 px-6">{error}</Text>
          ) : null}

          <View className="px-6 mt-6 mb-4">
            <Button
              title={t('auth.saveChanges')}
              onPress={handleSave}
              loading={saving}
              disabled={!dirty || saving}
            />
          </View>
        </ScrollView>
      )}
    </ScreenContainer>
  );
}
