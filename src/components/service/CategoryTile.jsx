import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useT } from '../../i18n/useT';

const PLACEHOLDER = 'https://cdn-icons-png.flaticon.com/512/10473/10473663.png';

/**
 * Category tile — small variant on HomeScreen, large variant on CategoryListScreen.
 *
 * <CategoryTile category={c} size="small" onPress={...} />
 */
const CategoryTile = ({ category, onPress, size = 'small' }) => {
  const t = useT();
  const isLarge = size === 'large';

  if (isLarge) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="w-[48%] bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 items-center mb-4 border border-gray-100 dark:border-slate-700"
      >
        <View className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl items-center justify-center mb-4 overflow-hidden">
          <Image
            source={{ uri: category.image && category.image.startsWith('http') ? category.image : PLACEHOLDER }}
            className="w-12 h-12"
            resizeMode="contain"
          />
        </View>
        <Text className="text-sm font-black text-gray-900 dark:text-white text-center">
          {category.name}
        </Text>
        <Text className="text-[10px] text-gray-500 mt-1">{t('services.exploreServices')}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className="w-[23%] items-center mb-6"
    >
      <View className="w-16 h-16 bg-gray-50 dark:bg-slate-800 rounded-2xl items-center justify-center mb-2 border border-gray-100 dark:border-slate-700 overflow-hidden">
        <Image
          source={{ uri: category.image && category.image.startsWith('http') ? category.image : PLACEHOLDER }}
          className="w-8 h-8"
          resizeMode="contain"
        />
      </View>
      <Text
        className="text-[11px] font-bold text-gray-700 dark:text-gray-300 text-center"
        numberOfLines={1}
      >
        {category.name}
      </Text>
    </TouchableOpacity>
  );
};

export default CategoryTile;
