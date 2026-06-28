import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useT } from '../../i18n/useT';

const { width } = Dimensions.get('window');
const SLIDE_WIDTH = width - 32;

/**
 * Home-screen promotional slider card.
 *
 * <PromoSlide item={{ id, title, subtitle, color, icon }} onPress={...} />
 */
const PromoSlide = ({ item, onPress }) => {
  const t = useT();

  return (
    <View style={{ width: SLIDE_WIDTH }} className="mr-4">
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={{ backgroundColor: item.color }}
        className="h-44 rounded-3xl p-6 justify-between overflow-hidden"
      >
        <View className="absolute -right-10 -top-10 w-40 h-40 rounded-full bg-white/10" />
        <View className="absolute -left-5 -bottom-5 w-24 h-24 rounded-full bg-black/5" />

        <View>
          <Text className="text-white/80 font-bold uppercase tracking-widest text-[10px]">
            {t('home.specialOffer')}
          </Text>
          <Text className="text-white text-3xl font-black mt-1">{item.title}</Text>
          <Text className="text-white/90 text-lg font-bold">{item.subtitle}</Text>
        </View>

        <View className="bg-white px-5 py-2 rounded-xl self-start">
          <Text style={{ color: item.color }} className="font-bold text-sm">
            {t('home.bookNow')}
          </Text>
        </View>

        <View className="absolute right-6 bottom-6">
          <Ionicons name={item.icon} size={60} color="rgba(255,255,255,0.2)" />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PromoSlide;
