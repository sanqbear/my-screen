import React from 'react';
import {View, StyleSheet} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import useStore from '@/store/useStore';
import {lightTheme, darkTheme} from '@/types/theme';
import HistoryListLayout from '@/components/historyList/HistoryListLayout';

function HistoryListScreen(): React.JSX.Element {
  const {theme} = useStore();
  const currentTheme = theme === 'light' ? lightTheme : darkTheme;

  return (
    <SafeAreaView
      style={[
        styles.container,
        {backgroundColor: currentTheme.colors.background},
      ]}>
      <View style={styles.content}>
        <HistoryListLayout />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 16,
  },
});

export default HistoryListScreen;
