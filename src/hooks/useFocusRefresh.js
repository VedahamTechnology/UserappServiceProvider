import { useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';

/**
 * Run `refresh` whenever a screen comes into focus.
 */
export const useFocusRefresh = (refresh) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useFocusEffect(useCallback(() => { refresh(); }, [refresh]));
};