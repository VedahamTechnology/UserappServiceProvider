import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../../constants/colors';
import { formatINR } from '../../utils/currency';
import { useT } from '../../i18n/useT';

const PLACEHOLDER = 'https://via.placeholder.com/150';

/**
 * One row in the services list. Used on HomeScreen + ServiceListScreen.
 *
 * <ServiceCard service={s} onPress={() => navigate(...)} />
 */
const ServiceCard = ({ service, onPress }) => {
  const t = useT();
  const { image, categoryName, name, description, basePrice, discountedPrice, rating = 4.5 } = service;
  const hasDiscount = discountedPrice > 0 && discountedPrice < basePrice;
  const displayPrice = discountedPrice || basePrice;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="bg-white dark:bg-slate-800 rounded-3xl p-4 flex-row border border-gray-100 dark:border-slate-700 mb-4"
    >
      <Image
        source={{ uri: image || PLACEHOLDER }}
        className="w-24 h-24 rounded-2xl"
      />
      <View className="flex-1 ml-4 justify-between py-1">
        <View>
          <View className="flex-row justify-between items-start">
            <Text className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">
              {categoryName || t('home.bookNow').toUpperCase()}
            </Text>
            <View className="flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-lg">
              <Ionicons name="star" size={10} color={COLORS.warning} />
              <Text className="text-[10px] font-black text-yellow-700 ml-1">
                {String(rating || t('home.rating'))}
              </Text>
            </View>
          </View>
          <Text className="text-base font-black text-gray-900 dark:text-white" numberOfLines={1}>
            {name}
          </Text>
          <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1" numberOfLines={2}>
            {description}
          </Text>
        </View>

        <View className="flex-row justify-between items-center mt-2">
          <View className="flex-row items-baseline">
            <Text className="text-primary font-black text-lg">{formatINR(displayPrice)}</Text>
            {hasDiscount ? (
              <Text className="text-gray-400 text-[10px] font-bold line-through ml-2">
                {formatINR(basePrice)}
              </Text>
            ) : null}
          </View>
          <View className="bg-primary/10 px-3 py-1.5 rounded-xl">
            <Text className="text-primary text-[10px] font-black">{t('home.bookNow').toUpperCase()}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ServiceCard;
