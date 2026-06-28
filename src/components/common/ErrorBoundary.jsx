import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { COLORS } from '../../constants/colors';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // eslint-disable-next-line no-console
    console.error('[ErrorBoundary]', error, info?.componentStack);
  }

  handleReload = () => {
    this.setState({ error: null });
  };

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View className="flex-1 bg-white dark:bg-slate-900 items-center justify-center px-8">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Something went wrong
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center mb-6">
          {this.state.error.message || 'Unexpected error'}
        </Text>
        <TouchableOpacity
          onPress={this.handleReload}
          className="bg-primary px-6 py-3 rounded-xl"
        >
          <Text className="text-white font-bold">Reload</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

export default ErrorBoundary;
