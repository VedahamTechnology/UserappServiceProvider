import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';


export default function App() {
  return (
 
    <NavigationContainer>
      <AppNavigator/>
    </NavigationContainer>
  );
}
