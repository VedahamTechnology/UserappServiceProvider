import React, { useState, useEffect, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator, 
  RefreshControl 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Feather, Ionicons } from '@expo/vector-icons';
import { categoryService } from '../services/categoryService';
import { primaryColor } from '../constants/color';

export default function CategoryListScreen({ navigation }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCategories = useCallback(async (isRefreshing = false) => {
    if (isRefreshing) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategories(response.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white dark:bg-slate-900 border-b border-gray-100 dark:border-slate-800">
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color={primaryColor} />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-bold dark:text-white">All Categories</Text>
      </View>

      {loading && !refreshing ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={primaryColor} />
        </View>
      ) : (
        <ScrollView 
          className="flex-1 px-4 pt-6"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchCategories(true)} colors={[primaryColor]} />
          }
        >
          <View className="flex-row flex-wrap justify-between">
            {categories.map((category) => (
              <TouchableOpacity 
                key={category._id}
                className="w-[48%] bg-gray-50 dark:bg-slate-800 rounded-3xl p-6 items-center mb-4 border border-gray-100 dark:border-slate-700 shadow-sm"
                onPress={() => navigation.navigate('ServiceList', { categoryId: category._id, categoryName: category.name })}
              >
                <View className="w-20 h-20 bg-white dark:bg-slate-700 rounded-2xl items-center justify-center mb-4 shadow-sm overflow-hidden">
                  <Image 
                    source={{ 
                      uri: category.image && category.image.startsWith('http') 
                        ? category.image 
                        : 'https://cdn-icons-png.flaticon.com/512/10473/10473663.png'
                    }} 
                    className="w-12 h-12"
                    resizeMode="contain"
                  />
                </View>
                <Text className="text-sm font-black text-gray-900 dark:text-white text-center">
                  {category.name}
                </Text>
                <Text className="text-[10px] text-gray-500 mt-1">Explore Services</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View className="h-10" />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
