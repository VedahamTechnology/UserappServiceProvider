import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <AppNavigator/>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
